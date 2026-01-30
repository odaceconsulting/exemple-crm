import { SearchFilter, SavedSearch, SearchSuggestion } from '@/app/types';

/**
 * Service for advanced document search with full-text and metadata filtering
 */
export class SearchService {
    private savedSearches: Map<string, SavedSearch> = new Map();
    private searchIndex: Map<string, SearchIndexEntry> = new Map();

    /**
     * Perform full-text search across documents
     */
    async searchDocuments(
        query: string,
        filters?: SearchFilter[],
        options?: SearchOptions
    ): Promise<SearchResult[]> {
        const lowerQuery = query.toLowerCase();
        const results: SearchResult[] = [];

        // Search through indexed documents
        this.searchIndex.forEach((entry, documentId) => {
            let score = 0;

            // Full-text search in content
            if (entry.content.toLowerCase().includes(lowerQuery)) {
                score += 10;

                // Boost score for title matches
                if (entry.title.toLowerCase().includes(lowerQuery)) {
                    score += 20;
                }
            }

            // Search in OCR text
            if (entry.ocrText && entry.ocrText.toLowerCase().includes(lowerQuery)) {
                score += 5;
            }

            // Search in tags
            const matchingTags = entry.tags.filter((tag) =>
                tag.toLowerCase().includes(lowerQuery)
            );
            score += matchingTags.length * 3;

            // Apply filters
            if (filters && filters.length > 0) {
                const passesFilters = this.applyFilters(entry, filters);
                if (!passesFilters) {
                    score = 0;
                }
            }

            if (score > 0) {
                results.push({
                    documentId,
                    title: entry.title,
                    snippet: this.generateSnippet(entry.content, lowerQuery),
                    score,
                    highlights: this.generateHighlights(entry, lowerQuery),
                    metadata: entry.metadata,
                });
            }
        });

        // Sort by score
        results.sort((a, b) => b.score - a.score);

        // Apply pagination
        const limit = options?.limit || 50;
        const offset = options?.offset || 0;

        return results.slice(offset, offset + limit);
    }

    /**
     * Get search suggestions as user types
     */
    async getSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
        const lowerQuery = query.toLowerCase();
        const suggestions: SearchSuggestion[] = [];

