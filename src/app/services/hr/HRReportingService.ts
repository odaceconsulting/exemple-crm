import { HeadcountStats, TurnoverData, PayrollMassData, AgePyramidData } from '../types/hr/HRTypes';
import EmployeeService from './EmployeeService';

class HRReportingService {
    // Get headcount statistics
    async getHeadcountStats(): Promise<HeadcountStats> {
        const employees = await EmployeeService.getEmployees();

        const byDepartment = employees.reduce((acc, emp) => {
            const existing = acc.find(d => d.department === emp.department);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ department: emp.department, count: 1 });
            }
            return acc;
        }, [] as { department: string; count: number }[]);

        const byContractType = employees.reduce((acc, emp) => {
            const existing = acc.find(c => c.type === emp.contractType);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ type: emp.contractType, count: 1 });
            }
            return acc;
        }, [] as { type: string; count: number }[]);

        const byStatus = employees.reduce((acc, emp) => {
            const existing = acc.find(s => s.status === emp.status);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ status: emp.status, count: 1 });
            }
            return acc;
        }, [] as { status: string; count: number }[]);

        return {
            total: employees.length,
            byDepartment,
            byContractType,
            byStatus,
            newHires: 2, // Simulated - employees hired in last 3 months
            departures: 1 // Simulated - employees who left in last 3 months
        };
    }

    // Calculate turnover rate
    async getTurnoverData(period: string = '2026'): Promise<TurnoverData> {
        const employees = await EmployeeService.getEmployees();
        const departures = 1; // Simulated
        const averageHeadcount = employees.length;
        const turnoverRate = (departures / averageHeadcount) * 100;

        return {
            period,
            turnoverRate: Math.round(turnoverRate * 10) / 10,
            departures,
            averageHeadcount,
            departuresByReason: [
                { reason: 'Démission', count: 1 },
                { reason: 'Licenciement', count: 0 },
                { reason: 'Retraite', count: 0 },
                { reason: 'Fin de contrat', count: 0 }
            ]
        };
    }

    // Get payroll mass data
    async getPayrollMassData(): Promise<PayrollMassData> {
        const employees = await EmployeeService.getEmployees();

        const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
        const averageSalary = totalPayroll / employees.length;

        const salaries = employees.map(e => e.salary).sort((a, b) => a - b);
        const medianSalary = salaries[Math.floor(salaries.length / 2)];

        const byDepartment = employees.reduce((acc, emp) => {
            const existing = acc.find(d => d.department === emp.department);
            if (existing) {
                existing.amount += emp.salary;
            } else {
                acc.push({ department: emp.department, amount: emp.salary });
            }
            return acc;
        }, [] as { department: string; amount: number }[]);

        return {
            totalPayroll: Math.round(totalPayroll),
            byDepartment,
            averageSalary: Math.round(averageSalary),
            medianSalary: Math.round(medianSalary),
            evolution: [
                { month: 'Jan 2026', amount: totalPayroll * 0.95 },
                { month: 'Fév 2026', amount: totalPayroll * 0.97 },
                { month: 'Mar 2026', amount: totalPayroll * 0.98 },
                { month: 'Avr 2026', amount: totalPayroll }
            ]
        };
    }

    // Generate age pyramid data
    async getAgePyramidData(): Promise<AgePyramidData> {
        const employees = await EmployeeService.getEmployees();

        const ageRanges = [
            { range: '18-25', male: 0, female: 0 },
            { range: '26-35', male: 0, female: 0 },
            { range: '36-45', male: 0, female: 0 },
            { range: '46-55', male: 0, female: 0 },
            { range: '56-65', male: 0, female: 0 }
        ];

        employees.forEach(emp => {
            const age = this.calculateAge(emp.birthDate);
            const rangeIndex = this.getAgeRangeIndex(age);

            // Simulated gender distribution (50/50)
            if (Math.random() > 0.5) {
                ageRanges[rangeIndex].male++;
            } else {
                ageRanges[rangeIndex].female++;
            }
        });

        return { ageRanges };
    }

    // Helper: Calculate age from birthdate
    private calculateAge(birthDate: string): number {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    // Helper: Get age range index
    private getAgeRangeIndex(age: number): number {
        if (age <= 25) return 0;
        if (age <= 35) return 1;
        if (age <= 45) return 2;
        if (age <= 55) return 3;
        return 4;
    }

    // Get comprehensive HR dashboard data
    async getDashboardData() {
        const [headcount, turnover, payroll, pyramid] = await Promise.all([
            this.getHeadcountStats(),
            this.getTurnoverData(),
            this.getPayrollMassData(),
            this.getAgePyramidData()
        ]);

        return {
            headcount,
            turnover,
            payroll,
            pyramid,
            summary: {
                totalEmployees: headcount.total,
                turnoverRate: turnover.turnoverRate,
                averageSalary: payroll.averageSalary,
                newHires: headcount.newHires
            }
        };
    }
}

export default new HRReportingService();
