import { ExpenseReport } from '../../types/hr/HRTypes';

class ExpenseService {
    // Mock Data
    private expenses: ExpenseReport[] = [
        {
            id: '1',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            date: '2026-01-28',
            category: 'transport',
            amount: 45.50,
            description: 'Taxi client RDV',
            status: 'pending',
            receiptUrl: '#',
            submittedAt: '2026-01-28T14:30:00'
        },
        {
            id: '2',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            date: '2026-01-25',
            category: 'meals',
            amount: 28.00,
            description: 'Déjeuner équipe',
            status: 'approved',
            receiptUrl: '#',
            submittedAt: '2026-01-26T09:15:00',
            approvedBy: 'Julie Martin'
        },
        {
            id: '3',
            employeeId: '2',
            employeeName: 'Sophie Morel',
            date: '2026-01-20',
            category: 'accommodation',
            amount: 120.00,
            description: 'Hôtel déplacement Lyon',
            status: 'reimbursed',
            receiptUrl: '#'
        }
    ];

    async getExpenses(): Promise<ExpenseReport[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.expenses]), 500));
    }

    async submitExpense(expense: Omit<ExpenseReport, 'id' | 'status' | 'submittedAt'>): Promise<ExpenseReport> {
        const newExpense: ExpenseReport = {
            ...expense,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            submittedAt: new Date().toISOString()
        };
        this.expenses.push(newExpense);
        return new Promise(resolve => setTimeout(() => resolve(newExpense), 500));
    }

    async updateStatus(id: string, status: ExpenseReport['status']): Promise<ExpenseReport | null> {
        const expense = this.expenses.find(e => e.id === id);
        if (expense) {
            expense.status = status;
            return new Promise(resolve => setTimeout(() => resolve({ ...expense }), 300));
        }
        return null;
    }
}

export default new ExpenseService();
