import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Building2, Palette, FileText, Save, RotateCcw, Upload } from 'lucide-react';
import { pdfConfigService, PDFConfig } from '@/app/services/pdfConfigService';

interface PDFTemplateSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PDFTemplateSettings: React.FC<PDFTemplateSettingsProps> = ({ open, onOpenChange }) => {
    const [config, setConfig] = useState<PDFConfig>(pdfConfigService.getConfig());
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (open) {
            setConfig(pdfConfigService.getConfig());
            setHasChanges(false);
        }
    }, [open]);

    const handleSave = () => {
        pdfConfigService.saveConfig(config);
        setHasChanges(false);
        onOpenChange(false);
    };

    const handleReset = () => {
        if (confirm('Voulez-vous vraiment réinitialiser la configuration par défaut ?')) {
            const defaultConfig = pdfConfigService.getDefaultConfig();
            setConfig(defaultConfig);
            setHasChanges(true);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setConfig({
                    ...config,
                    company: {
                        ...config.company,
                        logo: reader.result as string
                    }
                });
                setHasChanges(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateCompany = (field: keyof PDFConfig['company'], value: string) => {
        setConfig({
            ...config,
            company: {
                ...config.company,
                [field]: value
            }
        });
        setHasChanges(true);
    };

    const updateBranding = (field: keyof PDFConfig['branding'], value: string) => {
        setConfig({
            ...config,
            branding: {
                ...config.branding,
                [field]: value
            }
        });
        setHasChanges(true);
    };

    const updateCGV = (value: string) => {
        setConfig({
            ...config,
            cgv: value
        });
        setHasChanges(true);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-6 w-6 text-blue-600" />
                        Paramètres des Templates PDF
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="company" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="company" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Entreprise
                        </TabsTrigger>
                        <TabsTrigger value="branding" className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Charte
                        </TabsTrigger>
                        <TabsTrigger value="cgv" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            CGV
                        </TabsTrigger>
                    </TabsList>

                    {/* Onglet Entreprise */}
                    <TabsContent value="company" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informations de l'entreprise</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                                        <Input
                                            id="company-name"
                                            value={config.company.name}
                                            onChange={(e) => updateCompany('name', e.target.value)}
                                            placeholder="ODACE CONSULTING"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-email">Email *</Label>
                                        <Input
                                            id="company-email"
                                            type="email"
                                            value={config.company.email}
                                            onChange={(e) => updateCompany('email', e.target.value)}
                                            placeholder="contact@odace.fr"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="company-address">Adresse *</Label>
                                    <Input
                                        id="company-address"
                                        value={config.company.address}
                                        onChange={(e) => updateCompany('address', e.target.value)}
                                        placeholder="123 Rue de la République"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="company-city">Ville *</Label>
                                        <Input
                                            id="company-city"
                                            value={config.company.city}
                                            onChange={(e) => updateCompany('city', e.target.value)}
                                            placeholder="75001 Paris"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company-phone">Téléphone *</Label>
                                        <Input
                                            id="company-phone"
                                            value={config.company.phone}
                                            onChange={(e) => updateCompany('phone', e.target.value)}
                                            placeholder="+33 1 23 45 67 89"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="company-logo">Logo (optionnel)</Label>
                                    <div className="mt-2 flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('logo-upload')?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {config.company.logo ? 'Changer le logo' : 'Ajouter un logo'}
                                        </Button>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        {config.company.logo && (
                                            <div className="flex items-center gap-2">
                                                <img src={config.company.logo} alt="Logo" className="h-12 w-auto border rounded" />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateCompany('logo', '')}
                                                    className="text-red-600"
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Format recommandé : PNG ou JPG, max 200x200px</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet Charte */}
                    <TabsContent value="branding" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Charte graphique</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="primary-color">Couleur primaire</Label>
                                        <div className="flex items-center gap-3 mt-2">
                                            <input
                                                id="primary-color"
                                                type="color"
                                                value={config.branding.primaryColor}
                                                onChange={(e) => updateBranding('primaryColor', e.target.value)}
                                                className="h-10 w-20 rounded border cursor-pointer"
                                            />
                                            <Input
                                                value={config.branding.primaryColor}
                                                onChange={(e) => updateBranding('primaryColor', e.target.value)}
                                                placeholder="#2563eb"
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Utilisée pour les titres et éléments principaux</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="secondary-color">Couleur secondaire</Label>
                                        <div className="flex items-center gap-3 mt-2">
                                            <input
                                                id="secondary-color"
                                                type="color"
                                                value={config.branding.secondaryColor}
                                                onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                                                className="h-10 w-20 rounded border cursor-pointer"
                                            />
                                            <Input
                                                value={config.branding.secondaryColor}
                                                onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                                                placeholder="#0891b2"
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Utilisée pour les dégradés et accents</p>
                                    </div>
                                </div>

                                {/* Aperçu */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <p className="text-sm font-semibold mb-3">Aperçu</p>
                                    <div className="space-y-2">
                                        <div
                                            className="h-12 rounded flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: config.branding.primaryColor }}
                                        >
                                            Couleur Primaire
                                        </div>
                                        <div
                                            className="h-12 rounded flex items-center justify-center text-white font-bold"
                                            style={{
                                                background: `linear-gradient(to right, ${config.branding.primaryColor}, ${config.branding.secondaryColor})`
                                            }}
                                        >
                                            Dégradé Primaire → Secondaire
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet CGV */}
                    <TabsContent value="cgv" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Conditions Générales de Vente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Label htmlFor="cgv-text">Texte des CGV</Label>
                                <textarea
                                    id="cgv-text"
                                    value={config.cgv}
                                    onChange={(e) => updateCGV(e.target.value)}
                                    className="w-full h-96 mt-2 p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Entrez vos conditions générales de vente..."
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Ces conditions seront affichées dans le template "CGV". Utilisez des sauts de ligne pour séparer les articles.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-600"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Réinitialiser
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
                            disabled={!hasChanges}
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PDFTemplateSettings;
