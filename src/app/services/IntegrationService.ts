import { DocumentLink } from '@/app/types';

/**
 * Service for integrating documents with other CRM modules
 */
export class IntegrationService {
    private documentLinks: Map<string, DocumentLink> = new Map();
    private linksByDocument: Map<string, string[]> = new Map(); // documentId -> linkIds
    private linksByEntity: Map<string, string[]> = new Map(); // entityType:entityId -> linkIds

    /**
     * Link a document to an entity
     */
    linkDocument(
        documentId: string,
        linkedTo: DocumentLink['linkedTo'],
        linkType: DocumentLink['linkType'],
        createdBy: string,
        metadata?: Record<string, any>
    ): DocumentLink {
        const id = this.generateId();

        const link: DocumentLink = {
            id,
            documentId,
            linkedTo,
            linkType,
            createdBy,
            createdAt: new Date(),
            metadata,
        };

        this.documentLinks.set(id, link);

        // Index by document
        const docLinks = this.linksByDocument.get(documentId) || [];
        docLinks.push(id);
        this.linksByDocument.set(documentId, docLinks);

        // Index by entity
        const entityKey = `${linkedTo.type}:${linkedTo.id}`;
        const entityLinks = this.linksByEntity.get(entityKey) || [];
        entityLinks.push(id);
        this.linksByEntity.set(entityKey, entityLinks);

        return link;
    }

    /**
     * Unlink a document from an entity
     */
    unlinkDocument(linkId: string): boolean {
        const link = this.documentLinks.get(linkId);
        if (!link) return false;

        // Remove from document index
        const docLinks = this.linksByDocument.get(link.documentId) || [];
        this.linksByDocument.set(
            link.documentId,
            docLinks.filter((id) => id !== linkId)
        );

        // Remove from entity index
        const entityKey = `${link.linkedTo.type}:${link.linkedTo.id}`;
        const entityLinks = this.linksByEntity.get(entityKey) || [];
        this.linksByEntity.set(
            entityKey,
            entityLinks.filter((id) => id !== linkId)
        );

        return this.documentLinks.delete(linkId);
    }

    /**
     * Get all links for a document
     */
    getDocumentLinks(documentId: string): DocumentLink[] {
        const linkIds = this.linksByDocument.get(documentId) || [];
        return linkIds
            .map((id) => this.documentLinks.get(id))
            .filter((link): link is DocumentLink => link !== undefined);
    }

    /**
     * Get all documents linked to an entity
     */
    getEntityDocuments(
        entityType: DocumentLink['linkedTo']['type'],
        entityId: string
    ): DocumentLink[] {
        const entityKey = `${entityType}:${entityId}`;
        const linkIds = this.linksByEntity.get(entityKey) || [];
        return linkIds
            .map((id) => this.documentLinks.get(id))
            .filter((link): link is DocumentLink => link !== undefined);
    }

