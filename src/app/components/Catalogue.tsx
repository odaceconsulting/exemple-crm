import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { catalogService } from '@/app/services/dataService';

interface LocalCatalogItem {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
  defaultQuantity?: number;
  defaultDiscount?: number;
  vatRate?: number;
  currency?: string;
}

const Catalogue: React.FC<{ onSelect?: (item: LocalCatalogItem) => void }> = ({ onSelect }) => {
  const [items, setItems] = useState<LocalCatalogItem[]>([]);
  const [editing, setEditing] = useState<LocalCatalogItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', unitPrice: 0, defaultQuantity: 1, defaultDiscount: 0, vatRate: 20, currency: 'EUR' });

  useEffect(() => {
    const loaded = catalogService.getCatalog();
    setItems(loaded);
  }, []);

  const refresh = () => setItems(catalogService.getCatalog());

  const startEdit = (it: LocalCatalogItem) => {
    setEditing(it);
    setForm({ name: it.name, description: it.description || '', unitPrice: it.unitPrice, defaultQuantity: it.defaultQuantity || 1, defaultDiscount: it.defaultDiscount || 0, vatRate: it.vatRate || 20, currency: it.currency || 'EUR' });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', unitPrice: 0, defaultQuantity: 1, defaultDiscount: 0, vatRate: 20, currency: 'EUR' });
  };

  const save = () => {
    if (!form.name) return;
    if (editing) {
      catalogService.updateCatalogItem(editing.id, {
        name: form.name,
        description: form.description,
        unitPrice: form.unitPrice,
        defaultQuantity: form.defaultQuantity,
        defaultDiscount: form.defaultDiscount,
        vatRate: form.vatRate,
        currency: form.currency
      });
    } else {
      catalogService.addCatalogItem({
        name: form.name,
        description: form.description,
        unitPrice: form.unitPrice,
        defaultQuantity: form.defaultQuantity,
        defaultDiscount: form.defaultDiscount,
        vatRate: form.vatRate,
        currency: form.currency
      });
    }
    refresh();
    resetForm();
  };

  const remove = (id: number) => {
    if (!confirm('Supprimer cet article du catalogue ?')) return;
    catalogService.deleteCatalogItem(id);
    refresh();
  };

  return (
    <div className="min-h-[60vh]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Modifier' : 'Ajouter'} un article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label>Nom</Label>
                <Input value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prix unitaire</Label>
                  <Input type="number" value={form.unitPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, unitPrice: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Quantité par défaut</Label>
                  <Input type="number" value={form.defaultQuantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, defaultQuantity: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Remise standard (%)</Label>
                  <Input type="number" value={form.defaultDiscount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, defaultDiscount: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>TVA (%)</Label>
                  <Input type="number" value={form.vatRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, vatRate: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Devise</Label>
                <Input value={form.currency} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, currency: e.target.value })} />
              </div>

              <div className="flex gap-2">
                <Button onClick={save}>{editing ? 'Enregistrer' : 'Ajouter'}</Button>
                <Button variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste du catalogue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.length === 0 && <p className="text-gray-500">Aucun article dans le catalogue.</p>}
              {items.map(it => (
                <div key={it.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-semibold">{it.name} <span className="text-xs text-gray-500">({it.currency})</span></h4>
                    <p className="text-sm text-gray-600">{it.description}</p>
                    <p className="text-xs text-gray-500">Prix: €{it.unitPrice.toLocaleString()} • TVA: {it.vatRate}% • Remise standard: {it.defaultDiscount}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onSelect && <Button size="sm" onClick={() => onSelect(it)}>Ajouter au devis</Button>}
                    <Button size="sm" variant="outline" onClick={() => startEdit(it)}>Éditer</Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(it.id)} className="text-red-600">Suppr</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Catalogue;
