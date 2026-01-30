import { DocumentNotification } from '@/app/types';

/**
 * Service for managing document-related notifications
 */
export class NotificationService {
    private notifications: Map<string, DocumentNotification> = new Map();
    private userNotifications: Map<string, string[]> = new Map(); // userId -> notificationIds

    /**
     * Create a new notification
     */
    createNotification(
        documentId: string,
        userId: string,
        type: DocumentNotification['type'],
        title: string,
        message: string,
        actionUrl?: string,
        metadata?: Record<string, any>
    ): DocumentNotification {
        const id = this.generateId();

        const notification: DocumentNotification = {
            id,
            documentId,
            userId,
            type,
            title,
            message,
            actionUrl,
            read: false,
            createdAt: new Date(),
            metadata,
        };

        this.notifications.set(id, notification);

        // Index by user
        const userNotifs = this.userNotifications.get(userId) || [];
        userNotifs.push(id);
        this.userNotifications.set(userId, userNotifs);

        // In a real implementation, this would also send email/push notifications
        this.sendNotification(notification);

        return notification;
    }

    /**
     * Notify about document upload
     */
    notifyUpload(
        documentId: string,
        documentName: string,
        uploadedBy: string,
        recipients: string[]
    ): void {
        recipients.forEach((userId) => {
            if (userId === uploadedBy) return; // Don't notify uploader

            this.createNotification(
                documentId,
                userId,
                'upload',
                'New Document Uploaded',
                `${uploadedBy} uploaded "${documentName}"`,
                `/documents/${documentId}`
            );
        });
    }

    /**
     * Notify about document update
     */
    notifyUpdate(
        documentId: string,
        documentName: string,
        updatedBy: string,
        recipients: string[],
        changes?: string
    ): void {
        recipients.forEach((userId) => {
            if (userId === updatedBy) return;

            this.createNotification(
                documentId,
                userId,
                'update',
                'Document Updated',
                `${updatedBy} updated "${documentName}"${changes ? `: ${changes}` : ''}`,
                `/documents/${documentId}`
            );
        });
    }

    /**
     * Notify about document share
     */
    notifyShare(
        documentId: string,
        documentName: string,
        sharedBy: string,
        sharedWith: string,
        permission: string
    ): void {
        this.createNotification(
            documentId,
            sharedWith,
            'share',
            'Document Shared With You',
            `${sharedBy} shared "${documentName}" with you (${permission} access)`,
            `/documents/${documentId}`
        );
    }

    /**
     * Notify about approval request
     */
    notifyApproval(
        documentId: string,
        documentName: string,
        requestedBy: string,
        approver: string
    ): void {
        this.createNotification(
            documentId,
            approver,
            'approval',
            'Approval Required',
            `${requestedBy} requested your approval for "${documentName}"`,
            `/documents/${documentId}/approve`
        );
    }

    /**
     * Notify about signature request
     */
    notifySignature(
        documentId: string,
        documentName: string,
        requestedBy: string,
        signer: string
    ): void {
        this.createNotification(
            documentId,
            signer,
            'signature',
            'Signature Required',
            `${requestedBy} requested your signature on "${documentName}"`,
            `/documents/${documentId}/sign`
        );
    }

    /**
     * Notify about document expiration
     */
    notifyExpiration(
        documentId: string,
        documentName: string,
        expiryDate: Date,
        recipients: string[]
    ): void {
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        const message =
            daysUntilExpiry > 0
                ? `"${documentName}" will expire in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`
                : `"${documentName}" has expired`;

        recipients.forEach((userId) => {
            this.createNotification(
                documentId,
                userId,
                'expiration',
                'Document Expiration',
                message,
                `/documents/${documentId}`
            );
        });
    }

    /**
     * Notify about document access
     */
    notifyAccess(
        documentId: string,
        documentName: string,
        accessedBy: string,
        owner: string,
        action: string
    ): void {
        this.createNotification(
            documentId,
            owner,
            'access',
            'Document Accessed',
            `${accessedBy} ${action} "${documentName}"`,
            `/documents/${documentId}/activity`
        );
    }

