import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Smartphone, Send, Save, User, Hash } from 'lucide-react';

export const SMSEditor = () => {
    const [message, setMessage] = useState('');
    const maxLength = 160;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Editor Side */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Nom de la campagne</Label>
                    <Input placeholder="Promo Flash Avril" />
                </div>

                <div className="space-y-2">
                    <Label>Destinataires</Label>
                    <div className="flex gap-2">
                        <Input placeholder="Rechercher une liste ou un segment..." />
                        <Button variant="outline">Importer CSV</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Message</Label>
                        <span className={`text-xs ${message.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
                            {message.length} / {maxLength} caractères ({Math.ceil(message.length / maxLength)} SMS)
                        </span>
                    </div>
                    <textarea
                        className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Votre message ici..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex gap-2 text-xs">
                        <Button variant="outline" size="sm" onClick={() => setMessage(prev => prev + ' {prenom}')}>
                            <User className="h-3 w-3 mr-1" /> Prénom
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setMessage(prev => prev + ' {nom}')}>
                            <User className="h-3 w-3 mr-1" /> Nom
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setMessage(prev => prev + ' {coupon}')}>
                            <Hash className="h-3 w-3 mr-1" /> Code Promo
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => alert("Brouillon SMS sauvegardé !")}>
                        <Save className="h-4 w-4 mr-2" />
                        Brouillon
                    </Button>
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
                        if (!message) return alert("Veuillez écrire un message.");
                        alert(`SMS envoyé à la liste sélectionnée ! (${Math.ceil(message.length / 160)} SMS par destinataire)`);
                    }}>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer Maintenant
                    </Button>
                </div>
            </div>

            {/* Preview Side */}
            <div className="flex justify-center items-center bg-gray-100 rounded-xl p-8">
                <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-800 relative overflow-hidden shadow-2xl">
                    {/* Notch */}
                    <div className="absolute top-0 w-40 h-6 bg-black left-1/2 transform -translate-x-1/2 rounded-b-xl z-10"></div>

                    {/* Screen Content */}
                    <div className="bg-white w-full h-full pt-12 px-4 pb-4 flex flex-col relative overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Smartphone className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Votre Entreprise</p>
                                <p className="text-[10px] text-gray-400">Aujourd'hui, 10:45</p>
                            </div>
                        </div>

                        {/* Message Bubble */}
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[90%] self-start text-sm text-gray-800 shadow-sm">
                            {message || "Aperçu de votre message..."}
                            <div className="text-[10px] text-right text-gray-400 mt-1">10:45</div>
                        </div>

                        <div className="mt-auto text-center text-xs text-gray-400">
                            STOP au 36111 pour se désabonner
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
