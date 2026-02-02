import { PayrollVariable, Payslip } from '../../types/hr/HRTypes';

class PayrollService {
    // Mock Data
    private variables: PayrollVariable[] = [
        {
            id: '1',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            period: '2026-01',
            type: 'bonus',
            amount: 1500,
            description: 'Prime de performance annuelle',
            status: 'approved'
        },
        {
            id: '2',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            period: '2026-01',
            type: 'overtime',
            amount: 250,
            description: 'Heures supplémentaires projet Alpha',
            status: 'pending'
        },
        {
            id: '3',
            employeeId: '2',
            employeeName: 'Sophie Morel',
            period: '2026-01',
            type: 'commission',
            amount: 800,
            description: 'Commission ventes Q4',
            status: 'approved'
        }
    ];

    private payslips: Payslip[] = [
        {
            id: '1',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            period: '2025-12',
            grossSalary: 4500,
            netSalary: 3450,
            paymentDate: '2025-12-28',
            status: 'paid',
            pdfUrl: '#'
        },
        {
            id: '2',
            employeeId: '2',
            employeeName: 'Sophie Morel',
            period: '2025-12',
            grossSalary: 3800,
            netSalary: 2900,
            paymentDate: '2025-12-28',
            status: 'paid',
            pdfUrl: '#'
        }
    ];

    async getVariables(period?: string): Promise<PayrollVariable[]> {
        if (period) {
            return new Promise(resolve => setTimeout(() => resolve(this.variables.filter(v => v.period === period)), 500));
        }
        return new Promise(resolve => setTimeout(() => resolve([...this.variables]), 500));
    }

    async getPayslips(period?: string): Promise<Payslip[]> {
        if (period) {
            return new Promise(resolve => setTimeout(() => resolve(this.payslips.filter(p => p.period === period)), 500));
        }
        return new Promise(resolve => setTimeout(() => resolve([...this.payslips]), 500));
    }

    async createVariable(variable: Omit<PayrollVariable, 'id' | 'status'>): Promise<PayrollVariable> {
        const newVar: PayrollVariable = {
            ...variable,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending'
        };
        this.variables.push(newVar);
        return new Promise(resolve => setTimeout(() => resolve(newVar), 500));
    }
}

export default new PayrollService();