    /**
     * Get notification by ID
     */
    getNotification(id: string): DocumentNotification | undefined {
        return this.notifications.get(id);
    }

    /**
     * Get all notifications for a user
     */
    getUserNotifications(
        userId: string,
        filters?: {
            read?: boolean;
            type?: DocumentNotification['type'];
            limit?: number;
        }
    ): DocumentNotification[] {
        const notificationIds = this.userNotifications.get(userId) || [];
        let notifications = notificationIds
            .map((id) => this.notifications.get(id))
            .filter((n): n is DocumentNotification => n !== undefined);

        // Apply filters
        if (filters) {
            if (filters.read !== undefined) {
                notifications = notifications.filter((n) => n.read === filters.read);
            }
            if (filters.type) {
                notifications = notifications.filter((n) => n.type === filters.type);
            }
        }

        // Sort by creation date (newest first)
        notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Apply limit
        if (filters?.limit) {
            notifications = notifications.slice(0, filters.limit);
        }

        return notifications;
    }

    /**
     * Get unread count for a user
     */
    getUnreadCount(userId: string): number {
        return this.getUserNotifications(userId, { read: false }).length;
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): void {
        const notification = this.notifications.get(notificationId);
        if (!notification) return;

        notification.read = true;
        notification.readAt = new Date();
        this.notifications.set(notificationId, notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead(userId: string): number {
        const notifications = this.getUserNotifications(userId, { read: false });
        notifications.forEach((notification) => {
            this.markAsRead(notification.id);
        });
        return notifications.length;
    }

    /**
     * Delete notification
     */
    deleteNotification(notificationId: string): boolean {
        const notification = this.notifications.get(notificationId);
        if (!notification) return false;

        // Remove from user index
        const userNotifs = this.userNotifications.get(notification.userId) || [];
        const filtered = userNotifs.filter((id) => id !== notificationId);
        this.userNotifications.set(notification.userId, filtered);

        return this.notifications.delete(notificationId);
    }

    /**
     * Delete all notifications for a user
     */
    deleteAllUserNotifications(userId: string): number {
        const notificationIds = this.userNotifications.get(userId) || [];
        notificationIds.forEach((id) => this.notifications.delete(id));

        const count = notificationIds.length;
        this.userNotifications.set(userId, []);

        return count;
    }

    /**
     * Clean up old read notifications
     */
    cleanupOldNotifications(daysToKeep: number = 30): number {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        let deletedCount = 0;

        this.notifications.forEach((notification, id) => {
            if (notification.read && notification.readAt && notification.readAt < cutoffDate) {
                this.deleteNotification(id);
                deletedCount++;
            }
        });

        return deletedCount;
    }

    /**
     * Send notification (simulated - would integrate with email/push services)
     */
    private sendNotification(notification: DocumentNotification): void {
        console.log(`Sending notification: ${notification.title} to user ${notification.userId}`);

        // In a real implementation, this would:
        // 1. Send email notification
        // 2. Send push notification
        // 3. Send in-app notification
        // 4. Send SMS if configured
    }

    /**
     * Schedule expiration checks
     */
    async checkExpirations(documents: Array<{ id: string; name: string; expiryDate?: Date; owners: string[] }>): Promise<void> {
        const now = new Date();
        const warningThreshold = new Date();
        warningThreshold.setDate(warningThreshold.getDate() + 7); // Warn 7 days before

        documents.forEach((doc) => {
            if (!doc.expiryDate) return;

            // Already expired
            if (doc.expiryDate < now) {
                this.notifyExpiration(doc.id, doc.name, doc.expiryDate, doc.owners);
            }
            // Expiring soon
            else if (doc.expiryDate < warningThreshold) {
                this.notifyExpiration(doc.id, doc.name, doc.expiryDate, doc.owners);
            }
        });
    }

    private generateId(): string {
        return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Singleton instance
export const notificationService = new NotificationService();
