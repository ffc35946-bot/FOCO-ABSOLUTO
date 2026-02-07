
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
            status: "ATIVO",
            features: ["1 Meta Ativa", "Check-in Diário", "Sistema de Disciplina"],
            cta: "Iniciar Protocolo",
            style: "border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30",
            disabled: false
        },
        {
            id: Plan.PRO,
            name: "Protocolo de Elite",
            price: "R$ 27,90",
            period: "/mês",
            status: "EM REVISÃO",
            features: [
                "Até 5 Metas Ativas", 
                "Dashboard Detalhado", 
                "Histórico de Evolução", 
                "Módulo Multi-Alvo"
            ],
            cta: "Inativo Temporariamente",
            style: "border-zinc-800 bg-zinc-900/20 opacity-50 grayscale",
            disabled: true
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[80] flex items-center justify-center p-4">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-10">
                    <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.5em] mb-4 block animate-pulse">Configuração de Protocolo Final</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Selecione seu <span className="text-emerald-500">Nível</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {plans.map((p) => (
                        <div key={p.id} className={`p-8 rounded-[2.5rem] border-2 flex flex-col transition-all duration-500 relative overflow-hidden ${p.style}`}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{p.name}</h3>
                                <span className={`text-[7px] font-black px-2 py-0.5 rounded border ${p.disabled ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                                    {p.status}
                                </span>
                            </div>

                            <div className="mb-8">
                                <span className="text-3xl font-black text-white tracking-tighter">{p.price}</span>
                                {p.period && <span className="text-zinc-600 text-[10px] font-bold ml-1 uppercase">{p.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {p.features.map(f => (
                                    <li key={f} className={`flex items-center text-[11px] font-bold ${p.disabled ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                        <CheckIcon className={`w-4 h-4 mr-3 ${p.disabled ? 'text-zinc-700' : 'text-emerald-500'}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !p.disabled && selectPlan(p.id)}
                                disabled={p.disabled}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform active:scale-95 ${
                                    p.disabled 
                                    ? 'bg-zinc-950 text-zinc-700 border border-zinc-800 cursor-not-allowed italic' 
                                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-500'
                                }`}
                            >
                                {p.cta}
                            </button>
                        </div>
                    ))}
                </div>
                
                <p className="text-center mt-10 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                    Segurança de Dados • Protocolo AES-256
                </p>
            </div>
        </div>
    );
};

export default PlanSelectionModal;
