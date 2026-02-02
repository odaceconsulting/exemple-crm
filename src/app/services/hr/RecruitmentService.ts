import { JobOffer, Candidate, Interview } from '../../types/hr/HRTypes';

class RecruitmentService {
    // Mock Data
    private jobOffers: JobOffer[] = [
        {
            id: '1',
            title: 'Senior Frontend Developer',
            department: 'IT',
            location: 'Paris',
            type: 'CDI',
            status: 'published',
            postedDate: '2026-01-15',
            candidatesCount: 12,
            description: 'Nous recherchons un développeur React expérimenté...',
            requirements: ['React', 'TypeScript', 'Tailwind CSS', '5 ans exp']
        },
        {
            id: '2',
            title: 'Product Manager',
            department: 'Product',
            location: 'Lyon',
            type: 'CDI',
            status: 'published',
            postedDate: '2026-01-20',
            candidatesCount: 8,
            description: 'Responsable de la roadmap produit...',
            requirements: ['Agile', 'Jira', 'Product Strategy']
        },
        {
            id: '3',
            title: 'UX Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Freelance',
            status: 'draft',
            postedDate: '2026-01-28',
            candidatesCount: 0,
            description: 'Design d\'interfaces utilisateurs intuitives...',
            requirements: ['Figma', 'Prototyping', 'User Research']
        }
    ];

    private candidates: Candidate[] = [
        {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@email.com',
            phone: '06 12 34 56 78',
            position: 'Senior Frontend Developer',
            status: 'interview',
            appliedDate: '2026-01-18',
            score: 85,
            tags: ['React', 'Top Profile'],
            jobId: '1'
        },
        {
            id: '2',
            firstName: 'Sophie',
            lastName: 'Martin',
            email: 'sophie.martin@email.com',
            phone: '06 98 76 54 32',
            position: 'Product Manager',
            status: 'new',
            appliedDate: '2026-01-25',
            score: 70,
            tags: ['Junior'],
            jobId: '2'
        }
    ];

    private interviews: Interview[] = [
        {
            id: '1',
            candidateId: '1',
            candidateName: 'Jean Dupont',
            date: '2026-02-05T10:00:00',
            interviewer: 'Marc Directeur',
            type: 'video',
            status: 'scheduled'
        }
    ];

    async getJobOffers(): Promise<JobOffer[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.jobOffers]), 500));
    }

    async getCandidates(): Promise<Candidate[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.candidates]), 500));
    }

    async getInterviews(): Promise<Interview[]> {
        return new Promise(resolve => setTimeout(() => resolve([...this.interviews]), 500));
    }

    async createJobOffer(offer: Omit<JobOffer, 'id' | 'postedDate' | 'candidatesCount'>): Promise<JobOffer> {
        const newOffer: JobOffer = {
            ...offer,
            id: Math.random().toString(36).substr(2, 9),
            postedDate: new Date().toISOString().split('T')[0],
            candidatesCount: 0
        };
        this.jobOffers.push(newOffer);
        return new Promise(resolve => setTimeout(() => resolve(newOffer), 500));
    }

    async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Candidate | null> {
        const candidate = this.candidates.find(c => c.id === id);
        if (candidate) {
            candidate.status = status;
            return new Promise(resolve => setTimeout(() => resolve({ ...candidate }), 300));
        }
        return null;
    }
}

export default new RecruitmentService();
