
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User, Plan, Goal, GoalCategory, Notification, GoalType } from '../types';
import { INITIAL_DISCIPLINA, DISCIPLINA_PENALTY, CHECKIN_WINDOW_HOURS } from '../constants';

interface RegisterData {
    email: string;
    name: string;
    phone: string;
    password: string;
}

interface UserContextType {
    user: User | null;
    notifications: Notification[];
    isBlocked: boolean;
    login: (email: string) => void;
    register: (data: RegisterData) => void;
    completeTutorial: () => void;
    selectPlan: (plan: Plan) => void;
    logout: () => void;
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'lastCheckIn' | 'streak' | 'penaltyApplied'>) => void;
    checkIn: (goalId: string) => void;
    dailyCheckIn: () => void;
    addContribution: (goalId: string, amount: number) => void;
    buyDisciplina: (amount: number) => void;
    upgradeToPro: () => void;
    checkOverdueGoals: () => void;
    clearNotifications: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const FAKE_USER_KEY = 'foco_absoluto_user';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem(FAKE_USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'warning' | 'error') => {
        setNotifications(prev => [...prev, { id: Date.now().toString(), message, type, timestamp: new Date().toISOString() }]);
        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 5000);
    }, []);

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem(FAKE_USER_KEY, JSON.stringify(updatedUser));
    };

    const login = (email: string) => {
        const saved = localStorage.getItem(FAKE_USER_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.email === email) {
                updateUser(parsed);
                return;
            }
        }
        addNotification('Usuário não encontrado. Crie uma conta.', 'error');
    };

    const register = (data: RegisterData) => {
        const newUser: User = {
            ...data,
            plan: Plan.Gratuito,
            disciplina: INITIAL_DISCIPLINA,
            goals: [],
            hasCompletedTutorial: false,
            hasSelectedPlan: false,
            lastGlobalCheckIn: null,
        };
        updateUser(newUser);
        addNotification('Bem-vindo ao Protocolo de Foco!', 'success');
    };

    const completeTutorial = () => {
        if (!user) return;
        updateUser({ ...user, hasCompletedTutorial: true });
    };

    const selectPlan = (plan: Plan) => {
        if (!user) return;
        updateUser({ ...user, plan, hasSelectedPlan: true });
        addNotification(`Protocolo ${plan} ativado com sucesso!`, 'success');
    };

    const logout = () => {
        localStorage.removeItem(FAKE_USER_KEY);
        setUser(null);
    };

    const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'lastCheckIn' | 'streak' | 'penaltyApplied'>) => {
        if (!user) return;
        const newGoal: Goal = {
            ...goalData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            lastCheckIn: null,
            streak: 0,
            penaltyApplied: false,
        };
        if (newGoal.type === GoalType.Money) {
            newGoal.currentAmount = 0;
        }
        const updatedUser = { ...user, goals: [...user.goals, newGoal] };
        updateUser(updatedUser);
    };

    const checkIn = (goalId: string) => {
        if (!user) return;
        const now = new Date();
        const updatedGoals = user.goals.map(goal => {
            if (goal.id === goalId) {
                const lastValidCheckin = goal.lastCheckIn ? new Date(goal.lastCheckIn) : new Date(goal.createdAt);
                const hoursSinceLast = (now.getTime() - lastValidCheckin.getTime()) / (1000 * 60 * 60);

                let newStreak = goal.streak;
                if (hoursSinceLast <= CHECKIN_WINDOW_HOURS * 2) { 
                    newStreak += 1;
                } else {
                    newStreak = 1; 
                }
                
                return { ...goal, lastCheckIn: now.toISOString(), streak: newStreak, penaltyApplied: false };
            }
            return goal;
        });
        updateUser({ ...user, goals: updatedGoals });
        addNotification('Missão cumprida com sucesso!', 'success');
    };

    const dailyCheckIn = () => {
        if (!user) return;
        const now = new Date();
        updateUser({ 
            ...user, 
            lastGlobalCheckIn: now.toISOString(),
            disciplina: user.disciplina + 2 // Bonus for daily presence
        });
        addNotification('Presença Confirmada! +2 Disciplina', 'success');
    };

    const addContribution = (goalId: string, amount: number) => {
        if (!user || amount <= 0) return;
        const now = new Date();
        const updatedGoals = user.goals.map(goal => {
            if (goal.id === goalId && goal.type === GoalType.Money) {
                const newCurrentAmount = (goal.currentAmount || 0) + amount;
                
                const lastValidCheckin = goal.lastCheckIn ? new Date(goal.lastCheckIn) : new Date(goal.createdAt);
                const hoursSinceLast = (now.getTime() - lastValidCheckin.getTime()) / (1000 * 60 * 60);

                let newStreak = goal.streak;
                if (hoursSinceLast <= CHECKIN_WINDOW_HOURS * 2) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
                
                return { 
                    ...goal, 
                    currentAmount: newCurrentAmount, 
                    lastCheckIn: now.toISOString(),
                    streak: newStreak,
                    penaltyApplied: false 
                };
            }
            return goal;
        });
        updateUser({ ...user, goals: updatedGoals });
        addNotification(`Contribuição de R$${amount.toFixed(2)} confirmada!`, 'success');
    };

    const buyDisciplina = (amount: number) => {
        if (!user) return;
        updateUser({ ...user, disciplina: user.disciplina + amount });
        addNotification(`Créditos operacionais recarregados: +${amount}`, 'success');
    };

    const upgradeToPro = () => {
        if (!user) return;
        updateUser({ ...user, plan: Plan.PRO, hasSelectedPlan: true });
        addNotification('Acesso Elite PRO Liberado!', 'success');
    };

    const checkOverdueGoals = useCallback(() => {
        if (!user || user.disciplina <= 0) return;

        let disciplinaToDeduct = 0;
        const goalsWithPenalties: string[] = [];

        const updatedGoals = user.goals.map(goal => {
            const now = new Date();
            const lastValidDate = goal.lastCheckIn ? new Date(goal.lastCheckIn) : new Date(goal.createdAt);
            const hoursSince = (now.getTime() - lastValidDate.getTime()) / (1000 * 60 * 60);

            if (hoursSince > CHECKIN_WINDOW_HOURS && !goal.penaltyApplied) {
                disciplinaToDeduct += DISCIPLINA_PENALTY;
                goalsWithPenalties.push(goal.name);
                return { ...goal, penaltyApplied: true, streak: 0 };
            }
            return goal;
        });

        if (goalsWithPenalties.length > 0) {
            const newDisciplina = Math.max(0, user.disciplina - disciplinaToDeduct);
            updateUser({ ...user, disciplina: newDisciplina, goals: updatedGoals });
            addNotification(`Penalidade Operacional: -${disciplinaToDeduct} em: ${goalsWithPenalties.join(', ')}`, 'error');
        }
    }, [user, addNotification]);
    
    const clearNotifications = () => {
        setNotifications([]);
    }

    const isBlocked = useMemo(() => (user ? user.disciplina <= 0 : false), [user]);

    const value = {
        user,
        notifications,
        isBlocked,
        login,
        register,
        completeTutorial,
        selectPlan,
        logout,
        addGoal,
        checkIn,
        dailyCheckIn,
        addContribution,
        buyDisciplina,
        upgradeToPro,
        checkOverdueGoals,
        clearNotifications,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