    /**
     * Link document to company
     */
    linkToCompany(
        documentId: string,
        companyId: string,
        companyName: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'related'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'company', id: companyId, name: companyName },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to contact
     */
    linkToContact(
        documentId: string,
        contactId: string,
        contactName: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'related'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'contact', id: contactId, name: contactName },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to opportunity
     */
    linkToOpportunity(
        documentId: string,
        opportunityId: string,
        opportunityName: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'attachment'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'opportunity', id: opportunityId, name: opportunityName },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to invoice
     */
    linkToInvoice(
        documentId: string,
        invoiceId: string,
        invoiceNumber: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'attachment'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'invoice', id: invoiceId, name: invoiceNumber },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to project
     */
    linkToProject(
        documentId: string,
        projectId: string,
        projectName: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'attachment'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'project', id: projectId, name: projectName },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to employee
     */
    linkToEmployee(
        documentId: string,
        employeeId: string,
        employeeName: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'attachment'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'employee', id: employeeId, name: employeeName },
            linkType,
            createdBy
        );
    }

    /**
     * Link document to email
     */
    linkToEmail(
        documentId: string,
        emailId: string,
        emailSubject: string,
        createdBy: string,
        linkType: DocumentLink['linkType'] = 'attachment'
    ): DocumentLink {
        return this.linkDocument(
            documentId,
            { type: 'email', id: emailId, name: emailSubject },
            linkType,
            createdBy
        );
    }

    /**
     * Get documents by type for an entity
     */
    getEntityDocumentsByType(
        entityType: DocumentLink['linkedTo']['type'],
        entityId: string,
        linkType: DocumentLink['linkType']
    ): DocumentLink[] {
        return this.getEntityDocuments(entityType, entityId).filter(
            (link) => link.linkType === linkType
        );
    }

    /**
     * Get attachment count for an entity
     */
    getAttachmentCount(
        entityType: DocumentLink['linkedTo']['type'],
        entityId: string
    ): number {
        return this.getEntityDocumentsByType(entityType, entityId, 'attachment').length;
    }

    /**
     * Bulk link documents to an entity
     */
    bulkLinkDocuments(
        documentIds: string[],
        linkedTo: DocumentLink['linkedTo'],
        linkType: DocumentLink['linkType'],
        createdBy: string
    ): DocumentLink[] {
        return documentIds.map((documentId) =>
            this.linkDocument(documentId, linkedTo, linkType, createdBy)
        );
    }

    /**
     * Move document links from one entity to another
     */
    moveLinks(
        fromEntityType: DocumentLink['linkedTo']['type'],
        fromEntityId: string,
        toEntityType: DocumentLink['linkedTo']['type'],
        toEntityId: string,
        toEntityName: string
    ): number {
        const links = this.getEntityDocuments(fromEntityType, fromEntityId);
        let movedCount = 0;

        links.forEach((link) => {
            // Create new link
            this.linkDocument(
                link.documentId,
                { type: toEntityType, id: toEntityId, name: toEntityName },
                link.linkType,
                link.createdBy,
                link.metadata
            );

            // Remove old link
            this.unlinkDocument(link.id);
            movedCount++;
        });

        return movedCount;
    }

    /**
     * Get link statistics
     */
    getLinkStatistics(): LinkStatistics {
        const totalLinks = this.documentLinks.size;
        const linksByType: Record<string, number> = {};
        const linksByEntityType: Record<string, number> = {};

        this.documentLinks.forEach((link) => {
            // Count by link type
            linksByType[link.linkType] = (linksByType[link.linkType] || 0) + 1;

            // Count by entity type
            linksByEntityType[link.linkedTo.type] =
                (linksByEntityType[link.linkedTo.type] || 0) + 1;
        });

        return {
            totalLinks,
            linksByType,
            linksByEntityType,
        };
    }

    /**
     * Find orphaned documents (not linked to any entity)
     */
    findOrphanedDocuments(allDocumentIds: string[]): string[] {
        return allDocumentIds.filter((docId) => {
            const links = this.linksByDocument.get(docId) || [];
            return links.length === 0;
        });
    }

    /**
     * Export document links for an entity
     */
    exportEntityLinks(
        entityType: DocumentLink['linkedTo']['type'],
        entityId: string
    ): ExportedLink[] {
        const links = this.getEntityDocuments(entityType, entityId);

        return links.map((link) => ({
            documentId: link.documentId,
            linkType: link.linkType,
            createdAt: link.createdAt.toISOString(),
            createdBy: link.createdBy,
            metadata: link.metadata,
        }));
    }

    /**
     * Import document links
     */
    importLinks(
        linkedTo: DocumentLink['linkedTo'],
        links: ExportedLink[]
    ): number {
        let importedCount = 0;

        links.forEach((exportedLink) => {
            try {
                this.linkDocument(
                    exportedLink.documentId,
                    linkedTo,
                    exportedLink.linkType,
                    exportedLink.createdBy,
                    exportedLink.metadata
                );
                importedCount++;
            } catch (error) {
                console.error(`Failed to import link for document ${exportedLink.documentId}:`, error);
            }
        });

        return importedCount;
    }

    private generateId(): string {
        return `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

interface LinkStatistics {
    totalLinks: number;
    linksByType: Record<string, number>;
    linksByEntityType: Record<string, number>;
}

interface ExportedLink {
    documentId: string;
    linkType: DocumentLink['linkType'];
    createdAt: string;
    createdBy: string;
    metadata?: Record<string, any>;
}

// Singleton instance
export const integrationService = new IntegrationService();
