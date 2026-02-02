import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Save, Send, Eye, RefreshCw } from 'lucide-react';

interface EmailEditorProps {
    onSave: () => void;
    campaign?: any;
}

export const EmailEditor = ({ onSave, campaign }: EmailEditorProps) => {
    const [formData, setFormData] = useState({
        subject: '',
        preheader: '',
        headline: 'Bienvenue chez nous !',
        content: 'Découvrez nos dernières offres exclusives.',
        buttonText: "Profiter de l'offre",
        buttonUrl: '#',
        imageUrl: ''
    });

    useEffect(() => {
        if (campaign) {
            setFormData(prev => ({
                ...prev,
                subject: campaign.subject || '',
                headline: campaign.name ? `Newsletter: ${campaign.name}` : prev.headline
            }));
        }
    }, [campaign]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Editor Form */}
            <Card className="w-full lg:w-1/3 flex flex-col overflow-hidden">
                <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Objet de l'email</Label>
                        <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Ex: Découvrez notre nouvelle collection"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preheader">Texte de pré-en-tête</Label>
                        <Input
                            id="preheader"
                            name="preheader"
                            value={formData.preheader}
                            onChange={handleChange}
                            placeholder="Aperçu visible dans la boîte de réception"
                        />
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <h3 className="font-medium text-gray-900">Contenu</h3>

                        <div className="space-y-2">
                            <Label htmlFor="headline">Grand Titre</Label>
                            <Input
                                id="headline"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Corps du message</Label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={6}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <h3 className="font-medium text-gray-900">Call to Action</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="buttonText">Texte du bouton</Label>
                                <Input
                                    id="buttonText"
                                    name="buttonText"
                                    value={formData.buttonText}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="buttonUrl">Lien du bouton</Label>
                                <Input
                                    id="buttonUrl"
                                    name="buttonUrl"
                                    value={formData.buttonUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-gray-50 flex justify-between">
                    <Button variant="outline" onClick={() => alert("Test envoyé !")}>
                        <Send className="h-4 w-4 mr-2" /> Test
                    </Button>
                    <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" /> Sauvegarder
                    </Button>
                </div>
            </Card>

            {/* Live Preview */}
            <Card className="flex-1 overflow-hidden flex flex-col bg-gray-100 border-none shadow-inner">
                <CardHeader className="bg-white border-b py-3 px-6 flex flex-row justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-gray-400">Aperçu Bureau</span>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div className="w-full max-w-[600px] bg-white shadow-xl rounded-lg overflow-hidden min-h-[600px] h-fit">
                        {/* Email Preview Header */}
                        <div className="bg-gray-50 p-6 border-b text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="h-8 w-8 text-blue-600" />
                            </div>
                            {/* Preheader Preview */}
                            {formData.preheader && (
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{formData.preheader}</p>
                            )}
                            <h1 className="text-2xl font-bold text-gray-900">{formData.headline}</h1>
                        </div>

                        {/* Email Preview Image */}
                        {formData.imageUrl ? (
                            <div className="aspect-video bg-gray-100 w-full overflow-hidden">
                                <img src={formData.imageUrl} alt="Campaign" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-100 w-full flex items-center justify-center text-gray-400 border-b border-t border-gray-100">
                                <span>Image (Non définie)</span>
                            </div>
                        )}

                        {/* Email Preview Body */}
                        <div className="p-8 text-center space-y-6">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {formData.content}
                            </p>

                            <div className="pt-4">
                                <a
                                    href={formData.buttonUrl}
                                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {formData.buttonText}
                                </a>
                            </div>
                        </div>

                        {/* Email Preview Footer */}
                        <div className="bg-gray-50 p-6 text-center text-xs text-gray-500 border-t">
                            <p>© 2026 Votre Entreprise. Tous droits réservés.</p>
                            <p className="mt-2">
                                <a href="#" className="underline hover:text-gray-700">Se désabonner</a> • <a href="#" className="underline hover:text-gray-700">Voir dans le navigateur</a>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
