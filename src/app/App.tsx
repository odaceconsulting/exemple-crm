import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  FolderOpen, 
  FileText, 
  Briefcase, 
  UserSquare2, 
  Mail,
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Search,
  User,
  Menu,
  X,
  CreditCard,
  BarChart3,
  FileCheck
} from 'lucide-react';
import Dashboard from '@/app/components/Dashboard';
import Companies from '@/app/components/Companies';
import Contacts from '@/app/components/Contacts';
import Pipeline from '@/app/components/Pipeline';
import Documents from '@/app/components/Documents';
import Invoicing from '@/app/components/Invoicing';
import Projects from '@/app/components/Projects';
import HR from '@/app/components/HR';
import Marketing from '@/app/components/Marketing';
import Payments from '@/app/components/Payments';
import Accounting from '@/app/components/Accounting';
import Quotes from '@/app/components/Quotes';
import Settings from '@/app/components/Settings';
import { Input } from '@/app/components/ui/input';

type PageType = 'dashboard' | 'companies' | 'contacts' | 'pipeline' | 'documents' | 'invoicing' | 'projects' | 'hr' | 'marketing' | 'payments' | 'accounting' | 'quotes' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'companies', name: 'Compagnies', icon: Building2 },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { id: 'pipeline', name: 'Pipeline Commercial', icon: TrendingUp },
    { id: 'documents', name: 'GED', icon: FolderOpen },
    { id: 'invoicing', name: 'Facturation', icon: FileText },
    { id: 'quotes', name: 'Devis', icon: FileCheck },
    { id: 'payments', name: 'Paiements', icon: CreditCard },
    { id: 'accounting', name: 'Comptabilité', icon: BarChart3 },
    { id: 'projects', name: 'Projets', icon: Briefcase },
    { id: 'hr', name: 'RH', icon: UserSquare2 },
    { id: 'marketing', name: 'Marketing', icon: Mail },
  ];

  // Grouped sidebar categories for better organization
  const sidebarCategories = [
    {
      title: 'Général',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Ventes',
      items: [
        { id: 'pipeline', name: 'Pipeline', icon: TrendingUp },
        { id: 'companies', name: 'Compagnies', icon: Building2 },
        { id: 'contacts', name: 'Contacts', icon: Users },
        { id: 'quotes', name: 'Devis', icon: FileCheck },
        { id: 'invoicing', name: 'Facturation', icon: FileText },
      ],
    },
    {
      title: 'Finance',
      items: [
        { id: 'payments', name: 'Paiements', icon: CreditCard },
        { id: 'accounting', name: 'Comptabilité', icon: BarChart3 },
      ],
    },
    {
      title: 'Opérations',
      items: [
        { id: 'projects', name: 'Projets', icon: Briefcase },
        { id: 'documents', name: 'GED', icon: FolderOpen },
      ],
    },
    {
      title: 'Équipe',
      items: [
        { id: 'hr', name: 'RH', icon: UserSquare2 },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { id: 'marketing', name: 'Marketing', icon: Mail },
      ],
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return <Companies />;
      case 'contacts':
        return <Contacts />;
      case 'pipeline':
        return <Pipeline />;
      case 'documents':
        return <Documents />;
      case 'invoicing':
        return <Invoicing />;
      case 'quotes':
        return <Quotes />;
      case 'payments':
        return <Payments />;
      case 'accounting':
        return <Accounting />;
      case 'projects':
        return <Projects />;
      case 'hr':
        return <HR />;
      case 'marketing':
        return <Marketing />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId as PageType);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile by default */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${mobileMenuOpen ? 'w-64 md:w-20' : ''} bg-slate-900 text-white flex flex-col transition-all duration-300 ${mobileMenuOpen ? 'fixed' : 'hidden'} md:relative h-full z-40 md:z-auto md:flex`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 flex-1">
            {!sidebarCollapsed && <span className="text-xl font-semibold truncate">CRM Pro</span>}
            {sidebarCollapsed && <LayoutDashboard className="h-6 w-6 mx-auto" />}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors hidden md:block"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation (grouped by category) */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {sidebarCategories.map((cat) => (
            <div key={cat.title} className="mb-4">
              {!sidebarCollapsed && (
                <div className="px-2 mb-2 text-xs text-slate-400 uppercase font-semibold">{cat.title}</div>
              )}
              <div className="space-y-1 px-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                      }`}
                      title={sidebarCollapsed ? item.name : ''}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-800 text-slate-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button 
            onClick={() => handleNavigation('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentPage === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={sidebarCollapsed ? 'Paramètres' : ''}
          >
            <SettingsIcon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Paramètres</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors" title={sidebarCollapsed ? 'Déconnexion' : ''}>
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col w-full">
        {/* Top Bar */}
        <div className="h-14 md:h-16 bg-white border-b border-gray-200 px-3 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden md:flex flex-1 max-w-md min-w-0">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-1.5 md:p-2 relative hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-4 md:h-5 w-4 md:w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
              <User className="h-4 md:h-5 w-4 md:w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto w-full">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}

