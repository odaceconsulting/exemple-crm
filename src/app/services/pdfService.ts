import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfConfigService } from './pdfConfigService';

interface QuoteItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
}

interface Quote {
    id: number;
    quoteNumber: string;
    company: string;
    contact: string;
    email?: string;
    phone?: string;
    date: string;
    expiryDate: string;
    items: QuoteItem[];
    totalAmount: number;
    taxRate: number;
    status: string;
    notes: string;
}

export const pdfService = {
    // Génération PDF standard
    generateStandardPDF: (quote: Quote) => {
        const doc = new jsPDF();
        const config = pdfConfigService.getConfig();
        const primaryRgb = pdfConfigService.hexToRgb(config.branding.primaryColor);

        // En-tête
        doc.setFontSize(20);
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text('DEVIS', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`N° ${quote.quoteNumber}`, 105, 28, { align: 'center' });

        // Informations entreprise (à gauche)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(config.company.name, 20, 45);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(config.company.address, 20, 51);
        doc.text(config.company.city, 20, 56);
        doc.text(`Tél: ${config.company.phone}`, 20, 61);
        doc.text(`Email: ${config.company.email}`, 20, 66);

        // Informations client (à droite)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENT', 130, 45);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(quote.company, 130, 51);
        doc.text(`Contact: ${quote.contact}`, 130, 56);

        // Dates
        doc.text(`Date: ${new Date(quote.date).toLocaleDateString('fr-FR')}`, 130, 66);
        doc.text(`Validité: ${new Date(quote.expiryDate).toLocaleDateString('fr-FR')}`, 130, 71);

        // Ligne de séparation
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 78, 190, 78);

        // Tableau des articles
        const tableData = quote.items.map(item => {
            const subtotal = item.quantity * item.unitPrice;
            const discountAmount = subtotal * ((item.discount || 0) / 100);
            const total = subtotal - discountAmount;

            return [
                item.description,
                item.quantity.toString(),
                `€${item.unitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`,
                item.discount ? `${item.discount}%` : '-',
                `€${total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`
            ];
        });

        autoTable(doc, {
            startY: 85,
            head: [['Description', 'Qté', 'Prix unitaire', 'Remise', 'Total HT']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 9
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 30, halign: 'right' }
            }
        });

        // Récapitulatif
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Calculer les montants
        const totalBrutHT = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalRemise = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * ((item.discount || 0) / 100)), 0);
        const totalNetHT = quote.totalAmount;
        const totalTVA = totalNetHT * (quote.taxRate / 100);
        const totalTTC = totalNetHT + totalTVA;

        const summaryX = 130;
        doc.setFontSize(9);

        if (totalRemise > 0) {
            doc.text('Montant brut HT:', summaryX, finalY);
            doc.text(`€${totalBrutHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY, { align: 'right' });

            doc.setTextColor(220, 38, 38); // Rouge
            doc.text('Remise totale:', summaryX, finalY + 6);
            doc.text(`-€${totalRemise.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY + 6, { align: 'right' });
            doc.setTextColor(0, 0, 0);

            doc.setFont('helvetica', 'bold');
            doc.text('Montant net HT:', summaryX, finalY + 12);
            doc.text(`€${totalNetHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY + 12, { align: 'right' });
            doc.setFont('helvetica', 'normal');
        } else {
            doc.setFont('helvetica', 'bold');
            doc.text('Montant HT:', summaryX, finalY);
            doc.text(`€${totalNetHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY, { align: 'right' });
            doc.setFont('helvetica', 'normal');
        }

        const tvaY = totalRemise > 0 ? finalY + 18 : finalY + 6;
        doc.text(`TVA (${quote.taxRate}%):`, summaryX, tvaY);
        doc.text(`€${totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, tvaY, { align: 'right' });

        // Total TTC
        doc.setFillColor(37, 99, 235);
        doc.rect(summaryX - 5, tvaY + 4, 65, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TOTAL TTC:', summaryX, tvaY + 10);
        doc.text(`€${totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, tvaY + 10, { align: 'right' });

        // Notes
        if (quote.notes) {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text('Notes:', 20, tvaY + 20);
            const splitNotes = doc.splitTextToSize(quote.notes, 170);
            doc.text(splitNotes, 20, tvaY + 26);
        }

        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Devis valable jusqu\'au ' + new Date(quote.expiryDate).toLocaleDateString('fr-FR'), 105, 280, { align: 'center' });
        doc.text('Merci de votre confiance', 105, 285, { align: 'center' });

        // Télécharger
        doc.save(`Devis_${quote.quoteNumber}.pdf`);
    },

    // Génération PDF avec charte ODACE
    generateCharteODACEPDF: (quote: Quote) => {
        const doc = new jsPDF();
        const config = pdfConfigService.getConfig();
        const primaryRgb = pdfConfigService.hexToRgb(config.branding.primaryColor);

        // Bandeau supérieur avec couleur de la charte
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.rect(0, 0, 210, 30, 'F');

        // Titre en blanc
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text('DEVIS', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(config.company.name.toUpperCase(), 105, 23, { align: 'center' });

        // Numéro de devis
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`N° ${quote.quoteNumber}`, 105, 38, { align: 'center' });

        // Informations entreprise avec encadré
        doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.setLineWidth(0.5);
        doc.rect(20, 48, 80, 30);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text(config.company.name, 25, 54);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(config.company.address, 25, 60);
        doc.text(config.company.city, 25, 65);
        doc.text(`Tél: ${config.company.phone}`, 25, 70);
        doc.text(config.company.email, 25, 75);

        // Informations client avec encadré
        doc.rect(110, 48, 80, 30);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text('CLIENT', 115, 54);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(quote.company, 115, 60);
        doc.text(`Contact: ${quote.contact}`, 115, 65);
        doc.text(`Date: ${new Date(quote.date).toLocaleDateString('fr-FR')}`, 115, 70);
        doc.text(`Validité: ${new Date(quote.expiryDate).toLocaleDateString('fr-FR')}`, 115, 75);

        // Tableau des articles
        const tableData = quote.items.map(item => {
            const subtotal = item.quantity * item.unitPrice;
            const discountAmount = subtotal * ((item.discount || 0) / 100);
            const total = subtotal - discountAmount;

            return [
                item.description,
                item.quantity.toString(),
                `€${item.unitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`,
                item.discount ? `${item.discount}%` : '-',
                `€${total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`
            ];
        });

        autoTable(doc, {
            startY: 90,
            head: [['Description', 'Qté', 'Prix unitaire', 'Remise', 'Total HT']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: [240, 248, 255]
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 30, halign: 'right' }
            }
        });

        // Récapitulatif (même logique que le standard)
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        const totalBrutHT = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalRemise = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * ((item.discount || 0) / 100)), 0);
        const totalNetHT = quote.totalAmount;
        const totalTVA = totalNetHT * (quote.taxRate / 100);
        const totalTTC = totalNetHT + totalTVA;

        const summaryX = 130;
        doc.setFontSize(9);

        if (totalRemise > 0) {
            doc.text('Montant brut HT:', summaryX, finalY);
            doc.text(`€${totalBrutHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY, { align: 'right' });

            doc.setTextColor(220, 38, 38);
            doc.text('Remise totale:', summaryX, finalY + 6);
            doc.text(`-€${totalRemise.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY + 6, { align: 'right' });
            doc.setTextColor(0, 0, 0);

            doc.setFont('helvetica', 'bold');
            doc.text('Montant net HT:', summaryX, finalY + 12);
            doc.text(`€${totalNetHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY + 12, { align: 'right' });
            doc.setFont('helvetica', 'normal');
        } else {
            doc.setFont('helvetica', 'bold');
            doc.text('Montant HT:', summaryX, finalY);
            doc.text(`€${totalNetHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, finalY, { align: 'right' });
            doc.setFont('helvetica', 'normal');
        }

        const tvaY = totalRemise > 0 ? finalY + 18 : finalY + 6;
        doc.text(`TVA (${quote.taxRate}%):`, summaryX, tvaY);
        doc.text(`€${totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, tvaY, { align: 'right' });

        doc.setFillColor(37, 99, 235);
        doc.rect(summaryX - 5, tvaY + 4, 65, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TOTAL TTC:', summaryX, tvaY + 10);
        doc.text(`€${totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, 190, tvaY + 10, { align: 'right' });

        // Notes
        if (quote.notes) {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text('Notes:', 20, tvaY + 20);
            const splitNotes = doc.splitTextToSize(quote.notes, 170);
            doc.text(splitNotes, 20, tvaY + 26);
        }

        // Pied de page avec bandeau
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.rect(0, 287, 210, 10, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${config.company.name} - ${config.company.email}`, 105, 293, { align: 'center' });

        doc.save(`Devis_ODACE_${quote.quoteNumber}.pdf`);
    },

    // Génération PDF avec CGV
    generateCGVPDF: (quote: Quote) => {
        const doc = new jsPDF();
        const config = pdfConfigService.getConfig();
        const primaryRgb = pdfConfigService.hexToRgb(config.branding.primaryColor);

        // En-tête
        doc.setFontSize(20);
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text('DEVIS', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`N° ${quote.quoteNumber}`, 105, 28, { align: 'center' });

        // Informations (version compacte pour laisser place aux CGV)
        doc.setFontSize(9);
        doc.text(`Entreprise: ${config.company.name}`, 20, 40);
        doc.text(`Client: ${quote.company} - ${quote.contact}`, 20, 45);
        doc.text(`Date: ${new Date(quote.date).toLocaleDateString('fr-FR')} | Validité: ${new Date(quote.expiryDate).toLocaleDateString('fr-FR')}`, 20, 50);

        // Tableau des articles (version compacte)
        const tableData = quote.items.map(item => {
            const subtotal = item.quantity * item.unitPrice;
            const discountAmount = subtotal * ((item.discount || 0) / 100);
            const total = subtotal - discountAmount;

            return [
                item.description,
                item.quantity.toString(),
                `€${item.unitPrice.toFixed(2)}`,
                item.discount ? `${item.discount}%` : '-',
                `€${total.toFixed(2)}`
            ];
        });

        autoTable(doc, {
            startY: 58,
            head: [['Description', 'Qté', 'P.U.', 'Remise', 'Total HT']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [37, 99, 235],
                fontSize: 8
            },
            bodyStyles: {
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 25, halign: 'right' }
            }
        });

        // Récapitulatif compact
        const finalY = (doc as any).lastAutoTable.finalY + 5;
        const totalNetHT = quote.totalAmount;
        const totalTVA = totalNetHT * (quote.taxRate / 100);
        const totalTTC = totalNetHT + totalTVA;

        doc.setFontSize(8);
        doc.text(`Total HT: €${totalNetHT.toFixed(2)} | TVA (${quote.taxRate}%): €${totalTVA.toFixed(2)} | `, 20, finalY);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL TTC: €${totalTTC.toFixed(2)}`, 120, finalY);
        doc.setFont('helvetica', 'normal');

        // CGV
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text('CONDITIONS GÉNÉRALES DE VENTE', 105, finalY + 12, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        const cgvText = config.cgv.split('\n');

        let cgvY = finalY + 20;
        cgvText.forEach(line => {
            if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') ||
                line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.') || line.startsWith('7.')) {
                doc.setFont('helvetica', 'bold');
            } else {
                doc.setFont('helvetica', 'normal');
            }

            const splitLine = doc.splitTextToSize(line, 170);
            doc.text(splitLine, 20, cgvY);
            cgvY += splitLine.length * 4;
        });

        // Signature
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Bon pour accord, signature du client:', 20, 275);
        doc.text('Date: ___/___/______', 20, 280);
        doc.text('Signature:', 20, 285);

        doc.save(`Devis_CGV_${quote.quoteNumber}.pdf`);
    },

    // Fonction pour générer un aperçu (retourne le blob au lieu de télécharger)
    generatePreviewPDF: (quote: Quote): Blob => {
        const doc = new jsPDF();

        // Utilise le même code que generateStandardPDF mais retourne le blob
        doc.setFontSize(20);
        doc.setTextColor(37, 99, 235);
        doc.text('APERÇU DU DEVIS', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`N° ${quote.quoteNumber}`, 105, 28, { align: 'center' });

        // Informations simplifiées pour l'aperçu
        doc.setFontSize(9);
        doc.text(`Client: ${quote.company}`, 20, 45);
        doc.text(`Contact: ${quote.contact}`, 20, 50);
        doc.text(`Date: ${new Date(quote.date).toLocaleDateString('fr-FR')}`, 20, 55);

        // Tableau
        const tableData = quote.items.map(item => [
            item.description,
            item.quantity.toString(),
            `€${item.unitPrice.toFixed(2)}`,
            item.discount ? `${item.discount}%` : '-',
            `€${(item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Description', 'Qté', 'P.U.', 'Remise', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
            bodyStyles: { fontSize: 9 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        const totalTTC = quote.totalAmount * (1 + quote.taxRate / 100);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL TTC: €${totalTTC.toFixed(2)}`, 105, finalY, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('Ceci est un aperçu - Document non contractuel', 105, finalY + 10, { align: 'center' });

        return doc.output('blob');
    }
};
