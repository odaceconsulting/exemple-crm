import { Folder, Workspace, FolderPermission, WorkspaceMember } from '@/app/types';

/**
 * Service for managing folders and workspaces in the GED system
 */
export class FolderService {
    private folders: Map<string, Folder> = new Map();
    private workspaces: Map<string, Workspace> = new Map();

    /**
     * Create a new folder
     */
    createFolder(
        name: string,
        parentId?: string,
        workspaceId?: string,
        userId?: string
    ): Folder {
        const id = this.generateId();
        const path = this.buildPath(parentId);

        const folder: Folder = {
            id,
            name,
            parentId,
            workspaceId,
            path: path ? `${path}/${name}` : name,
            createdBy: userId || 'system',
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [],
        };

        this.folders.set(id, folder);
        return folder;
    }

    /**
     * Get folder by ID
     */
    getFolder(id: string): Folder | undefined {
        return this.folders.get(id);
    }

    /**
     * Get all folders in a workspace
     */
    getFoldersByWorkspace(workspaceId: string): Folder[] {
        return Array.from(this.folders.values()).filter(
            (folder) => folder.workspaceId === workspaceId
        );
    }

    /**
     * Get child folders
     */
    getChildFolders(parentId: string): Folder[] {
        return Array.from(this.folders.values()).filter(
            (folder) => folder.parentId === parentId
        );
    }

    /**
     * Get root folders (no parent)
     */
    getRootFolders(workspaceId?: string): Folder[] {
        return Array.from(this.folders.values()).filter(
            (folder) => !folder.parentId && (!workspaceId || folder.workspaceId === workspaceId)
        );
    }

    /**
     * Update folder
     */
    updateFolder(id: string, updates: Partial<Folder>): Folder | undefined {
        const folder = this.folders.get(id);
        if (!folder) return undefined;

        const updatedFolder = {
            ...folder,
            ...updates,
            updatedAt: new Date(),
        };

        this.folders.set(id, updatedFolder);
        return updatedFolder;
    }

    /**
     * Delete folder (and optionally its children)
     */
    deleteFolder(id: string, recursive: boolean = false): boolean {
        const folder = this.folders.get(id);
        if (!folder) return false;

        if (recursive) {
            const children = this.getChildFolders(id);
            children.forEach((child) => this.deleteFolder(child.id, true));
        } else {
            // Check if folder has children
            const hasChildren = this.getChildFolders(id).length > 0;
            if (hasChildren) {
                throw new Error('Cannot delete folder with children. Use recursive delete.');
            }
        }

        return this.folders.delete(id);
    }

    /**
     * Move folder to a new parent
     */
    moveFolder(folderId: string, newParentId?: string): Folder | undefined {
        const folder = this.folders.get(folderId);
        if (!folder) return undefined;

        // Prevent moving folder into itself or its descendants
        if (newParentId && this.isDescendant(newParentId, folderId)) {
            throw new Error('Cannot move folder into itself or its descendants');
        }

        const newPath = this.buildPath(newParentId);
        const updatedFolder = {
            ...folder,
            parentId: newParentId,
            path: newPath ? `${newPath}/${folder.name}` : folder.name,
            updatedAt: new Date(),
        };

        this.folders.set(folderId, updatedFolder);

        // Update paths of all descendants
        this.updateDescendantPaths(folderId);

        return updatedFolder;
    }

    /**
     * Create a new workspace
     */
    createWorkspace(
        name: string,
        description: string,
        type: Workspace['type'],
        ownerId: string
    ): Workspace {
        const id = this.generateId();

        const workspace: Workspace = {
            id,
            name,
            description,
            type,
            ownerId,
            members: [
                {
                    userId: ownerId,
                    role: 'owner',
                    joinedAt: new Date(),
                },
            ],
            folders: [],
            settings: {
                defaultPermissions: 'private',
                allowExternalSharing: false,
                requireApproval: false,
                enableVersioning: true,
                maxFileSize: 100, // 100 MB
                allowedFileTypes: ['*'],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.workspaces.set(id, workspace);
        return workspace;
    }

    /**
     * Get workspace by ID
     */
    getWorkspace(id: string): Workspace | undefined {
        return this.workspaces.get(id);
    }

    /**
     * Get all workspaces for a user
     */
    getUserWorkspaces(userId: string): Workspace[] {
        return Array.from(this.workspaces.values()).filter((workspace) =>
            workspace.members.some((member) => member.userId === userId)
        );
    }

    /**
     * Add member to workspace
     */
    addWorkspaceMember(
        workspaceId: string,
        userId: string,
        role: WorkspaceMember['role']
    ): Workspace | undefined {
        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) return undefined;

        // Check if user is already a member
        const existingMember = workspace.members.find((m) => m.userId === userId);
        if (existingMember) {
            throw new Error('User is already a member of this workspace');
        }

        const updatedWorkspace = {
            ...workspace,
            members: [
                ...workspace.members,
                {
                    userId,
                    role,
                    joinedAt: new Date(),
                },
            ],
            updatedAt: new Date(),
        };

        this.workspaces.set(workspaceId, updatedWorkspace);
        return updatedWorkspace;
    }

    /**
     * Remove member from workspace
     */
    removeWorkspaceMember(workspaceId: string, userId: string): Workspace | undefined {
        const workspace = this.workspaces.get(workspaceId);
        if (!workspace) return undefined;

        // Prevent removing the owner
        const member = workspace.members.find((m) => m.userId === userId);
        if (member?.role === 'owner') {
            throw new Error('Cannot remove the workspace owner');
        }

        const updatedWorkspace = {
            ...workspace,
            members: workspace.members.filter((m) => m.userId !== userId),
            updatedAt: new Date(),
        };

        this.workspaces.set(workspaceId, updatedWorkspace);
        return updatedWorkspace;
    }

    /**
     * Get folder tree structure
     */
    getFolderTree(workspaceId?: string): FolderTreeNode[] {
        const rootFolders = this.getRootFolders(workspaceId);
        return rootFolders.map((folder) => this.buildTreeNode(folder));
    }

    /**
     * Search folders by name
     */
    searchFolders(query: string, workspaceId?: string): Folder[] {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.folders.values()).filter(
            (folder) =>
                folder.name.toLowerCase().includes(lowerQuery) &&
                (!workspaceId || folder.workspaceId === workspaceId)
        );
    }

    // Private helper methods

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private buildPath(parentId?: string): string {
        if (!parentId) return '';

        const parent = this.folders.get(parentId);
        if (!parent) return '';

        return parent.path;
    }

    private isDescendant(potentialDescendantId: string, ancestorId: string): boolean {
        let current = this.folders.get(potentialDescendantId);

        while (current) {
            if (current.id === ancestorId) return true;
            if (!current.parentId) break;
            current = this.folders.get(current.parentId);
        }

        return false;
    }

    private updateDescendantPaths(folderId: string): void {
        const children = this.getChildFolders(folderId);
        const parent = this.folders.get(folderId);

        if (!parent) return;

        children.forEach((child) => {
            const updatedChild = {
                ...child,
                path: `${parent.path}/${child.name}`,
                updatedAt: new Date(),
            };
            this.folders.set(child.id, updatedChild);
            this.updateDescendantPaths(child.id);
        });
    }

    private buildTreeNode(folder: Folder): FolderTreeNode {
        const children = this.getChildFolders(folder.id);
        return {
            ...folder,
            children: children.map((child) => this.buildTreeNode(child)),
        };
    }
}

export interface FolderTreeNode extends Folder {
    children: FolderTreeNode[];
}

// Singleton instance
export const folderService = new FolderService();
