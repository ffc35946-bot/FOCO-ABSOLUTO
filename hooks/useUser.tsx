
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { User, Plan, Goal, GoalCategory, Notification, GoalType } from '../types';
import { INITIAL_DISCIPLINA, DISCIPLINA_PENALTY, CHECKIN_WINDOW_HOURS } from '../constants';
import { supabase } from '../lib/supabase';

interface RegisterData {
    email: string;
    name: string;
    phone: string;
    password?: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    notifications: Notification[];
    isBlocked: boolean;
    login: (email: string, password?: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
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

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'warning' | 'error') => {
        setNotifications(prev => [...prev, { id: Date.now().toString(), message, type, timestamp: new Date().toISOString() }]);
        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 5000);
    }, []);

    // Fetch user profile from Supabase
    const fetchProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setUser({
                    email: email,
                    name: data.name,
                    phone: data.phone,
                    plan: data.plan as Plan,
                    disciplina: data.disciplina,
                    goals: data.goals || [],
                    hasCompletedTutorial: data.has_completed_tutorial,
                    hasSelectedPlan: data.has_selected_plan,
                    lastGlobalCheckIn: data.last_global_check_in,
                });
            } else {
                // Profile doesn't exist yet (first time login/register)
                return null;
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            addNotification('Erro ao carregar perfil.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Handle auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const saveProfile = async (updatedUser: User) => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const profileData = {
            id: authUser.id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            plan: updatedUser.plan,
            disciplina: updatedUser.disciplina,
            goals: updatedUser.goals,
            has_completed_tutorial: updatedUser.hasCompletedTutorial,
            has_selected_plan: updatedUser.hasSelectedPlan,
            last_global_check_in: updatedUser.lastGlobalCheckIn,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(profileData);
        if (error) {
            console.error("Error saving profile:", error);
            addNotification('Erro ao sincronizar dados.', 'error');
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        saveProfile(updatedUser);
    };

    const login = async (email: string, password?: string) => {
        if (!password) {
             addNotification('Senha é obrigatória para este protocolo.', 'error');
             return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            addNotification('Falha na autenticação: ' + error.message, 'error');
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password!,
        });

        if (error) {
            addNotification('Erro no cadastro: ' + error.message, 'error');
            setLoading(false);
            return;
        }

        if (authData.user) {
            const newUser: User = {
                email: data.email,
                name: data.name,
                phone: data.phone,
                plan: Plan.Gratuito,
                disciplina: INITIAL_DISCIPLINA,
                goals: [],
                hasCompletedTutorial: false,
                hasSelectedPlan: false,
                lastGlobalCheckIn: null,
            };
            setUser(newUser);
            await saveProfile(newUser);
            addNotification('Bem-vindo ao Protocolo de Foco!', 'success');
        }
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

    const logout = async () => {
        await supabase.auth.signOut();
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
            disciplina: user.disciplina + 2
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
        loading,
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
