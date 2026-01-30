import { UploadTask, UploadFile, UploadError } from '@/app/types';
import pako from 'pako';

/**
 * Service for handling advanced file uploads with compression and batch processing
 */
export class UploadService {
    private tasks: Map<string, UploadTask> = new Map();
    private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
    private readonly COMPRESSION_THRESHOLD = 1024 * 1024; // 1 MB

    /**
     * Create a new upload task for multiple files
     */
    createUploadTask(
        files: File[],
        folderId?: string,
        workspaceId?: string
    ): UploadTask {
        const id = this.generateId();
        const uploadFiles: UploadFile[] = files.map((file) => ({
            id: this.generateId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending',
            progress: 0,
            uploadedSize: 0,
            compressed: false,
        }));

        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        const task: UploadTask = {
            id,
            files: uploadFiles,
            folderId,
            workspaceId,
            status: 'pending',
            totalSize,
            uploadedSize: 0,
            progress: 0,
            startedAt: new Date(),
            errors: [],
        };

        this.tasks.set(id, task);
        return task;
    }

    /**
     * Start uploading files in a task
     */
    async startUpload(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error('Upload task not found');

        task.status = 'uploading';
        this.tasks.set(taskId, task);

        // Process files sequentially or in parallel
        for (const file of task.files) {
            try {
                await this.uploadFile(taskId, file.id);
            } catch (error) {
                this.addError(taskId, file.id, file.name, (error as Error).message);
            }
        }

        // Mark task as completed
        const updatedTask = this.tasks.get(taskId);
        if (updatedTask) {
            updatedTask.status = updatedTask.errors && updatedTask.errors.length > 0 ? 'failed' : 'completed';
            updatedTask.completedAt = new Date();
            this.tasks.set(taskId, updatedTask);
        }
    }

    /**
     * Upload a single file
     */
    private async uploadFile(taskId: string, fileId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error('Upload task not found');

        const file = task.files.find((f) => f.id === fileId);
        if (!file) throw new Error('File not found in task');

        // Validate file size
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error(`File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024} MB`);
        }

        file.status = 'uploading';
        this.updateTask(taskId, task);

        try {
            // Compress if needed
            let fileToUpload = file.file;
            if (this.shouldCompress(file.file)) {
                fileToUpload = await this.compressFile(file.file);
                file.compressed = true;
                file.originalSize = file.size;
            }

            // Simulate upload with progress
            await this.simulateUpload(taskId, fileId, fileToUpload);

            file.status = 'completed';
            file.progress = 100;
            file.documentId = this.generateId(); // Simulated document ID
        } catch (error) {
            file.status = 'failed';
            file.error = (error as Error).message;
            throw error;
        } finally {
            this.updateTask(taskId, task);
        }
    }

    /**
     * Check if file should be compressed
     */
    private shouldCompress(file: File): boolean {
        // Compress files larger than threshold and not already compressed
        const compressedTypes = ['image/jpeg', 'image/png', 'video/', 'audio/'];
        const isAlreadyCompressed = compressedTypes.some((type) => file.type.startsWith(type));

        return file.size > this.COMPRESSION_THRESHOLD && !isAlreadyCompressed;
    }

    /**
     * Compress file using pako (gzip)
     */
    private async compressFile(file: File): Promise<File> {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const compressed = pako.gzip(uint8Array);

        return new File([compressed], `${file.name}.gz`, {
            type: 'application/gzip',
        });
    }

    /**
     * Simulate file upload with progress tracking
     */
    private async simulateUpload(
        taskId: string,
        fileId: string,
        file: File
    ): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) return;

        const uploadFile = task.files.find((f) => f.id === fileId);
        if (!uploadFile) return;

        const chunkSize = 64 * 1024; // 64 KB chunks
        const totalChunks = Math.ceil(file.size / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 50));

            const uploadedSize = Math.min((i + 1) * chunkSize, file.size);
            uploadFile.uploadedSize = uploadedSize;
            uploadFile.progress = Math.round((uploadedSize / file.size) * 100);

            // Update task progress
            this.updateTaskProgress(taskId);
        }
    }

    /**
     * Update overall task progress
     */
    private updateTaskProgress(taskId: string): void {
        const task = this.tasks.get(taskId);
        if (!task) return;

        const totalUploaded = task.files.reduce((sum, file) => sum + file.uploadedSize, 0);
        task.uploadedSize = totalUploaded;
        task.progress = Math.round((totalUploaded / task.totalSize) * 100);

        this.tasks.set(taskId, task);
    }

    /**
     * Add error to task
     */
    private addError(taskId: string, fileId: string, fileName: string, error: string): void {
        const task = this.tasks.get(taskId);
        if (!task) return;

        if (!task.errors) task.errors = [];

        task.errors.push({
            fileId,
            fileName,
            error,
            timestamp: new Date(),
        });

        this.tasks.set(taskId, task);
    }

    /**
     * Get upload task by ID
     */
    getTask(taskId: string): UploadTask | undefined {
        return this.tasks.get(taskId);
    }

    /**
     * Cancel upload task
     */
    cancelTask(taskId: string): boolean {
        const task = this.tasks.get(taskId);
        if (!task) return false;

        task.status = 'failed';
        task.completedAt = new Date();
        this.tasks.set(taskId, task);

        return true;
    }

    /**
     * Retry failed files in a task
     */
    async retryFailedFiles(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error('Upload task not found');

        const failedFiles = task.files.filter((f) => f.status === 'failed');

        for (const file of failedFiles) {
            file.status = 'pending';
            file.error = undefined;
            file.progress = 0;
            file.uploadedSize = 0;
        }

        task.errors = [];
        this.tasks.set(taskId, task);

        await this.startUpload(taskId);
    }

    /**
     * Validate file type
     */
    validateFileType(file: File, allowedTypes: string[]): boolean {
        if (allowedTypes.includes('*')) return true;

        return allowedTypes.some((type) => {
            if (type.endsWith('/*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(category + '/');
            }
            return file.type === type;
        });
    }

    /**
     * Get supported file formats
     */
    getSupportedFormats(): Record<string, string[]> {
        return {
            documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            presentations: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
            archives: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
            text: ['text/plain', 'text/csv', 'text/html', 'text/markdown'],
        };
    }

    private updateTask(taskId: string, task: UploadTask): void {
        this.tasks.set(taskId, { ...task });
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Singleton instance
export const uploadService = new UploadService();
