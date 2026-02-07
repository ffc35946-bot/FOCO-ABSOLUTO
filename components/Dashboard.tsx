
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import GoalCard from './GoalCard';
import CreateGoalModal from './CreateGoalModal';
import TutorialModal from './TutorialModal';
import PlanSelectionModal from './PlanSelectionModal';
import ProStats from './ProStats';
import { PlusIcon, BoltIcon, CheckIcon } from './icons';
import { PLAN_LIMITS } from '../constants';
import { Notification as NotificationType, Plan } from '../types';

const Notification: React.FC<{ notification: NotificationType }> = ({ notification }) => {
    const baseClasses = "rounded-xl p-4 mb-3 text-[10px] font-black uppercase tracking-widest flex items-center border animate-in slide-in-from-right duration-500";
    const typeClasses = {
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
        error: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
            <span className="mr-3 block w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            {notification.message}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { user, isBlocked, notifications, dailyCheckIn } = useUser();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    if (!user) return null;

    const isPro = user.plan === Plan.PRO;
    const canCreateGoal = user.goals.length < PLAN_LIMITS[user.plan];
    
    // Check if user has already checked in today
    const todayStr = new Date().toDateString();
    const lastCheckInStr = user.lastGlobalCheckIn ? new Date(user.lastGlobalCheckIn).toDateString() : '';
    const hasCheckedInToday = todayStr === lastCheckInStr;

    return (
        <div className="py-4 sm:py-6">
            <TutorialModal />
            <PlanSelectionModal />
            
            <div className="fixed top-24 right-4 sm:right-6 z-50 w-[calc(100%-2rem)] sm:max-w-xs pointer-events-none">
                {notifications.map(n => <Notification key={n.id} notification={n} />)}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 border-b border-zinc-800 pb-8 sm:pb-10 gap-6">
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                            Monitoramento Ativo {isPro ? 'ELITE' : 'BÁSICO'}
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Painel<span className="text-emerald-500/20">.cmd</span>
                    </h1>
                </div>
                
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    {!canCreateGoal && (
                        <div className="hidden lg:flex bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 items-center">
                            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Upgrade necessário</span>
                        </div>
                    )}
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        disabled={!canCreateGoal || isBlocked}
                        className="flex-1 sm:flex-none flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 disabled:bg-zinc-800 disabled:text-zinc-600 uppercase tracking-widest text-[11px] transform active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nova Missão
                    </button>
                </div>
            </div>

            {/* Dashboad Detalhado para PRO */}
            {isPro && <ProStats />}

            {/* Seção de Check-in Diário */}
            <div className={`mb-10 ${isPro ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-zinc-900/50 border-zinc-800'} border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group`}>
                <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center space-x-6 relative z-10">
                    <div className={`p-4 rounded-2xl ${hasCheckedInToday ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'} transition-all`}>
                        <CheckIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Status de Prontidão</h4>
                        <p className="text-xs text-zinc-500 font-medium">{hasCheckedInToday ? 'Protocolo diário confirmado. Foco mantido.' : 'Aguardando confirmação de presença operacional para bônus de disciplina.'}</p>
                    </div>
                </div>
                <button
                    onClick={dailyCheckIn}
                    disabled={hasCheckedInToday || isBlocked}
                    className={`relative z-10 w-full md:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all transform active:scale-95 ${
                        hasCheckedInToday 
                        ? 'bg-zinc-800 text-zinc-500 cursor-default border border-zinc-700' 
                        : 'bg-white text-black hover:bg-emerald-500 hover:text-white shadow-xl shadow-emerald-500/10'
                    }`}
                >
                    {hasCheckedInToday ? 'Protocolo Confirmado' : 'Confirmar Presença Diária'}
                </button>
            </div>

            {user.goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {user.goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 sm:py-40 border-2 border-dashed border-zinc-800 rounded-[2rem] sm:rounded-[3rem] bg-zinc-900/10 px-6">
                    <h2 className="text-2xl sm:text-4xl font-black text-zinc-100 uppercase tracking-tighter mb-4 opacity-30">Sem Dados Operacionais</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto font-medium text-xs sm:text-sm">Aguardando definição de alvos estratégicos para iniciar rastreamento de disciplina.</p>
                </div>
            )}

            <CreateGoalModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
