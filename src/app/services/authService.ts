import { User, UserRole, Permission } from '@/app/types';

// Service d'authentification
export const authService = {
  currentUser: null as User | null,

  login: async (email: string, password: string): Promise<User | null> => {
    // Mock implementation - à remplacer par appel API réel
    const user: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    authService.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    authService.currentUser = null;
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    if (authService.currentUser) return authService.currentUser;
    const stored = localStorage.getItem('user');
    if (stored) {
      authService.currentUser = JSON.parse(stored);
      return authService.currentUser;
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },
};

// Service des permissions
export const permissionService = {
  permissions: new Map<string, Permission[]>(),

  initializePermissions: () => {
    // Permissions par rôle
    const adminPermissions: Permission[] = [
      { id: '1', role: 'admin', module: '*', action: '*' },
    ];

    const managerPermissions: Permission[] = [
      { id: '2', role: 'manager', module: 'dashboard', action: 'read' },
      { id: '3', role: 'manager', module: 'companies', action: 'read' },
      { id: '4', role: 'manager', module: 'companies', action: 'create' },
      { id: '5', role: 'manager', module: 'companies', action: 'update' },
      { id: '6', role: 'manager', module: 'contacts', action: 'read' },
      { id: '7', role: 'manager', module: 'contacts', action: 'create' },
      { id: '8', role: 'manager', module: 'contacts', action: 'update' },
      { id: '9', role: 'manager', module: 'pipeline', action: 'read' },
      { id: '10', role: 'manager', module: 'pipeline', action: 'update' },
      { id: '11', role: 'manager', module: 'documents', action: 'read' },
      { id: '12', role: 'manager', module: 'invoicing', action: 'read' },
    ];

    const userPermissions: Permission[] = [
      { id: '13', role: 'user', module: 'dashboard', action: 'read' },
      { id: '14', role: 'user', module: 'companies', action: 'read' },
      { id: '15', role: 'user', module: 'contacts', action: 'read' },
      { id: '16', role: 'user', module: 'pipeline', action: 'read' },
      { id: '17', role: 'user', module: 'documents', action: 'read' },
    ];

    permissionService.permissions.set('admin', adminPermissions);
    permissionService.permissions.set('manager', managerPermissions);
    permissionService.permissions.set('user', userPermissions);
  },

  hasPermission: (role: UserRole, module: string, action: string): boolean => {
    const permissions = permissionService.permissions.get(role);
    if (!permissions) return false;

    return permissions.some(
      (p) =>
        (p.module === '*' || p.module === module) &&
        (p.action === '*' || p.action === action)
    );
  },

  canView: (module: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return permissionService.hasPermission(user.role, module, 'read');
  },

  canCreate: (module: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return permissionService.hasPermission(user.role, module, 'create');
  },

  canEdit: (module: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return permissionService.hasPermission(user.role, module, 'update');
  },

  canDelete: (module: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return permissionService.hasPermission(user.role, module, 'delete');
  },
};

// Initialiser les permissions au démarrage
permissionService.initializePermissions();
