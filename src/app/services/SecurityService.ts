import { DocumentSecurity, Watermark, AccessLog } from '@/app/types';
import CryptoJS from 'crypto-js';

/**
 * Service for document security features including encryption, watermarks, and access control
 */
export class SecurityService {
    private securitySettings: Map<string, DocumentSecurity> = new Map();
    private readonly ENCRYPTION_KEY = 'your-secret-key-here'; // Should be from environment

    /**
     * Encrypt document content
     */
    encryptDocument(content: string, algorithm: string = 'AES'): string {
        try {
            const encrypted = CryptoJS.AES.encrypt(content, this.ENCRYPTION_KEY).toString();
            return encrypted;
        } catch (error) {
            throw new Error(`Encryption failed: ${(error as Error).message}`);
        }
    }

    /**
     * Decrypt document content
     */
    decryptDocument(encryptedContent: string): string {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, this.ENCRYPTION_KEY);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error(`Decryption failed: ${(error as Error).message}`);
        }
    }

    /**
     * Apply watermark to PDF (returns configuration for client-side rendering)
     */
    createWatermark(
        text: string,
        options?: Partial<Watermark>
    ): Watermark {
        return {
            text,
            opacity: options?.opacity || 0.3,
            rotation: options?.rotation || 45,
            position: options?.position || 'diagonal',
            color: options?.color || '#000000',
            fontSize: options?.fontSize || 48,
        };
    }

    /**
     * Set security settings for a document
     */
    setDocumentSecurity(
        documentId: string,
        settings: Partial<DocumentSecurity>
    ): DocumentSecurity {
        const existing = this.securitySettings.get(documentId);

        const security: DocumentSecurity = {
            documentId,
            encrypted: settings.encrypted || false,
            encryptionAlgorithm: settings.encryptionAlgorithm,
            watermark: settings.watermark,
            downloadRestricted: settings.downloadRestricted || false,
            printRestricted: settings.printRestricted || false,
            expiryDate: settings.expiryDate,
            accessLog: existing?.accessLog || [],
        };

        this.securitySettings.set(documentId, security);
        return security;
    }

    /**
     * Get security settings for a document
     */
    getDocumentSecurity(documentId: string): DocumentSecurity | undefined {
        return this.securitySettings.get(documentId);
    }

    /**
     * Log document access
     */
    logAccess(
        documentId: string,
        userId: string,
        action: AccessLog['action'],
        ipAddress: string,
        userAgent: string,
        success: boolean = true,
        details?: string
    ): void {
        const security = this.securitySettings.get(documentId);
        if (!security) return;

        const log: AccessLog = {
            id: this.generateId(),
            documentId,
            userId,
            action,
            timestamp: new Date(),
            ipAddress,
            userAgent,
            success,
            details,
        };

        security.accessLog.push(log);
        this.securitySettings.set(documentId, security);
    }

    /**
     * Get access logs for a document
     */
    getAccessLogs(
        documentId: string,
        filters?: {
            userId?: string;
            action?: AccessLog['action'];
            startDate?: Date;
            endDate?: Date;
        }
    ): AccessLog[] {
        const security = this.securitySettings.get(documentId);
        if (!security) return [];

        let logs = security.accessLog;

        if (filters) {
            if (filters.userId) {
                logs = logs.filter((log) => log.userId === filters.userId);
            }
            if (filters.action) {
                logs = logs.filter((log) => log.action === filters.action);
            }
            if (filters.startDate) {
                logs = logs.filter((log) => log.timestamp >= filters.startDate!);
            }
            if (filters.endDate) {
                logs = logs.filter((log) => log.timestamp <= filters.endDate!);
            }
        }

        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Check if document has expired
     */
    isDocumentExpired(documentId: string): boolean {
        const security = this.securitySettings.get(documentId);
        if (!security || !security.expiryDate) return false;

        return new Date() > security.expiryDate;
    }

    /**
     * Check if user can access document
     */
    canAccessDocument(
        documentId: string,
        userId: string,
        action: AccessLog['action']
    ): { allowed: boolean; reason?: string } {
        const security = this.securitySettings.get(documentId);

        // If no security settings, allow access
        if (!security) {
            return { allowed: true };
        }

        // Check expiry
        if (this.isDocumentExpired(documentId)) {
            return { allowed: false, reason: 'Document has expired' };
        }

        // Check download restriction
        if (action === 'download' && security.downloadRestricted) {
            return { allowed: false, reason: 'Download is restricted for this document' };
        }

        // Check print restriction
        if (action === 'print' && security.printRestricted) {
            return { allowed: false, reason: 'Printing is restricted for this document' };
        }

        return { allowed: true };
    }

    /**
     * Generate document checksum for integrity verification
     */
    generateChecksum(content: string): string {
        return CryptoJS.SHA256(content).toString();
    }

    /**
     * Verify document integrity
     */
    verifyIntegrity(content: string, expectedChecksum: string): boolean {
        const actualChecksum = this.generateChecksum(content);
        return actualChecksum === expectedChecksum;
    }

    /**
     * Get security audit report
     */
    getSecurityAudit(documentId: string): SecurityAuditReport {
        const security = this.securitySettings.get(documentId);
        const logs = this.getAccessLogs(documentId);

        const totalAccesses = logs.length;
        const failedAccesses = logs.filter((log) => !log.success).length;
        const uniqueUsers = new Set(logs.map((log) => log.userId)).size;

        const actionCounts: Record<string, number> = {};
        logs.forEach((log) => {
            actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        });

        const lastAccess = logs.length > 0 ? logs[0].timestamp : undefined;

        return {
            documentId,
            encrypted: security?.encrypted || false,
            hasWatermark: !!security?.watermark,
            downloadRestricted: security?.downloadRestricted || false,
            printRestricted: security?.printRestricted || false,
            expiryDate: security?.expiryDate,
            isExpired: this.isDocumentExpired(documentId),
            totalAccesses,
            failedAccesses,
            uniqueUsers,
            actionCounts,
            lastAccess,
            recentLogs: logs.slice(0, 10),
        };
    }

    /**
     * Clear old access logs (data retention)
     */
    clearOldLogs(documentId: string, daysToKeep: number = 90): number {
        const security = this.securitySettings.get(documentId);
        if (!security) return 0;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const originalCount = security.accessLog.length;
        security.accessLog = security.accessLog.filter(
            (log) => log.timestamp >= cutoffDate
        );

        this.securitySettings.set(documentId, security);
        return originalCount - security.accessLog.length;
    }

    private generateId(): string {
        return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

interface SecurityAuditReport {
    documentId: string;
    encrypted: boolean;
    hasWatermark: boolean;
    downloadRestricted: boolean;
    printRestricted: boolean;
    expiryDate?: Date;
    isExpired: boolean;
    totalAccesses: number;
    failedAccesses: number;
    uniqueUsers: number;
    actionCounts: Record<string, number>;
    lastAccess?: Date;
    recentLogs: AccessLog[];
}

// Singleton instance
export const securityService = new SecurityService();
