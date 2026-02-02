import { LeaveRequest, LeaveCounter, LeaveAlert } from '../types/hr/HRTypes';

class LeaveService {
    // Get all leave requests
    async getLeaveRequests(): Promise<LeaveRequest[]> {
        return [
            {
                id: '1',
                employeeId: '1',
                employeeName: 'Marie Dupont',
                type: 'vacation',
                startDate: '2026-02-10',
                endDate: '2026-02-21',
                days: 10,
                reason: 'Vacances d\'hiver',
                status: 'approved',
                validatedBy: 'Sophie Bernard',
                validatedAt: '2026-01-25',
                createdAt: '2026-01-20'
            },
            {
                id: '2',
                employeeId: '2',
                employeeName: 'Thomas Martin',
                type: 'sick',
                startDate: '2026-01-28',
                endDate: '2026-01-30',
                days: 3,
                reason: 'Grippe',
                status: 'pending',
                createdAt: '2026-01-28'
            },
            {
                id: '3',
                employeeId: '4',
                employeeName: 'Lucas Petit',
                type: 'personal',
                startDate: '2026-02-05',
                endDate: '2026-02-05',
                days: 1,
                reason: 'Rendez-vous médical',
                status: 'approved',
                validatedBy: 'Marie Dupont',
                validatedAt: '2026-01-30',
                createdAt: '2026-01-29'
            }
        ];
    }

    // Create leave request
    async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'createdAt'>): Promise<LeaveRequest> {
        const newRequest: LeaveRequest = {
            ...request,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        return newRequest;
    }

    // Validate leave request
    async validateLeaveRequest(
        requestId: string,
        status: 'approved' | 'rejected',
        validatorName: string,
        comments?: string
    ): Promise<LeaveRequest> {
        const requests = await this.getLeaveRequests();
        const request = requests.find(r => r.id === requestId);
        if (!request) throw new Error('Leave request not found');

        return {
            ...request,
            status,
            validatedBy: validatorName,
            validatedAt: new Date().toISOString(),
            comments
        };
    }

    // Get leave counters for all employees
    async getLeaveCounters(): Promise<LeaveCounter[]> {
        return [
            {
                employeeId: '1',
                employeeName: 'Marie Dupont',
                vacation: { total: 25, used: 10, remaining: 15 },
                sick: { total: 10, used: 2, remaining: 8 },
                personal: { total: 5, used: 1, remaining: 4 },
                year: 2026
            },
            {
                employeeId: '2',
                employeeName: 'Thomas Martin',
                vacation: { total: 25, used: 5, remaining: 20 },
                sick: { total: 10, used: 3, remaining: 7 },
                personal: { total: 5, used: 0, remaining: 5 },
                year: 2026
            },
            {
                employeeId: '3',
                employeeName: 'Sophie Bernard',
                vacation: { total: 25, used: 8, remaining: 17 },
                sick: { total: 10, used: 1, remaining: 9 },
                personal: { total: 5, used: 2, remaining: 3 },
                year: 2026
            },
            {
                employeeId: '4',
                employeeName: 'Lucas Petit',
                vacation: { total: 15, used: 3, remaining: 12 },
                sick: { total: 5, used: 0, remaining: 5 },
                personal: { total: 3, used: 1, remaining: 2 },
                year: 2026
            }
        ];
    }

    // Get leave counter for specific employee
    async getEmployeeLeaveCounter(employeeId: string): Promise<LeaveCounter | null> {
        const counters = await this.getLeaveCounters();
        return counters.find(c => c.employeeId === employeeId) || null;
    }

    // Get leave calendar data
    async getLeaveCalendar(startDate: string, endDate: string): Promise<LeaveRequest[]> {
        const requests = await this.getLeaveRequests();
        return requests.filter(r =>
            r.status === 'approved' &&
            r.startDate >= startDate &&
            r.endDate <= endDate
        );
    }

    // Get leave alerts
    async getLeaveAlerts(): Promise<LeaveAlert[]> {
        return [
            {
                id: '1',
                type: 'pending_approval',
                employeeId: '2',
                employeeName: 'Thomas Martin',
                message: 'Demande de congé maladie en attente de validation',
                severity: 'warning',
                createdAt: '2026-01-28'
            },
            {
                id: '2',
                type: 'low_balance',
                employeeId: '3',
                employeeName: 'Sophie Bernard',
                message: 'Solde de jours personnels faible (3 jours restants)',
                severity: 'info',
                createdAt: '2026-01-30'
            },
            {
                id: '3',
                type: 'expiring_soon',
                employeeId: '1',
                employeeName: 'Marie Dupont',
                message: '15 jours de congés expirent fin mars',
                severity: 'warning',
                createdAt: '2026-01-29'
            }
        ];
    }

    // Calculate days between dates
    calculateDays(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    }

    // Get leave statistics
    async getLeaveStats() {
        const requests = await this.getLeaveRequests();
        const counters = await this.getLeaveCounters();

        return {
            totalRequests: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            totalDaysUsed: counters.reduce((sum, c) => sum + c.vacation.used + c.sick.used + c.personal.used, 0),
            averageDaysPerEmployee: counters.reduce((sum, c) => sum + c.vacation.used, 0) / counters.length
        };
    }
}

export default new LeaveService();
