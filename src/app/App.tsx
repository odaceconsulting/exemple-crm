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
  FileCheck,
  Palette
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { useTheme } from '@/app/context/ThemeContext';

type PageType = 'dashboard' | 'companies' | 'contacts' | 'pipeline' | 'documents' | 'invoicing' | 'projects' | 'hr' | 'marketing' | 'payments' | 'accounting' | 'quotes' | 'settings';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie@crmpro.com',
    phone: '+33 1 23 45 67 89',
    company: 'CRM Pro',
    position: 'Directrice Générale'
  });
  const [editProfileData, setEditProfileData] = useState(profileData);
  const [notifications] = useState([
    { id: 1, title: 'Nouvelle opportunité', message: 'Acme Corporation a créé une nouvelle opportunité de 50 000€', time: 'Il y a 2h', read: false },
    { id: 2, title: 'Facture en attente', message: 'Facture #INV-2026-001 en attente de paiement', time: 'Il y a 4h', read: false },
    { id: 3, title: 'Événement RH', message: 'Réunion d\'équipe programmée pour demain à 14h', time: 'Il y a 1j', read: true },
    { id: 4, title: 'Document approuvé', message: 'Le contrat avec TechStart a été approuvé', time: 'Il y a 2j', read: true }
  ]);

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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfileData({ ...editProfileData, [name]: value });
  };

  const handleProfileSave = () => {
    setProfileData(editProfileData);
    setProfileOpen(false);
  };

  // On mobile, show names when menu is open; on desktop, follow collapsed state
  const shouldShowNames = typeof window !== 'undefined' && window.innerWidth < 768 ? mobileMenuOpen : !sidebarCollapsed;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile by default */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${mobileMenuOpen ? 'w-64 md:w-20' : ''} bg-slate-900 text-white flex flex-col transition-all duration-300 ${mobileMenuOpen ? 'fixed' : 'hidden'} md:relative h-full z-40 md:z-auto md:flex`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 flex-1">
            {shouldShowNames && <span className="text-xl font-semibold truncate">CRM Pro</span>}
            {!shouldShowNames && <LayoutDashboard className="h-6 w-6 mx-auto" />}
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
              {shouldShowNames && (
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
                      title={!shouldShowNames ? item.name : ''}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-800 text-slate-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      {shouldShowNames && <span className="text-sm">{item.name}</span>}
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
            title={!shouldShowNames ? 'Paramètres' : ''}
          >
            <SettingsIcon className="h-5 w-5 flex-shrink-0" />
            {shouldShowNames && <span className="text-sm">Paramètres</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors" title={!shouldShowNames ? 'Déconnexion' : ''}>
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {shouldShowNames && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col w-full">
        {/* Top Bar - Improved */}
        <div className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo and Company Name */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="h-5 w-5 text-white font-bold" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900">CRM Pro</p>
                <p className="text-xs text-gray-500">Gestion de Relation Client</p>
              </div>
            </div>

            {/* Search Bar - Desktop only */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* User Menu - Icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Theme Switcher */}
            <Dialog open={themeOpen} onOpenChange={setThemeOpen}>
              <DialogTrigger asChild>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Thème">
                  <Palette className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Thème Couleur
                  </DialogTitle>
                  <DialogDescription>
                    Sélectionnez le thème de couleur pour votre CRM
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                  {[
                    { name: 'Clair', value: 'light', color: 'bg-gray-100 border-gray-300', accent: 'ring-gray-400' },
                    { name: 'Bleu', value: 'blue', color: 'bg-blue-100 border-blue-300', accent: 'ring-blue-400' },
                    { name: 'Vert', value: 'green', color: 'bg-green-100 border-green-300', accent: 'ring-green-400' },
                    { name: 'Violet', value: 'purple', color: 'bg-purple-100 border-purple-300', accent: 'ring-purple-400' }
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value as any);
                        setThemeOpen(false);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        theme === t.value 
                          ? `${t.color} ring-2 ${t.accent} font-semibold` 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}>
                      <div className={`w-8 h-8 rounded-full ${t.color} mx-auto mb-2 border-2`}></div>
                      <p className="text-sm font-medium">{t.name}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">Le thème sélectionné s'appliquera à tout le CRM</p>
              </DialogContent>
            </Dialog>

            {/* Notifications */}
            <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DialogTrigger asChild>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors relative group" title="Notifications">
                  <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full shadow-sm animate-pulse" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notifications
                  </DialogTitle>
                  <DialogDescription>
                    Vos notifications récentes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-lg border-l-4 transition-all ${notif.read ? 'border-l-gray-200 bg-gray-50' : 'border-l-blue-600 bg-blue-50'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900">{notif.title}</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="h-2.5 w-2.5 bg-blue-600 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Profile */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Profil">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-xs">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </span>
                    </div>
                    Mon Profil
                  </DialogTitle>
                  <DialogDescription>
                    Gestion de votre profil utilisateur
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</p>
                          <p className="text-sm text-gray-600">{profileData.position}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Entreprise:</span> {profileData.company}</p>
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Email:</span> {profileData.email}</p>
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Téléphone:</span> {profileData.phone}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Edit Profile Form */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Prénom</Label>
                        <Input
                          type="text"
                          name="firstName"
                          value={editProfileData.firstName}
                          onChange={handleProfileChange}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Nom</Label>
                        <Input
                          type="text"
                          name="lastName"
                          value={editProfileData.lastName}
                          onChange={handleProfileChange}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Position</Label>
                      <Input
                        type="text"
                        name="position"
                        value={editProfileData.position}
                        onChange={handleProfileChange}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Entreprise</Label>
                      <Input
                        type="text"
                        name="company"
                        value={editProfileData.company}
                        onChange={handleProfileChange}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={editProfileData.email}
                        onChange={handleProfileChange}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Téléphone</Label>
                      <Input
                        type="tel"
                        name="phone"
                        value={editProfileData.phone}
                        onChange={handleProfileChange}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setProfileOpen(false)}
                      className="text-sm"
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={handleProfileSave}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-sm"
                    >
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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

export default function App() {
  return (
    <AppContent />
  );
}

