
import React, { useState } from 'react';
import { Goal, GoalType } from '../types';
import { useUser } from '../hooks/useUser';
import { FireIcon, CheckIcon, CashIcon, PlusIcon, BoltIcon } from './icons';
import { CHECKIN_WINDOW_HOURS, DISCIPLINA_PENALTY } from '../constants';

interface GoalCardProps {
    goal: Goal;
}

const formatCurrency = (value?: number) => {
    if (value === undefined) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const { checkIn, addContribution, isBlocked } = useUser();
    const [contributionAmount, setContributionAmount] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCheckInDate = goal.lastCheckIn ? new Date(goal.lastCheckIn) : null;
    if(lastCheckInDate) lastCheckInDate.setHours(0, 0, 0, 0);
    const hasCheckedInToday = lastCheckInDate?.getTime() === today.getTime();
    
    const lastValidDate = goal.lastCheckIn ? new Date(goal.lastCheckIn) : new Date(goal.createdAt);
    const hoursSinceCheckIn = (new Date().getTime() - lastValidDate.getTime()) / (1000 * 60 * 60);

    let status = { text: 'ATIVO', color: 'text-emerald-500', glow: 'shadow-emerald-500/20' };
    if (hoursSinceCheckIn > CHECKIN_WINDOW_HOURS) {
        status = { text: 'ATRASADO', color: 'text-red-500', glow: 'shadow-red-500/20' };
    } else if (hoursSinceCheckIn > (CHECKIN_WINDOW_HOURS - 6)) {
        status = { text: 'ALERTA', color: 'text-yellow-500', glow: 'shadow-yellow-500/20' };
    }

    const handleAddContribution = () => {
        const amount = parseFloat(contributionAmount);
        if (!isNaN(amount) && amount > 0) {
            addContribution(goal.id, amount);
            setContributionAmount('');
        }
    };

    const renderProgressBar = () => {
        let progress = 0;
        if (goal.type === GoalType.Money && goal.targetAmount) {
            progress = Math.min(100, Math.floor(((goal.currentAmount || 0) / goal.targetAmount) * 100));
        } else {
            const deadline = new Date(goal.deadline);
            const createdAt = new Date(goal.createdAt);
            const totalDuration = Math.max(1, (deadline.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
            const elapsedDuration = Math.max(0, (new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
            progress = Math.min(100, Math.floor((elapsedDuration / totalDuration) * 100));
        }

        return (
            <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div 
                    className={`h-full rounded-full transition-all duration-700 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        );
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5 group relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 {goal.type === GoalType.Money ? <CashIcon className="w-24 h-24" /> : <BoltIcon className="w-24 h-24" />}
            </div>

            <div className="mb-10 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">{goal.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${status.color}`}>{status.text}</span>
                        <div className="flex items-center text-zinc-100 font-black bg-black px-2 py-0.5 rounded border border-zinc-800">
                            <FireIcon className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                            <span className="text-xs">{goal.streak}d</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter mb-3 group-hover:text-emerald-400 transition-colors">{goal.name}</h3>
                <p className="text-zinc-500 text-[11px] font-medium line-clamp-2 min-h-[2rem] leading-relaxed">{goal.description}</p>
                
                {goal.type === GoalType.Money && goal.amountPerPeriod && (
                    <div className="mt-4 flex items-center space-x-2">
                        <div className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border border-emerald-500/20">
                            ALVO: {formatCurrency(goal.amountPerPeriod)} / {goal.contributionType === 'weekly' ? 'SEMANA' : 'MÊS'}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                            Evolução Operacional
                        </span>
                        {goal.type === GoalType.Money ? (
                            <span className="text-base font-black text-white tracking-tighter">
                                {formatCurrency(goal.currentAmount)} <span className="text-[9px] text-zinc-600 uppercase">/ {formatCurrency(goal.targetAmount)}</span>
                            </span>
                        ) : (
                            <span className="text-sm font-black text-emerald-500 tracking-tighter uppercase">Progresso Ativo</span>
                        )}
                    </div>
                    {renderProgressBar()}
                </div>

                {hasCheckedInToday ? (
                    <div className="w-full py-4 rounded-xl font-black text-emerald-500 text-[10px] uppercase tracking-[0.3em] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 mr-2"/> Missão Concluída
                    </div>
                ) : goal.type === GoalType.Money ? (
                    <div className="space-y-3">
                        <div className="flex space-x-2">
                            <div className="relative flex-grow">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600">R$</span>
                                <input
                                    type="number"
                                    value={contributionAmount}
                                    onChange={(e) => setContributionAmount(e.target.value)}
                                    placeholder="0,00"
                                    disabled={isBlocked}
                                    className="w-full bg-black text-white pl-10 pr-4 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 text-xs font-bold outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleAddContribution}
                                disabled={isBlocked || !contributionAmount}
                                className="bg-white hover:bg-emerald-500 text-black font-black px-4 rounded-xl transition-all active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 shadow-lg"
                                title="Confirmar contribuição e check-in"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[8px] text-zinc-600 font-black uppercase text-center tracking-widest">Aporte garante proteção contra -{DISCIPLINA_PENALTY} pts</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={() => checkIn(goal.id)}
                            disabled={isBlocked}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all transform active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 shadow-xl border border-emerald-400/20"
                        >
                            REALIZAR CHECK-IN (PROTEÇÃO)
                        </button>
                        <p className="text-[8px] text-zinc-600 font-black uppercase text-center tracking-widest italic animate-pulse">Evita perda de {DISCIPLINA_PENALTY} pts de disciplina</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
