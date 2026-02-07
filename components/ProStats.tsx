
import React from 'react';
import { useUser } from '../hooks/useUser';

const ProStats: React.FC = () => {
    const { user } = useUser();
    if (!user) return null;

    const totalInvested = user.goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
    const averageStreak = user.goals.length > 0 
        ? Math.round(user.goals.reduce((acc, g) => acc + g.streak, 0) / user.goals.length) 
        : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
                { label: 'Total Acumulado', value: `R$ ${totalInvested.toLocaleString('pt-BR')}`, color: 'text-emerald-500' },
                { label: 'Média de Streak', value: `${averageStreak} Dias`, color: 'text-white' },
                { label: 'Status Vital', value: `${user.disciplina}%`, color: 'text-emerald-400' },
                { label: 'Protocolo', value: 'ATIVO', color: 'text-emerald-600' }
            ].map((stat, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-center shadow-lg hover:border-emerald-500/20 transition-all group">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1 group-hover:text-emerald-500/60">{stat.label}</span>
                    <span className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                </div>
            ))}
        </div>
    );
};

export default ProStats;
