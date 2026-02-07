
import React from 'react';
import { useUser } from '../hooks/useUser';
import { Plan } from '../types';
import { BoltIcon, CheckIcon } from './icons';

const PlanSelectionModal: React.FC = () => {
    const { user, selectPlan } = useUser();

    if (!user || !user.hasCompletedTutorial || user.hasSelectedPlan) return null;

    const plans = [
        {
            id: Plan.Gratuito,
            name: "Operacional Básico",
            price: "R$ 0,00",
            features: ["1 Meta Ativa", "Check-in Diário", "Sistema de Disciplina"],
            cta: "Manter Básico",
            style: "border-zinc-800 bg-zinc-900/50"
        },
        {
            id: Plan.PRO,
            name: "Protocolo de Elite",
            price: "R$ 27,90",
            period: "/mês",
            features: [
                "Até 5 Metas Ativas", 
                "Dashboard Detalhado", 
                "Histórico de Evolução", 
                "Bônus de Streak PRO",
                "Temas Exclusivos"
            ],
            cta: "Upgrade para Elite",
            style: "border-emerald-500 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
            premium: true
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[80] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Fase Final de Configuração</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter italic">Escolha seu <span className="text-emerald-500">Nível</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plans.map((p) => (
                        <div key={p.id} className={`p-8 sm:p-12 rounded-[3rem] border-2 flex flex-col transition-all hover:scale-[1.02] duration-500 ${p.style}`}>
                            {p.premium && (
                                <div className="flex justify-start mb-6">
                                    <span className="bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Recomendado</span>
                                </div>
                            )}
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{p.name}</h3>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-white">{p.price}</span>
                                {p.period && <span className="text-zinc-600 text-sm font-bold ml-1">{p.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-12 flex-grow">
                                {p.features.map(f => (
                                    <li key={f} className="flex items-center text-sm font-bold text-zinc-400">
                                        <CheckIcon className="w-5 h-5 text-emerald-500 mr-3" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => selectPlan(p.id)}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all transform active:scale-95 ${
                                    p.premium 
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-500' 
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                            >
                                {p.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanSelectionModal;
