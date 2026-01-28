// Service de configuration des templates PDF
export interface PDFConfig {
    company: {
        name: string;
        address: string;
        city: string;
        phone: string;
        email: string;
        logo?: string; // Base64 encoded image
    };
    branding: {
        primaryColor: string;
        secondaryColor: string;
    };
    cgv: string;
}

const DEFAULT_CONFIG: PDFConfig = {
    company: {
        name: 'VOTRE ENTREPRISE',
        address: 'Adresse de votre entreprise',
        city: 'Code postal, Ville',
        phone: '+33 X XX XX XX XX',
        email: 'contact@entreprise.fr',
        logo: undefined
    },
    branding: {
        primaryColor: '#2563eb', // Bleu
        secondaryColor: '#0891b2'  // Cyan
    },
    cgv: `1. OBJET
Les présentes conditions générales de vente régissent les relations contractuelles entre le vendeur et le client.

2. PRIX
Les prix sont indiqués en euros hors taxes. Ils sont fermes et non révisables pendant leur durée de validité.

3. PAIEMENT
Le paiement est exigible à réception de facture. Tout retard de paiement entraînera l'application de pénalités de retard.

4. LIVRAISON
Les délais de livraison sont donnés à titre indicatif. Tout retard ne peut donner lieu à annulation de commande.

5. GARANTIE
Les produits et services sont garantis conformément aux dispositions légales en vigueur.

6. RESPONSABILITÉ
Le vendeur ne saurait être tenu responsable des dommages indirects résultant de l'utilisation des produits.

7. LITIGES
Tout litige relève de la compétence exclusive des tribunaux du siège social du vendeur.`
};

const STORAGE_KEY = 'pdf_template_config';

export const pdfConfigService = {
    // Récupérer la configuration
    getConfig: (): PDFConfig => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading PDF config:', error);
        }
        return DEFAULT_CONFIG;
    },

    // Sauvegarder la configuration
    saveConfig: (config: PDFConfig): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (error) {
            console.error('Error saving PDF config:', error);
        }
    },

    // Réinitialiser à la configuration par défaut
    resetConfig: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Obtenir la configuration par défaut
    getDefaultConfig: (): PDFConfig => {
        return { ...DEFAULT_CONFIG };
    },

    // Convertir une couleur hex en RGB pour jsPDF
    hexToRgb: (hex: string): { r: number; g: number; b: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 37, g: 99, b: 235 }; // Bleu par défaut
    }
};
