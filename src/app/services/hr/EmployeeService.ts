import { Employee, Contract, OrgNode } from '../types/hr/HRTypes';

class EmployeeService {
    // Get all employees
    async getEmployees(): Promise<Employee[]> {
        // Simulate API call
        return [
            {
                id: '1',
                firstName: 'Marie',
                lastName: 'Dupont',
                email: 'marie.dupont@company.com',
                phone: '+33 6 12 34 56 78',
                position: 'Directrice Marketing',
                department: 'Marketing',
                hireDate: '2020-03-15',
                contractType: 'CDI',
                status: 'active',
                salary: 65000,
                address: '123 Rue de Paris, 75001 Paris',
                birthDate: '1985-06-20',
                emergencyContact: {
                    name: 'Jean Dupont',
                    phone: '+33 6 98 76 54 32',
                    relationship: 'Conjoint'
                }
            },
            {
                id: '2',
                firstName: 'Thomas',
                lastName: 'Martin',
                email: 'thomas.martin@company.com',
                phone: '+33 6 23 45 67 89',
                position: 'Développeur Senior',
                department: 'IT',
                managerId: '1',
                hireDate: '2019-09-01',
                contractType: 'CDI',
                status: 'active',
                salary: 55000,
                address: '45 Avenue des Champs, 75008 Paris',
                birthDate: '1990-11-15',
                emergencyContact: {
                    name: 'Sophie Martin',
                    phone: '+33 6 11 22 33 44',
                    relationship: 'Sœur'
                }
            },
            {
                id: '3',
                firstName: 'Sophie',
                lastName: 'Bernard',
                email: 'sophie.bernard@company.com',
                phone: '+33 6 34 56 78 90',
                position: 'Responsable RH',
                department: 'RH',
                hireDate: '2021-01-10',
                contractType: 'CDI',
                status: 'active',
                salary: 50000,
                address: '78 Boulevard Saint-Germain, 75005 Paris',
                birthDate: '1988-03-25',
                emergencyContact: {
                    name: 'Pierre Bernard',
                    phone: '+33 6 55 66 77 88',
                    relationship: 'Père'
                }
            },
            {
                id: '4',
                firstName: 'Lucas',
                lastName: 'Petit',
                email: 'lucas.petit@company.com',
                phone: '+33 6 45 67 89 01',
                position: 'Stagiaire Marketing',
                department: 'Marketing',
                managerId: '1',
                hireDate: '2025-09-01',
                contractType: 'Stage',
                status: 'active',
                salary: 1200,
                address: '12 Rue du Commerce, 75015 Paris',
                birthDate: '2002-07-10',
                emergencyContact: {
                    name: 'Marie Petit',
                    phone: '+33 6 99 88 77 66',
                    relationship: 'Mère'
                }
            }
        ];
    }

    // Get employee by ID
    async getEmployeeById(id: string): Promise<Employee | null> {
        const employees = await this.getEmployees();
        return employees.find(emp => emp.id === id) || null;
    }

    // Create new employee
    async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
        const newEmployee = {
            ...employee,
            id: Date.now().toString()
        };
        return newEmployee;
    }

    // Update employee
    async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
        const employee = await this.getEmployeeById(id);
        if (!employee) throw new Error('Employee not found');
        return { ...employee, ...updates };
    }

    // Get employee contracts
    async getEmployeeContracts(employeeId: string): Promise<Contract[]> {
        return [
            {
                id: '1',
                employeeId,
                type: 'CDI',
                startDate: '2020-03-15',
                salary: 65000,
                position: 'Directrice Marketing',
                department: 'Marketing',
                workingHours: 35,
                status: 'active'
            }
        ];
    }

    // Get organization chart data
    async getOrganigramData(): Promise<OrgNode[]> {
        return [
            {
                id: '1',
                employeeId: '1',
                name: 'Marie Dupont',
                position: 'Directrice Marketing',
                department: 'Marketing',
                children: [
                    {
                        id: '4',
                        employeeId: '4',
                        name: 'Lucas Petit',
                        position: 'Stagiaire Marketing',
                        department: 'Marketing',
                        children: []
                    }
                ]
            },
            {
                id: '2',
                employeeId: '2',
                name: 'Thomas Martin',
                position: 'Développeur Senior',
                department: 'IT',
                children: []
            },
            {
                id: '3',
                employeeId: '3',
                name: 'Sophie Bernard',
                position: 'Responsable RH',
                department: 'RH',
                children: []
            }
        ];
    }

    // Get employee statistics
    async getEmployeeStats() {
        const employees = await this.getEmployees();
        return {
            total: employees.length,
            active: employees.filter(e => e.status === 'active').length,
            onLeave: employees.filter(e => e.status === 'on_leave').length,
            byDepartment: this.groupByDepartment(employees),
            byContractType: this.groupByContractType(employees)
        };
    }

    private groupByDepartment(employees: Employee[]) {
        const grouped: { [key: string]: number } = {};
        employees.forEach(emp => {
            grouped[emp.department] = (grouped[emp.department] || 0) + 1;
        });
        return Object.entries(grouped).map(([department, count]) => ({ department, count }));
    }

    private groupByContractType(employees: Employee[]) {
        const grouped: { [key: string]: number } = {};
        employees.forEach(emp => {
            grouped[emp.contractType] = (grouped[emp.contractType] || 0) + 1;
        });
        return Object.entries(grouped).map(([type, count]) => ({ type, count }));
    }
}

export default new EmployeeService();
