import { Signature, SignatureWorkflow, SignatureRequest, ReminderSchedule } from '@/app/types';

/**
 * Service for managing electronic signatures and signature workflows
 */
export class SignatureService {
    private signatures: Map<string, Signature> = new Map();
    private workflows: Map<string, SignatureWorkflow> = new Map();

    /**
     * Create a new signature workflow
     */
    createWorkflow(
        documentId: string,
        signers: Omit<SignatureRequest, 'id' | 'status'>[],
        createdBy: string,
        expiresInDays: number = 30
    ): SignatureWorkflow {
        const id = this.generateId();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const signatureRequests: SignatureRequest[] = signers.map((signer, index) => ({
            ...signer,
            id: this.generateId(),
            status: 'pending',
            order: index + 1,
        }));

        const workflow: SignatureWorkflow = {
            id,
            documentId,
            status: 'draft',
            signers: signatureRequests,
            createdBy,
            createdAt: new Date(),
            expiresAt,
            reminderSchedule: {
                frequency: 'every_2_days',
                maxReminders: 3,
                sentCount: 0,
            },
        };

        this.workflows.set(id, workflow);
        return workflow;
    }

    /**
     * Start a signature workflow (send to signers)
     */
    async startWorkflow(workflowId: string): Promise<SignatureWorkflow> {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        workflow.status = 'pending';

        // Send to first signer(s)
        const firstSigners = workflow.signers.filter((s) => s.order === 1);
        firstSigners.forEach((signer) => {
            signer.sentAt = new Date();
            this.sendSignatureRequest(signer);
        });

        this.workflows.set(workflowId, workflow);
        return workflow;
    }

    /**
     * Sign a document
     */
    async signDocument(
        workflowId: string,
        requestId: string,
        signatureData: string,
        signatureType: Signature['signatureType'],
        ipAddress: string,
        location?: string
    ): Promise<Signature> {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        const request = workflow.signers.find((s) => s.id === requestId);
        if (!request) throw new Error('Signature request not found');

        if (request.status !== 'pending') {
            throw new Error('Signature request is not pending');
        }

        // Create signature
        const signature: Signature = {
            id: this.generateId(),
            documentId: workflow.documentId,
            signerId: request.userId || requestId,
            signerName: request.name,
            signerEmail: request.email,
            signatureType,
            signatureData,
            signedAt: new Date(),
            ipAddress,
            location,
            verified: true,
            verificationMethod: 'email',
        };

        this.signatures.set(signature.id, signature);

        // Update request
        request.status = 'signed';
        request.signedAt = new Date();
        request.signature = signature;

        // Check if all signers have signed
        const allSigned = workflow.signers.every((s) => s.status === 'signed');

        if (allSigned) {
            workflow.status = 'completed';
            workflow.completedAt = new Date();
        } else {
            // Send to next signer(s)
            const nextOrder = request.order + 1;
            const nextSigners = workflow.signers.filter(
                (s) => s.order === nextOrder && s.status === 'pending'
            );

            nextSigners.forEach((signer) => {
                signer.sentAt = new Date();
                this.sendSignatureRequest(signer);
            });
        }

        this.workflows.set(workflowId, workflow);
        return signature;
    }

    /**
     * Decline to sign
     */
    async declineSignature(
        workflowId: string,
        requestId: string,
        message?: string
    ): Promise<void> {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        const request = workflow.signers.find((s) => s.id === requestId);
        if (!request) throw new Error('Signature request not found');

        request.status = 'declined';
        request.message = message;

        // Cancel the entire workflow
        workflow.status = 'cancelled';
        this.workflows.set(workflowId, workflow);
    }

    /**
     * Cancel a workflow
     */
    cancelWorkflow(workflowId: string): void {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        workflow.status = 'cancelled';
        this.workflows.set(workflowId, workflow);
    }

    /**
     * Get workflow by ID
     */
    getWorkflow(workflowId: string): SignatureWorkflow | undefined {
        return this.workflows.get(workflowId);
    }

    /**
     * Get workflows for a document
     */
    getDocumentWorkflows(documentId: string): SignatureWorkflow[] {
        return Array.from(this.workflows.values()).filter(
            (w) => w.documentId === documentId
        );
    }

    /**
     * Get pending signature requests for a user
     */
    getPendingRequests(userEmail: string): SignatureRequest[] {
        const requests: SignatureRequest[] = [];

        this.workflows.forEach((workflow) => {
            if (workflow.status === 'pending') {
                const userRequests = workflow.signers.filter(
                    (s) => s.email === userEmail && s.status === 'pending'
                );
                requests.push(...userRequests);
            }
        });

        return requests;
    }

    /**
     * Verify signature
     */
    verifySignature(signatureId: string): { valid: boolean; details: string } {
        const signature = this.signatures.get(signatureId);
        if (!signature) {
            return { valid: false, details: 'Signature not found' };
        }

        // In a real implementation, this would verify the cryptographic signature
        // For now, just check if it's marked as verified
        if (signature.verified) {
            return {
                valid: true,
                details: `Signed by ${signature.signerName} (${signature.signerEmail}) on ${signature.signedAt.toLocaleString()}`,
            };
        }

        return { valid: false, details: 'Signature verification failed' };
    }

    /**
     * Send reminder for pending signatures
     */
    async sendReminders(): Promise<void> {
        const now = new Date();

        this.workflows.forEach((workflow) => {
            if (workflow.status !== 'pending') return;
            if (!workflow.reminderSchedule) return;

            // Check if workflow has expired
            if (workflow.expiresAt && workflow.expiresAt < now) {
                workflow.status = 'expired';
                workflow.signers.forEach((s) => {
                    if (s.status === 'pending') {
                        s.status = 'expired';
                    }
                });
                this.workflows.set(workflow.id, workflow);
                return;
            }

            // Check if we should send a reminder
            const schedule = workflow.reminderSchedule;
            if (schedule.sentCount >= schedule.maxReminders) return;

            const pendingSigners = workflow.signers.filter((s) => s.status === 'pending' && s.sentAt);

            pendingSigners.forEach((signer) => {
                if (!signer.sentAt) return;

                const daysSinceSent = Math.floor(
                    (now.getTime() - signer.sentAt.getTime()) / (1000 * 60 * 60 * 24)
                );

                const shouldSendReminder =
                    (schedule.frequency === 'daily' && daysSinceSent >= 1) ||
                    (schedule.frequency === 'every_2_days' && daysSinceSent >= 2) ||
                    (schedule.frequency === 'weekly' && daysSinceSent >= 7);

                if (shouldSendReminder) {
                    this.sendSignatureReminder(signer);
                    schedule.sentCount++;
                }
            });

            this.workflows.set(workflow.id, workflow);
        });
    }

    /**
     * Send signature request (simulated)
     */
    private sendSignatureRequest(request: SignatureRequest): void {
        console.log(`Sending signature request to ${request.email}`);
        // In a real implementation, this would send an email
    }

    /**
     * Send signature reminder (simulated)
     */
    private sendSignatureReminder(request: SignatureRequest): void {
        console.log(`Sending signature reminder to ${request.email}`);
        // In a real implementation, this would send a reminder email
    }

    private generateId(): string {
        return `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Singleton instance
export const signatureService = new SignatureService();
