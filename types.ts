
export enum Plan {
    Gratuito = 'Gratuito',
    PRO = 'PRO',
}

export enum GoalCategory {
    Saude = 'Saúde',
    Estudos = 'Estudos',
    Produtividade = 'Produtividade',
    Dinheiro = 'Dinheiro',
    Pessoal = 'Pessoal'
}

export enum GoalType {
    Daily = 'Hábito Diário',
    Money = 'Meta Financeira',
}

export interface Goal {
    id: string;
    name: string;
    description: string;
    category: GoalCategory;
    type: GoalType;
    deadline: string; // ISO date string
    createdAt: string; // ISO date string
    lastCheckIn: string | null; // ISO date string
    streak: number;
    penaltyApplied: boolean;
    
    // Money goal specific
    targetAmount?: number;
    currentAmount?: number;
    contributionType?: 'weekly' | 'monthly';
    amountPerPeriod?: number;
}

export interface User {
    email: string;
    name?: string;
    phone?: string;
    password?: string;
    plan: Plan;
    disciplina: number;
    goals: Goal[];
    hasCompletedTutorial: boolean;
    hasSelectedPlan: boolean;
    lastGlobalCheckIn: string | null; // ISO date string
}

export interface Notification {
    id:string;
    message: string;
    type: 'success' | 'warning' | 'error';
    timestamp: string;
}
