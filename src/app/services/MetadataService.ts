import { CustomField, FieldValidation, DocumentCategory } from '@/app/types';

/**
 * Service for managing custom metadata fields
 */
export class MetadataService {
    private customFields: Map<string, CustomField> = new Map();
    private fieldsByCategory: Map<DocumentCategory, CustomField[]> = new Map();

    /**
     * Create a new custom field
     */
    createCustomField(field: Omit<CustomField, 'id'>): CustomField {
        const id = this.generateId();
        const customField: CustomField = {
            ...field,
            id,
        };

        this.customFields.set(id, customField);

        // Index by categories
        field.applicableCategories.forEach((category) => {
            const categoryFields = this.fieldsByCategory.get(category) || [];
            categoryFields.push(customField);
            this.fieldsByCategory.set(category, categoryFields);
        });

        return customField;
    }

    /**
     * Get custom field by ID
     */
    getCustomField(id: string): CustomField | undefined {
        return this.customFields.get(id);
    }

    /**
     * Get all custom fields
     */
    getAllCustomFields(): CustomField[] {
        return Array.from(this.customFields.values()).sort(
            (a, b) => a.displayOrder - b.displayOrder
        );
    }

    /**
     * Get custom fields for a specific category
     */
    getFieldsByCategory(category: DocumentCategory): CustomField[] {
        return (this.fieldsByCategory.get(category) || []).sort(
            (a, b) => a.displayOrder - b.displayOrder
        );
    }

    /**
     * Update custom field
     */
    updateCustomField(id: string, updates: Partial<CustomField>): CustomField | undefined {
        const field = this.customFields.get(id);
        if (!field) return undefined;

        // Remove from old categories
        field.applicableCategories.forEach((category) => {
            const categoryFields = this.fieldsByCategory.get(category) || [];
            const filtered = categoryFields.filter((f) => f.id !== id);
            this.fieldsByCategory.set(category, filtered);
        });

        const updatedField = { ...field, ...updates };
        this.customFields.set(id, updatedField);

        // Add to new categories
        updatedField.applicableCategories.forEach((category) => {
            const categoryFields = this.fieldsByCategory.get(category) || [];
            categoryFields.push(updatedField);
            this.fieldsByCategory.set(category, categoryFields);
        });

        return updatedField;
    }

    /**
     * Delete custom field
     */
    deleteCustomField(id: string): boolean {
        const field = this.customFields.get(id);
        if (!field) return false;

        // Remove from categories
        field.applicableCategories.forEach((category) => {
            const categoryFields = this.fieldsByCategory.get(category) || [];
            const filtered = categoryFields.filter((f) => f.id !== id);
            this.fieldsByCategory.set(category, filtered);
        });

        return this.customFields.delete(id);
    }

    /**
     * Validate field value
     */
    validateFieldValue(field: CustomField, value: any): { valid: boolean; error?: string } {
        // Check required
        if (field.required && (value === null || value === undefined || value === '')) {
            return { valid: false, error: `${field.label} is required` };
        }

        // Skip validation if value is empty and not required
        if (!field.required && (value === null || value === undefined || value === '')) {
            return { valid: true };
        }

        // Type-specific validation
        switch (field.type) {
            case 'number':
                return this.validateNumber(field, value);
            case 'email':
                return this.validateEmail(value);
            case 'url':
                return this.validateUrl(value);
            case 'date':
                return this.validateDate(value);
            case 'select':
            case 'multiselect':
                return this.validateSelect(field, value);
            case 'text':
                return this.validateText(field, value);
            default:
                return { valid: true };
        }
    }

    /**
     * Validate number field
     */
    private validateNumber(field: CustomField, value: any): { valid: boolean; error?: string } {
        const num = Number(value);
        if (isNaN(num)) {
            return { valid: false, error: `${field.label} must be a valid number` };
        }

        if (field.validation?.min !== undefined && num < field.validation.min) {
            return { valid: false, error: field.validation.message || `${field.label} must be at least ${field.validation.min}` };
        }

        if (field.validation?.max !== undefined && num > field.validation.max) {
            return { valid: false, error: field.validation.message || `${field.label} must be at most ${field.validation.max}` };
        }

        return { valid: true };
    }

    /**
     * Validate email field
     */
    private validateEmail(value: string): { valid: boolean; error?: string } {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { valid: false, error: 'Invalid email address' };
        }
        return { valid: true };
    }

    /**
     * Validate URL field
     */
    private validateUrl(value: string): { valid: boolean; error?: string } {
        try {
            new URL(value);
            return { valid: true };
        } catch {
            return { valid: false, error: 'Invalid URL' };
        }
    }

    /**
     * Validate date field
     */
    private validateDate(value: any): { valid: boolean; error?: string } {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return { valid: false, error: 'Invalid date' };
        }
        return { valid: true };
    }

    /**
     * Validate select field
     */
    private validateSelect(field: CustomField, value: any): { valid: boolean; error?: string } {
        if (!field.options) {
            return { valid: true };
        }

        if (field.type === 'multiselect') {
            if (!Array.isArray(value)) {
                return { valid: false, error: `${field.label} must be an array` };
            }
            const invalidValues = value.filter((v) => !field.options!.includes(v));
            if (invalidValues.length > 0) {
                return { valid: false, error: `Invalid values: ${invalidValues.join(', ')}` };
            }
        } else {
            if (!field.options.includes(value)) {
                return { valid: false, error: `Invalid value for ${field.label}` };
            }
        }

        return { valid: true };
    }

    /**
     * Validate text field
     */
    private validateText(field: CustomField, value: string): { valid: boolean; error?: string } {
        if (field.validation?.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
                return { valid: false, error: field.validation.message || `${field.label} format is invalid` };
            }
        }

        if (field.validation?.min !== undefined && value.length < field.validation.min) {
            return { valid: false, error: `${field.label} must be at least ${field.validation.min} characters` };
        }

        if (field.validation?.max !== undefined && value.length > field.validation.max) {
            return { valid: false, error: `${field.label} must be at most ${field.validation.max} characters` };
        }

        return { valid: true };
    }

    /**
     * Validate all fields for a document
     */
    validateDocument(
        category: DocumentCategory,
        metadata: Record<string, any>
    ): { valid: boolean; errors: Record<string, string> } {
        const fields = this.getFieldsByCategory(category);
        const errors: Record<string, string> = {};

        fields.forEach((field) => {
            const value = metadata[field.name];
            const validation = this.validateFieldValue(field, value);

            if (!validation.valid && validation.error) {
                errors[field.name] = validation.error;
            }
        });

        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    }

    /**
     * Extract metadata from document (OCR simulation)
     */
    async extractMetadata(file: File): Promise<Record<string, any>> {
        // This would integrate with an OCR service like Tesseract.js
        // For now, return basic file metadata
        return {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            lastModified: new Date(file.lastModified),
            extractedAt: new Date(),
        };
    }

    /**
     * Index document for search
     */
    async indexDocument(documentId: string, content: string, metadata: Record<string, any>): Promise<void> {
        // This would integrate with a search engine like Elasticsearch or Algolia
        // For now, just simulate indexing
        console.log(`Indexing document ${documentId} with ${content.length} characters`);
    }

    private generateId(): string {
        return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Singleton instance
export const metadataService = new MetadataService();
