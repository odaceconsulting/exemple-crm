import { Evaluation, Objective } from '../../types/hr/HRTypes';

class EvaluationService {
    // Mock Data
    private evaluations: Evaluation[] = [
        {
            id: '1',
            employeeId: '1',
            employeeName: 'Thomas Dubos',
            type: 'annual',
            status: 'completed',
            date: '2025-12-15',
            reviewer: 'Julie Martin',
            score: 88,
            strengths: ['Leadership', 'Technical skills'],
            improvements: ['Communication with stakeholders'],
            goalsMet: true
        },
        {
            id: '2',
            employeeId: '2',
            employeeName: 'Sophie Morel',
            type: 'annual',
            status: 'scheduled',
            date: '2026-02-10',
            reviewer: 'Thomas Dubos'
        },
        {
            id: '3',
            employeeId: '3',
            employeeName: 'Lucas Petit',
            type: 'probation',
            status: 'in-progress',
            date: '2026-01-30',
            reviewer: 'Thomas Dubos'
        }
    ];

    private objectives: Objective[] = [
        {
            id: '1',
            employeeId: '1',
            title: 'Lancer la v2 de l\'application',
            description: 'Déployer la nouvelle architecture frontend',
            type: 'individual',
            status: 'in-progress',
            progress: 65,
            dueDate: '2026-03-31',
            weight: 40
        },
        {
            id: '2',
            employeeId: '1',
            title: 'Réduire la dette technique',
            description: 'Refactoriser le module legacy',
            type: 'team',
            status: 'not-started',
            progress: 0,
            dueDate: '2026-06-30',
            weight: 30
        },
        {
            id: '3',
            employeeId: '2',
            title: 'Augmenter le CSAT',
            description: 'Améliorer le score de satisfaction client de 10%',
            type: 'company',
            status: 'at-risk',
            progress: 20,
            dueDate: '2026-12-31',
            weight: 50
        }
    ];

    // Methods
    async getEvaluations(): Promise<Evaluation[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.evaluations]), 500));
    }

    async getObjectives(): Promise<Objective[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.objectives]), 500));
    }

    async createEvaluation(evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation> {
        const newEval = { ...evaluation, id: Math.random().toString(36).substr(2, 9) };
        this.evaluations.push(newEval);
        return new Promise(resolve => setTimeout(() => resolve(newEval), 500));
    }

    async updateObjectiveProgress(id: string, progress: number): Promise<Objective | null> {
        const obj = this.objectives.find(o => o.id === id);
        if (obj) {
            obj.progress = progress;
            if (progress === 100) obj.status = 'completed';
            else if (progress > 0) obj.status = 'in-progress';
            return new Promise(resolve => setTimeout(() => resolve({ ...obj }), 300));
        }
        return null;
    }
}

export default new EvaluationService();
