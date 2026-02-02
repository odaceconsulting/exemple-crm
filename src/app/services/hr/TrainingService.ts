import { Training, TrainingEnrollment } from '../../types/hr/HRTypes';

class TrainingService {
    // Mock Data
    private trainings: Training[] = [
        {
            id: '1',
            title: 'React Advanced Patterns',
            provider: 'Frontend Masters',
            duration: '12h',
            format: 'online',
            cost: 450,
            category: 'Technical',
            description: 'Maîtrisez les patterns avancés React (HOC, Render Props, Hooks)',
            skills: ['React', 'TypeScript', 'Architecture'],
            nextSession: '2026-02-15'
        },
        {
            id: '2',
            title: 'Management Bienveillant',
            provider: 'Cegos',
            duration: '2 jours',
            format: 'onsite',
            cost: 1200,
            category: 'Soft Skills',
            description: 'Développer son leadership et gérer ses équipes avec bienveillance',
            skills: ['Management', 'Communication', 'Leadership'],
            nextSession: '2026-03-10'
        },
        {
            id: '3',
            title: 'Sécurité Informatique - Sensibilisation',
            provider: 'Internal',
            duration: '2h',
            format: 'online',
            cost: 0,
            category: 'Compliance',
            description: 'Les bonnes pratiques pour sécuriser son poste de travail',
            skills: ['Security', 'GDPR'],
            nextSession: 'En continu'
        }
    ];

    private enrollments: TrainingEnrollment[] = [
        {
            id: '1',
            trainingId: '1',
            employeeId: '1',
            status: 'in-progress',
            progress: 45,
            startDate: '2026-01-10',
            endDate: '2026-02-10'
        },
        {
            id: '2',
            trainingId: '2',
            employeeId: '2',
            status: 'approved',
            startDate: '2026-03-10',
            endDate: '2026-03-12'
        }
    ];

    async getCatalog(): Promise<Training[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.trainings]), 500));
    }

    async getMyTrainings(employeeId: string): Promise<{ enrollment: TrainingEnrollment, training: Training }[]> {
        const userEnrollments = this.enrollments.filter(e => e.employeeId === employeeId);
        const result = userEnrollments.map(e => ({
            enrollment: e,
            training: this.trainings.find(t => t.id === e.trainingId)!
        }));
        return new Promise(resolve => setTimeout(() => resolve(result), 500));
    }
}

export default new TrainingService();