        // Search documents
        this.searchIndex.forEach((entry, documentId) => {
            if (entry.title.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    type: 'document',
                    id: documentId,
                    title: entry.title,
                    subtitle: entry.category,
                    score: this.calculateRelevanceScore(entry.title, lowerQuery),
                    highlight: this.highlightMatch(entry.title, lowerQuery),
                });
            }
        });

        // Sort by score and limit
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Save a search for later use
     */
    saveSearch(
        name: string,
        userId: string,
        filters: SearchFilter[],
        sortBy?: string,
        sortOrder?: 'asc' | 'desc',
        isPublic: boolean = false
    ): SavedSearch {
        const id = this.generateId();

        const savedSearch: SavedSearch = {
            id,
            name,
            userId,
            filters,
            sortBy,
            sortOrder,
            isPublic,
            createdAt: new Date(),
            usageCount: 0,
        };

        this.savedSearches.set(id, savedSearch);
        return savedSearch;
    }

    /**
     * Get saved search by ID
     */
    getSavedSearch(id: string): SavedSearch | undefined {
        return this.savedSearches.get(id);
    }

    /**
     * Get all saved searches for a user
     */
    getUserSavedSearches(userId: string): SavedSearch[] {
        return Array.from(this.savedSearches.values())
            .filter((search) => search.userId === userId || search.isPublic)
            .sort((a, b) => b.usageCount - a.usageCount);
    }

    /**
     * Execute a saved search
     */
    async executeSavedSearch(searchId: string, query?: string): Promise<SearchResult[]> {
        const savedSearch = this.savedSearches.get(searchId);
        if (!savedSearch) throw new Error('Saved search not found');

        // Update usage count
        savedSearch.usageCount++;
        savedSearch.lastUsed = new Date();
        this.savedSearches.set(searchId, savedSearch);

        return this.searchDocuments(query || '', savedSearch.filters);
    }

    /**
     * Delete saved search
     */
    deleteSavedSearch(id: string): boolean {
        return this.savedSearches.delete(id);
    }

    /**
     * Index a document for search
     */
    indexDocument(
        documentId: string,
        title: string,
        content: string,
        category: string,
        tags: string[],
        metadata: Record<string, any>,
        ocrText?: string
    ): void {
        this.searchIndex.set(documentId, {
            documentId,
            title,
            content,
            category,
            tags,
            metadata,
            ocrText,
            indexedAt: new Date(),
        });
    }

    /**
     * Remove document from search index
     */
    removeFromIndex(documentId: string): boolean {
        return this.searchIndex.delete(documentId);
    }

    /**
     * Update document in search index
     */
    updateIndex(
        documentId: string,
        updates: Partial<SearchIndexEntry>
    ): void {
        const entry = this.searchIndex.get(documentId);
        if (!entry) return;

        this.searchIndex.set(documentId, {
            ...entry,
            ...updates,
            indexedAt: new Date(),
        });
    }

    /**
     * Apply filters to search entry
     */
    private applyFilters(entry: SearchIndexEntry, filters: SearchFilter[]): boolean {
        return filters.every((filter) => {
            const value = this.getNestedValue(entry.metadata, filter.field);

            switch (filter.operator) {
                case 'equals':
                    return value === filter.value;
                case 'contains':
                    return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                case 'startsWith':
                    return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
                case 'endsWith':
                    return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
                case 'greater':
                    return value > filter.value;
                case 'less':
                    return value < filter.value;
                case 'between':
                    return Array.isArray(filter.value) && value >= filter.value[0] && value <= filter.value[1];
                case 'in':
                    return Array.isArray(filter.value) && filter.value.includes(value);
                default:
                    return true;
            }
        });
    }

    /**
     * Generate search snippet
     */
    private generateSnippet(content: string, query: string, maxLength: number = 150): string {
        const lowerContent = content.toLowerCase();
        const index = lowerContent.indexOf(query);

        if (index === -1) {
            return content.substring(0, maxLength) + '...';
        }

        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 100);

        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';

        return snippet;
    }

    /**
     * Generate highlights for search results
     */
    private generateHighlights(entry: SearchIndexEntry, query: string): string[] {
        const highlights: string[] = [];
        const lowerContent = entry.content.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Find all occurrences
        let index = lowerContent.indexOf(lowerQuery);
        while (index !== -1 && highlights.length < 3) {
            const start = Math.max(0, index - 30);
            const end = Math.min(entry.content.length, index + query.length + 30);
            highlights.push(entry.content.substring(start, end));
            index = lowerContent.indexOf(lowerQuery, index + 1);
        }

        return highlights;
    }

    /**
     * Calculate relevance score for suggestions
     */
    private calculateRelevanceScore(text: string, query: string): number {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (lowerText === lowerQuery) return 100;
        if (lowerText.startsWith(lowerQuery)) return 80;
        if (lowerText.includes(lowerQuery)) return 50;

        // Fuzzy matching score
        let score = 0;
        for (let i = 0; i < lowerQuery.length; i++) {
            if (lowerText.includes(lowerQuery[i])) {
                score += 1;
            }
        }

        return (score / lowerQuery.length) * 30;
    }

    /**
     * Highlight matching text
     */
    private highlightMatch(text: string, query: string): string {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);

        if (index === -1) return text;

        return (
            text.substring(0, index) +
            '<mark>' +
            text.substring(index, index + query.length) +
            '</mark>' +
            text.substring(index + query.length)
        );
    }

    /**
     * Get nested value from object
     */
    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    private generateId(): string {
        return `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

interface SearchIndexEntry {
    documentId: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    metadata: Record<string, any>;
    ocrText?: string;
    indexedAt: Date;
}

interface SearchResult {
    documentId: string;
    title: string;
    snippet: string;
    score: number;
    highlights: string[];
    metadata: Record<string, any>;
}

interface SearchOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Singleton instance
export const searchService = new SearchService();
