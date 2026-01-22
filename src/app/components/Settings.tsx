import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
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
  Edit2
} from 'lucide-react';

const SettingsComponent = () => {
  const [activeTab, setActiveTab] = useState('general');
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

  const [integrations] = useState([
    { id: 1, name: 'SendGrid Email', status: 'active', type: 'email' },
    { id: 2, name: 'Twilio SMS', status: 'active', type: 'sms' },
    { id: 3, name: 'WhatsApp Business', status: 'active', type: 'whatsapp' },
    { id: 4, name: 'Google Calendar', status: 'active', type: 'calendar' },
    { id: 5, name: 'Stripe Payment', status: 'active', type: 'payment' },
    { id: 6, name: 'QuickBooks', status: 'inactive', type: 'accounting' }
  ]);

  const [users] = useState([
    { id: 1, name: 'Marie Dupont', email: 'marie@crmpro.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jean Martin', email: 'jean@crmpro.com', role: 'Manager', status: 'active' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@crmpro.com', role: 'User', status: 'active' }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // API call would go here
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez votre système CRM</p>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-sm">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full border-b border-gray-200 rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="general" 
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Intégrations
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <Input
                  value={settings.companyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyName', e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email principal</label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyEmail', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <Input
                  type="tel"
                  value={settings.companyPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('companyPhone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Langue par défaut</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </button>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="p-6 space-y-6">
            <div className="space-y-4">
              {[
                { key: 'notificationsEnabled', label: 'Activer les notifications', description: 'Recevez les alertes système' },
                { key: 'emailNotifications', label: 'Notifications Email', description: 'Recevez les alertes par email' },
                { key: 'smsNotifications', label: 'Notifications SMS', description: 'Recevez les alertes par SMS' },
                { key: 'whatsappNotifications', label: 'Notifications WhatsApp', description: 'Recevez les alertes sur WhatsApp' }
              ].map((item) => (
                <div key={item.key} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </button>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Intégrations API</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une intégration
              </button>
            </div>

            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">{integration.name}</p>
                      <p className="text-xs text-gray-500">{integration.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {integration.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un utilisateur
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        <Badge className="bg-green-100 text-green-700">Actif</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Authentification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Authentification à deux facteurs (2FA)</p>
                      <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Modifier le mot de passe</p>
                      <p className="text-sm text-gray-500">Changez votre mot de passe régulièrement</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Sessions actives</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Votre appareil actuel</p>
                    <p className="text-gray-500">Navigateur: Chrome | IP: 192.168.1.1</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Déconnectez tous les appareils
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsComponent;
