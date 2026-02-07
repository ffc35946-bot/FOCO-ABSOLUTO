
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
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type, timestamp: new Date().toISOString() }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const fetchProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Profile não existe, mas o user está logado (pode acontecer logo após o signup)
                    console.log("Perfil não encontrado, aguardando criação...");
                    return;
                }
                throw error;
            }

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
            }
        } catch (err: any) {
            console.error("Erro ao carregar perfil:", err.message);
            addNotification('Falha ao sincronizar dados do perfil.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Checar sessão inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setLoading(false);
            }
        });

        // Ouvir mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const saveProfile = async (updatedUser: User) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const profileData = {
            id: session.user.id,
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
            console.error("Erro ao salvar perfil:", error.message);
            addNotification('Erro ao salvar no banco de dados.', 'error');
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        saveProfile(updatedUser);
    };

    const login = async (email: string, password?: string) => {
        if (!password) {
            addNotification('Senha é obrigatória.', 'error');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            addNotification(`Erro: ${error.message}`, 'error');
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password!,
        });

        if (authError) {
            addNotification(`Erro no cadastro: ${authError.message}`, 'error');
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

            // Criar o perfil imediatamente após o signup
            const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                name: data.name,
                phone: data.phone,
                plan: Plan.Gratuito,
                disciplina: INITIAL_DISCIPLINA,
                goals: [],
            });

            if (profileError) {
                console.error("Erro ao criar perfil inicial:", profileError.message);
                addNotification('Conta criada, mas houve erro no perfil. Tente logar.', 'warning');
            } else {
                setUser(newUser);
                addNotification('Cadastro realizado com sucesso!', 'success');
            }
        }
        setLoading(false);
    };

    const completeTutorial = () => {
        if (!user) return;
        updateUser({ ...user, hasCompletedTutorial: true });
    };

    const selectPlan = (plan: Plan) => {
        if (!user) return;
        updateUser({ ...user, plan, hasSelectedPlan: true });
        addNotification(`Plano ${plan} ativado!`, 'success');
    };

    const logout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
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
        const updatedUser = { ...user, goals: [...user.goals, newGoal] };
        updateUser(updatedUser);
    };

    const checkIn = (goalId: string) => {
        if (!user) return;
        const now = new Date();
        const updatedGoals = user.goals.map(goal => {
            if (goal.id === goalId) {
                return { ...goal, lastCheckIn: now.toISOString(), streak: goal.streak + 1, penaltyApplied: false };
            }
            return goal;
        });
        updateUser({ ...user, goals: updatedGoals });
        addNotification('Check-in realizado!', 'success');
    };

    const dailyCheckIn = () => {
        if (!user) return;
        updateUser({ 
            ...user, 
            lastGlobalCheckIn: new Date().toISOString(),
            disciplina: user.disciplina + 2
        });
        addNotification('+2 de Disciplina!', 'success');
    };

    const addContribution = (goalId: string, amount: number) => {
        if (!user) return;
        const updatedGoals = user.goals.map(goal => {
            if (goal.id === goalId && goal.type === GoalType.Money) {
                return { 
                    ...goal, 
                    currentAmount: (goal.currentAmount || 0) + amount, 
                    lastCheckIn: new Date().toISOString(),
                    penaltyApplied: false 
                };
            }
            return goal;
        });
        updateUser({ ...user, goals: updatedGoals });
        addNotification(`Aporte de R$${amount} realizado!`, 'success');
    };

    const buyDisciplina = (amount: number) => {
        if (!user) return;
        updateUser({ ...user, disciplina: user.disciplina + amount });
        addNotification(`Recarga de +${amount} concluída!`, 'success');
    };

    const upgradeToPro = () => {
        if (!user) return;
        updateUser({ ...user, plan: Plan.PRO, hasSelectedPlan: true });
    };

    const checkOverdueGoals = useCallback(() => {
        if (!user || user.disciplina <= 0) return;
        // Lógica simplificada para evitar loops de salvamento
    }, [user]);
    
    const clearNotifications = () => setNotifications([]);

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
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
};
