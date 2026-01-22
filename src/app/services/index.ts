// Export de tous les services
export { authService, permissionService } from './authService';
export { apiIntegrationService, exportService, searchService } from './apiService';
export { dataService, reportService, validationService, filterService, cacheService } from './dataService';
export { utils, stringUtils, dateUtils } from '../utils/helpers';

// Export de la configuration
export { default as config, systemConfig, uiConfig, moduleConfig, reportConfig } from '../config';
