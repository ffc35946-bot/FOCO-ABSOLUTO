
import React from 'react';
import { useUser } from '../hooks/useUser';
import { Plan } from '../types';

const Settings: React.FC = () => {
    const { user, upgradeToPro } = useUser();

    if (!user) return null;

    return (
        <div className="py-10 max-w-4xl mx-auto">
             <div className="flex items-center space-x-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Gerenciamento Operacional</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-12">Configurações</h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Credenciais de Acesso</h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-zinc-800">
                        <span className="text-sm font-bold text-zinc-400">Identificador:</span>
                        <span className="text-sm font-black text-white">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-zinc-800">
                        <span className="text-sm font-bold text-zinc-400">Nível de Acesso:</span>
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{user.plan}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gratuito */}
                <div className={`p-10 rounded-[2.5rem] border ${user.plan === Plan.Gratuito ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900'} flex flex-col`}>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Básico</h3>
                    <p className="text-zinc-500 text-xs font-medium mb-8">Fundamentos da disciplina pessoal.</p>
                    <ul className="space-y-4 mb-10 flex-grow">
                        {['1 Meta Ativa', 'Check-in Operacional', 'Penalidade de Disciplina'].map(feature => (
                            <li key={feature} className="flex items-center text-xs font-bold text-zinc-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                        {user.plan === Plan.Gratuito ? 'Nível Atual' : '-'}
                    </button>
                </div>

                {/* PRO */}
                <div className={`p-10 rounded-[2.5rem] border ${user.plan === Plan.PRO ? 'border-emerald-500 bg-emerald-500/5 shadow-2xl' : 'border-zinc-800 bg-zinc-900 shadow-xl'} flex flex-col relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 bg-emerald-500 text-black font-black text-[8px] uppercase px-4 py-1 tracking-widest transform rotate-45 translate-x-4 translate-y-2">Elite</div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">PRO</h3>
                    <p className="text-emerald-500/60 text-xs font-medium mb-8">Máxima performance estratégica.</p>
                    <ul className="space-y-4 mb-10 flex-grow">
                        {['Até 5 Metas Simultâneas', 'Histórico de Atividade', 'Suporte Prioritário', 'Sem Anúncios'].map(feature => (
                            <li key={feature} className="flex items-center text-xs font-bold text-zinc-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <div className="mb-6">
                        <span className="text-2xl font-black text-white">R$27,90</span>
                        <span className="text-[10px] font-bold text-zinc-500 ml-1">/MÊS</span>
                    </div>
                    {user.plan === Plan.PRO ? (
                        <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-500 font-black text-[10px] uppercase tracking-widest italic">Protocolo PRO Ativado</button>
                    ) : (
                        <button onClick={upgradeToPro} className="w-full py-4 rounded-xl bg-white hover:bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Upgrade para PRO</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
