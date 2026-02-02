import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea'; // Assuming Textarea component exists
import { Upload, Plus } from 'lucide-react';

export const SubmitExpense = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nouvelle note de frais</CardTitle>
                    <CardDescription>Remplissez les détails de votre dépense pour remboursement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date de la dépense</Label>
                            <Input type="date" id="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Montant (€)</Label>
                            <Input type="number" id="amount" placeholder="0.00" min="0" step="0.01" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="meals">Repas</SelectItem>
                                <SelectItem value="accommodation">Hébergement</SelectItem>
                                <SelectItem value="supplies">Fournitures</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Ex: Déjeuner client (Entreprise XYZ)" />
                    </div>

                    <div className="space-y-2">
                        <Label>Justificatif</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Cliquez pour ajouter un fichier</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG ou PDF (max. 5MB)</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline">Annuler</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">Soumettre la demande</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
