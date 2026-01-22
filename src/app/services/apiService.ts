import { Company, Contact, Invoice, Quote, Document, Project } from '@/app/types';

// Service d'export de données
export const exportService = {
  exportToCSV: (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((item) =>
      headers.map((header) => {
        const value = item[header];
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      })
    );

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    exportService.downloadFile(csv, `${filename}.csv`, 'text/csv');
  },

  exportToExcel: async (data: any[], filename: string) => {
    // Nécessite la bibliothèque xlsx
    // const XLSX = require('xlsx');
    // const ws = XLSX.utils.json_to_sheet(data);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, `${filename}.xlsx`);
    console.log('Excel export requires XLSX library');
  },

  exportToJSON: (data: any[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    exportService.downloadFile(json, `${filename}.json`, 'application/json');
  },

  downloadFile: (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  generatePDF: async (content: string, filename: string) => {
    // Nécessite html2pdf ou jsPDF
    console.log('PDF generation requires html2pdf library');
  },
};

// Service d'intégration API
export const apiIntegrationService = {
  // Email Integration (SMTP/Email Service)
  sendEmail: async (
    to: string[],
    subject: string,
    htmlContent: string,
    attachments?: Array<{ filename: string; content: string }>
  ) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          htmlContent,
          attachments,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  },

  // SMS Integration
  sendSMS: async (phoneNumber: string, message: string) => {
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message }),
      });
      return response.json();
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  },

  // WhatsApp Integration
  sendWhatsappMessage: async (
    phoneNumber: string,
    message: string,
    templateName?: string,
    variables?: Record<string, string>
  ) => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message,
          templateName,
          variables,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  },

  // Calendar Integration (Google Calendar / Outlook)
  createCalendarEvent: async (
    title: string,
    startDate: Date,
    endDate: Date,
    attendees: string[],
    description?: string
  ) => {
    try {
      const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          attendees,
          description,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Calendar event creation error:', error);
      throw error;
    }
  },

  // Payment Integration (Stripe, PayPal, etc.)
  createPaymentIntent: async (amount: number, currency: string, invoiceId: string) => {
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, invoiceId }),
      });
      return response.json();
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  },

  // Electronic Signature Integration (DocuSign, SignRequest, etc.)
  sendForSignature: async (
    documentId: string,
    recipientEmail: string,
    recipientName: string,
    signingDeadline: Date
  ) => {
    try {
      const response = await fetch('/api/signature/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          recipientEmail,
          recipientName,
          signingDeadline,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Signature send error:', error);
      throw error;
    }
  },

  // OCR Integration (Google Vision API, Tesseract, etc.)
  extractTextFromImage: async (imageUrl: string) => {
    try {
      const response = await fetch('/api/ocr/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      return response.json();
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw error;
    }
  },

  // Document Classification (AI-powered)
  classifyDocument: async (documentUrl: string) => {
    try {
      const response = await fetch('/api/ai/classify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl }),
      });
      return response.json();
    } catch (error) {
      console.error('Document classification error:', error);
      throw error;
    }
  },

  // Lead Scoring (ML-based)
  scoreLead: async (leadData: Record<string, any>) => {
    try {
      const response = await fetch('/api/ai/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      return response.json();
    } catch (error) {
      console.error('Lead scoring error:', error);
      throw error;
    }
  },

  // Accounting Software Integration (QuickBooks, Xero, etc.)
  syncWithAccounting: async (invoiceData: Invoice) => {
    try {
      const response = await fetch('/api/accounting/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      return response.json();
    } catch (error) {
      console.error('Accounting sync error:', error);
      throw error;
    }
  },

  // CRM Data Sync
  syncToExternalCRM: async (entity: string, data: any) => {
    try {
      const response = await fetch(`/api/crm/sync/${entity}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('CRM sync error:', error);
      throw error;
    }
  },
};

// Service de recherche globale
export const searchService = {
  globalSearch: async (query: string, filters?: Record<string, any>) => {
    try {
      const response = await fetch('/api/search/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters }),
      });
      return response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  searchCompanies: (companies: Company[], query: string) => {
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
    );
  },

  searchContacts: (contacts: Contact[], query: string) => {
    return contacts.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
    );
  },

  searchInvoices: (invoices: Invoice[], query: string) => {
    return invoices.filter(
      (i) =>
        i.number.toLowerCase().includes(query.toLowerCase()) ||
        i.id.toLowerCase().includes(query.toLowerCase())
    );
  },

  searchDocuments: (documents: Document[], query: string) => {
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ||
        (d.ocrText && d.ocrText.toLowerCase().includes(query.toLowerCase()))
    );
  },
};
