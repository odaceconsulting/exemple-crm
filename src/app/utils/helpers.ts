// Utilitaires généraux
export const utils = {
  // Génération d'IDs
  generateId: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  generateUUID: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // Conversion de données
  toBase64: (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  },

  fromBase64: (str: string): string => {
    return decodeURIComponent(escape(atob(str)));
  },

  // Copie en presse-papiers
  copyToClipboard: async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  },

  // Comparaison d'objets
  deepEqual: (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      return keys1.every((key) => utils.deepEqual(obj1[key], obj2[key]));
    }

    return false;
  },

  // Clonage d'objets
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) {
      const cloneArr: any[] = [];
      obj.forEach((value) => {
        cloneArr.push(utils.deepClone(value));
      });
      return cloneArr as any;
    }
    if (obj instanceof Object) {
      const cloneObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloneObj[key] = utils.deepClone((obj as any)[key]);
        }
      }
      return cloneObj;
    }
    return obj;
  },

  // Fusion d'objets
  mergeObjects: <T>(target: T, source: Partial<T>): T => {
    return { ...target, ...source } as T;
  },

  // Délai
  delay: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // Retry avec backoff exponentiel
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxAttempts - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await utils.delay(delay);
        }
      }
    }

    throw lastError;
  },

  // Calculs financiers
  calculateTax: (amount: number, taxRate: number): number => {
    return amount * (taxRate / 100);
  },

  calculateDiscount: (amount: number, discountPercent: number): number => {
    return amount * (discountPercent / 100);
  },

  calculateTotal: (
    subtotal: number,
    tax: number = 0,
    discount: number = 0
  ): number => {
    return subtotal + tax - discount;
  },

  calculateROI: (investedAmount: number, returnAmount: number): number => {
    return ((returnAmount - investedAmount) / investedAmount) * 100;
  },

  // Statistiques
  calculateAverage: (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  },

  calculatePercentage: (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  findMax: <T extends Record<string, any>>(
    items: T[],
    field: string
  ): T | null => {
    if (items.length === 0) return null;
    return items.reduce((max, item) =>
      item[field] > max[field] ? item : max
    );
  },

  findMin: <T extends Record<string, any>>(
    items: T[],
    field: string
  ): T | null => {
    if (items.length === 0) return null;
    return items.reduce((min, item) =>
      item[field] < min[field] ? item : min
    );
  },

  // Gestion d'erreurs
  logError: (error: Error, context?: string): void => {
    console.error(
      `[ERROR${context ? ' - ' + context : ''}] ${error.message}`,
      error
    );
  },

  logWarning: (message: string, context?: string): void => {
    console.warn(`[WARNING${context ? ' - ' + context : ''}] ${message}`);
  },

  logInfo: (message: string, context?: string): void => {
    console.log(`[INFO${context ? ' - ' + context : ''}] ${message}`);
  },

  // Gestion de limites
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Validation de collections
  isEmpty: <T>(collection: T[] | Record<string, any>): boolean => {
    if (Array.isArray(collection)) {
      return collection.length === 0;
    }
    return Object.keys(collection).length === 0;
  },

  // Conversion de tableaux
  arrayToMap: <T extends Record<string, any>>(
    items: T[],
    keyField: string
  ): Map<string, T> => {
    return new Map(items.map((item) => [item[keyField], item]));
  },

  // Pagination
  getPaginationInfo: (
    page: number,
    pageSize: number,
    totalItems: number
  ): { startIndex: number; endIndex: number; totalPages: number } => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const totalPages = Math.ceil(totalItems / pageSize);

    return { startIndex, endIndex, totalPages };
  },

  // Format de fichier
  getFileExtension: (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // Recherche et correspondance
  fuzzySearch: (query: string, items: string[]): string[] => {
    const queryLower = query.toLowerCase();
    const queryChars = queryLower.split('');

    return items.filter((item) => {
      let itemIndex = 0;

      for (let i = 0; i < queryChars.length; i++) {
        const char = queryChars[i];
        itemIndex = item.toLowerCase().indexOf(char, itemIndex);

        if (itemIndex === -1) {
          return false;
        }

        itemIndex++;
      }

      return true;
    });
  },

  // Extraction de données
  extractFieldValues: <T extends Record<string, any>>(
    items: T[],
    field: string
  ): any[] => {
    return items
      .map((item) => item[field])
      .filter((value) => value !== undefined && value !== null);
  },

  // Transformation
  transformArray: <T, R>(
    items: T[],
    transform: (item: T) => R
  ): R[] => {
    return items.map(transform);
  },
};

// Export des utilitaires séparément
export const stringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-');
  },

  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  removeSpecialCharacters: (str: string): string => {
    return str.replace(/[^\w\s]/g, '');
  },

  reverseString: (str: string): string => {
    return str.split('').reverse().join('');
  },
};

export const dateUtils = {
  now: (): Date => new Date(),

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  getDaysDifference: (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  },

  isOverdue: (dueDate: Date): boolean => {
    return new Date() > dueDate;
  },

  isToday: (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },

  formatTime: (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDateTime: (date: Date): string => {
    return date.toLocaleString('fr-FR');
  },

  getStartOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  getEndOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },
};
