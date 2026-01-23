import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import {
  Settings,
  Bell,
  Lock,
  Zap,
  Database,
  Users,
  Palette,
  Save,
  ToggleRight,
  ToggleLeft,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Mail,
  Phone,
  DollarSign,
  MoreVertical
} from 'lucide-react';

const SettingsComponent = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addIntegrationDialogOpen, setAddIntegrationDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'User' });
  const [newIntegrationForm, setNewIntegrationForm] = useState({ name: '', type: 'email' });
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editIntegrationDialogOpen, setEditIntegrationDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'integration', id: number } | null>(null);
  const [settings, setSettings] = useState({
    companyName: 'CRM Pro Template',
    companyEmail: 'contact@crmpro.com',
    companyPhone: '+33 1 23 45 67 89',
    defaultCurrency: 'EUR',
    taxRate: 20,
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true
  });

  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'SendGrid Email', status: 'active', type: 'email' },
    { id: 2, name: 'Twilio SMS', status: 'active', type: 'sms' },
    { id: 3, name: 'WhatsApp Business', status: 'active', type: 'whatsapp' },
    { id: 4, name: 'Google Calendar', status: 'active', type: 'calendar' },
    { id: 5, name: 'Stripe Payment', status: 'active', type: 'payment' },
    { id: 6, name: 'QuickBooks', status: 'inactive', type: 'accounting' }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Marie Dupont', email: 'marie@crmpro.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jean Martin', email: 'jean@crmpro.com', role: 'Manager', status: 'active' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@crmpro.com', role: 'User', status: 'active' }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères!');
      return;
    }
    console.log('Password changed:', passwordForm);
    alert('Mot de passe modifié avec succès!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordDialogOpen(false);
  };

  const handleAddUser = () => {
    if (!newUserForm.name || !newUserForm.email) {
      alert('Veuillez remplir tous les champs!');
      return;
    }
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'active'
    };
    setUsers([...users, newUser]);
    console.log('User added:', newUser);
    alert('Utilisateur ajouté avec succès!');
    setNewUserForm({ name: '', email: '', role: 'User' });
    setAddUserDialogOpen(false);
  };

  const handleAddIntegration = () => {
    if (!newIntegrationForm.name) {
      alert('Veuillez remplir le nom de l\'intégration!');
      return;
    }
    const newIntegration = {
      id: Math.max(...integrations.map(i => i.id)) + 1,
      name: newIntegrationForm.name,
      type: newIntegrationForm.type,
      status: 'active'
    };
    setIntegrations([...integrations, newIntegration]);
    console.log('Integration added:', newIntegration);
    alert('Intégration ajoutée avec succès!');
    setNewIntegrationForm({ name: '', type: 'email' });
    setAddIntegrationDialogOpen(false);
  };

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
    setEditUserDialogOpen(true);
  };

  const handleSaveEditUser = () => {
    if (!editingUser.name || !editingUser.email) {
      alert('Veuillez remplir tous les champs!');
      return;
    }
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    console.log('User updated:', editingUser);
    alert('Utilisateur modifié avec succès!');
    setEditUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleEditIntegration = (integration: any) => {
    setEditingIntegration({ ...integration });
    setEditIntegrationDialogOpen(true);
  };

  const handleSaveEditIntegration = () => {
    if (!editingIntegration.name) {
      alert('Veuillez remplir le nom de l\'intégration!');
      return;
    }
    setIntegrations(integrations.map(i => i.id === editingIntegration.id ? editingIntegration : i));
    console.log('Integration updated:', editingIntegration);
    alert('Intégration modifiée avec succès!');
    setEditIntegrationDialogOpen(false);
    setEditingIntegration(null);
  };

  const handleDeleteUser = (id: number) => {
    setDeleteTarget({ type: 'user', id });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteIntegration = (id: number) => {
    setDeleteTarget({ type: 'integration', id });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'user') {
      const userName = users.find(u => u.id === deleteTarget.id)?.name;
      setUsers(users.filter(u => u.id !== deleteTarget.id));
      alert(`Utilisateur ${userName} supprimé avec succès!`);
    } else {
      const integrationName = integrations.find(i => i.id === deleteTarget.id)?.name;
      setIntegrations(integrations.filter(i => i.id !== deleteTarget.id));
      alert(`Intégration ${integrationName} supprimée avec succès!`);
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
          </div>
          Paramètres
        </h1>
        <p className="text-gray-500 mt-2">Configurez votre système CRM selon vos besoins</p>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-md">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full border-b-2 border-gray-200 rounded-none bg-gradient-to-r from-gray-50 to-blue-50 p-0 overflow-x-auto">
            <TabsTrigger 
              value="general" 
              className="px-3 md:px-6 py-4 border-b-3 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none flex items-center gap-2 whitespace-nowrap text-sm md:text-base text-gray-600 data-[state=active]:text-blue-600 hover:text-blue-500 transition-all duration-200"
            >
              <Settings className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">Général</span>
              <span className="sm:hidden font-medium">Gén.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="px-3 md:px-6 py-4 border-b-3 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-orange-50 rounded-none flex items-center gap-2 whitespace-nowrap text-sm md:text-base text-gray-600 data-[state=active]:text-orange-600 hover:text-orange-500 transition-all duration-200"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">Notifications</span>
              <span className="sm:hidden font-medium">Notif.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="px-3 md:px-6 py-4 border-b-3 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50 rounded-none flex items-center gap-2 whitespace-nowrap text-sm md:text-base text-gray-600 data-[state=active]:text-purple-600 hover:text-purple-500 transition-all duration-200"
            >
              <Zap className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">Intégrations</span>
              <span className="sm:hidden font-medium">Intég.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="px-3 md:px-6 py-4 border-b-3 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-green-50 rounded-none flex items-center gap-2 whitespace-nowrap text-sm md:text-base text-gray-600 data-[state=active]:text-green-600 hover:text-green-500 transition-all duration-200"
            >
              <Users className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">Utilisateurs</span>
              <span className="sm:hidden font-medium">Utilis.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="px-3 md:px-6 py-4 border-b-3 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-red-50 rounded-none flex items-center gap-2 whitespace-nowrap text-sm md:text-base text-gray-600 data-[state=active]:text-red-600 hover:text-red-500 transition-all duration-200"
            >
              <Lock className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">Sécurité</span>
              <span className="sm:hidden font-medium">Sécur.</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="p-4 md:p-6 space-y-6">
            {/* Company Info Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Informations Entreprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                    <Input
                      value={settings.companyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyName', e.target.value)}
                      placeholder="Nom de votre entreprise"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email principal
                    </label>
                    <Input
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyEmail', e.target.value)}
                      placeholder="contact@example.com"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      value={settings.companyPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyPhone', e.target.value)}
                      placeholder="+33 1 23 45 67 89"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Devise par défaut
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (₣)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Taux de TVA (%)</label>
                    <Input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('taxRate', e.target.value)}
                      placeholder="20"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Langue par défaut</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </button>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="p-4 md:p-6 space-y-6">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Préférences de Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { key: 'notificationsEnabled', label: 'Activer les notifications', description: 'Recevez les alertes système', icon: Bell },
                    { key: 'emailNotifications', label: 'Notifications Email', description: 'Recevez les alertes par email', icon: Mail },
                    { key: 'smsNotifications', label: 'Notifications SMS', description: 'Recevez les alertes par SMS', icon: Phone },
                    { key: 'whatsappNotifications', label: 'Notifications WhatsApp', description: 'Recevez les alertes sur WhatsApp', icon: Zap }
                  ].map((item) => (
                    <div key={item.key} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-white transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <item.icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        {settings[item.key as keyof typeof settings] ? (
                          <ToggleRight className="h-6 w-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </button>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Intégrations API</h3>
                <p className="text-sm text-gray-500 mt-1">Connectez vos outils favoris</p>
              </div>
              <Dialog open={addIntegrationDialogOpen} onOpenChange={setAddIntegrationDialogOpen}>
                <DialogTrigger asChild>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter une intégration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="integration-name" className="text-sm mb-1 block">Nom de l'intégration</Label>
                      <Input
                        id="integration-name"
                        placeholder="Ex: SendGrid Email"
                        value={newIntegrationForm.name}
                        onChange={(e) => setNewIntegrationForm({ ...newIntegrationForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="integration-type" className="text-sm mb-1 block">Type</Label>
                      <Select value={newIntegrationForm.type} onValueChange={(value) => setNewIntegrationForm({ ...newIntegrationForm, type: value })}>
                        <SelectTrigger id="integration-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="payment">Paiement</SelectItem>
                          <SelectItem value="calendar">Calendrier</SelectItem>
                          <SelectItem value="accounting">Comptabilité</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button onClick={handleAddIntegration} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Ajouter
                      </Button>
                      <Button onClick={() => setAddIntegrationDialogOpen(false)} variant="outline" className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Zap className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{integration.type}</p>
                        </div>
                      </div>
                      <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-gray-100 text-gray-700 border-0'}>
                        {integration.status === 'active' ? '✓ Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="flex justify-end pt-3 border-t border-gray-100">
                      <DropdownMenu open={openDropdown === integration.id} onOpenChange={(open) => setOpenDropdown(open ? integration.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="h-5 w-5 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700"
                            onSelect={() => {
                              handleEditIntegration(integration);
                              setOpenDropdown(null);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            onSelect={() => {
                              handleDeleteIntegration(integration.id);
                              setOpenDropdown(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Gestion des utilisateurs</h3>
                <p className="text-sm text-gray-500 mt-1">Gérez l'accès de votre équipe</p>
              </div>
              <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-name" className="text-sm mb-1 block">Nom complet</Label>
                      <Input
                        id="user-name"
                        placeholder="Ex: Marie Dupont"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email" className="text-sm mb-1 block">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="Ex: marie@crmpro.com"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-role" className="text-sm mb-1 block">Rôle</Label>
                      <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}>
                        <SelectTrigger id="user-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button onClick={handleAddUser} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Ajouter
                      </Button>
                      <Button onClick={() => setAddUserDialogOpen(false)} variant="outline" className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge className="bg-green-100 text-green-700 border-0">Actif</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {users.map((user) => (
                <Card key={user.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{user.email}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">Actif</Badge>
                    </div>
                    <div className="flex gap-2 mb-3 pt-3 border-t border-gray-100">
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="p-4 md:p-6 space-y-6">
            {/* Authentication */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">Authentification à deux facteurs (2FA)</p>
                    <p className="text-sm text-gray-600 mt-1">Sécurisez votre compte avec 2FA</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">Modifier le mot de passe</p>
                    <p className="text-sm text-gray-600 mt-1">Changez votre mot de passe régulièrement</p>
                  </div>
                  <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                        Modifier
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Modifier le mot de passe</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-pwd" className="text-sm mb-1 block">Mot de passe actuel</Label>
                          <Input
                            id="current-pwd"
                            type="password"
                            placeholder="Entrez votre mot de passe actuel"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-pwd" className="text-sm mb-1 block">Nouveau mot de passe</Label>
                          <Input
                            id="new-pwd"
                            type="password"
                            placeholder="Entrez votre nouveau mot de passe (min 8 caractères)"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirm-pwd" className="text-sm mb-1 block">Confirmer le mot de passe</Label>
                          <Input
                            id="confirm-pwd"
                            type="password"
                            placeholder="Confirmez votre nouveau mot de passe"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Button onClick={handlePasswordChange} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            Modifier
                          </Button>
                          <Button onClick={() => setPasswordDialogOpen(false)} variant="outline" className="flex-1">
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Sessions actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-gray-900">Votre appareil actuel</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                    <div>
                      <p className="text-gray-600">Navigateur</p>
                      <p className="text-gray-900 font-medium">Chrome</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Adresse IP</p>
                      <p className="text-gray-900 font-medium">192.168.1.1</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Déconnectez tous les appareils
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-user-name" className="text-sm mb-1 block">Nom complet</Label>
                <Input
                  id="edit-user-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-email" className="text-sm mb-1 block">Email</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-role" className="text-sm mb-1 block">Rôle</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                  <SelectTrigger id="edit-user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-3">
                <Button onClick={handleSaveEditUser} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Enregistrer
                </Button>
                <Button onClick={() => setEditUserDialogOpen(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Integration Dialog */}
      <Dialog open={editIntegrationDialogOpen} onOpenChange={setEditIntegrationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'intégration</DialogTitle>
          </DialogHeader>
          {editingIntegration && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-integration-name" className="text-sm mb-1 block">Nom de l'intégration</Label>
                <Input
                  id="edit-integration-name"
                  value={editingIntegration.name}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-integration-type" className="text-sm mb-1 block">Type</Label>
                <Select value={editingIntegration.type} onValueChange={(value) => setEditingIntegration({ ...editingIntegration, type: value })}>
                  <SelectTrigger id="edit-integration-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="payment">Paiement</SelectItem>
                    <SelectItem value="calendar">Calendrier</SelectItem>
                    <SelectItem value="accounting">Comptabilité</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-integration-status" className="text-sm mb-1 block">Statut</Label>
                <Select value={editingIntegration.status} onValueChange={(value) => setEditingIntegration({ ...editingIntegration, status: value })}>
                  <SelectTrigger id="edit-integration-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-3">
                <Button onClick={handleSaveEditIntegration} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Enregistrer
                </Button>
                <Button onClick={() => setEditIntegrationDialogOpen(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'user' 
                ? `Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action ne peut pas être annulée.`
                : `Êtes-vous sûr de vouloir supprimer cette intégration? Cette action ne peut pas être annulée.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="flex-1">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsComponent;
