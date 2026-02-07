
import React from 'react';
import { useUser } from '../hooks/useUser';
import { Plan } from '../types';

interface SettingsProps {
    onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const { user, upgradeToPro } = useUser();

    if (!user) return null;

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Gerenciamento Operacional</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none">Configurações</h1>
                </div>
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black px-6 py-3 rounded-xl border border-zinc-800 transition-all text-[10px] uppercase tracking-widest active:scale-95 self-start"
                    >
                        ← Voltar ao Painel
                    </button>
                )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 sm:p-10 mb-12 shadow-xl">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Credenciais de Acesso</h2>
                <div className="space-y-2">
                    <div className="flex justify-between items-center py-4 border-b border-zinc-800/50">
                        <span className="text-xs font-bold text-zinc-400">Identificador:</span>
                        <span className="text-sm font-black text-white">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-zinc-800/50">
                        <span className="text-xs font-bold text-zinc-400">Nível de Acesso:</span>
                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${user.plan === Plan.PRO ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-zinc-800 border border-zinc-700 text-zinc-500'}`}>
                            Protocolo {user.plan}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gratuito */}
                <div className={`p-8 rounded-[2rem] border transition-all ${user.plan === Plan.Gratuito ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-zinc-800 bg-zinc-900/50'} flex flex-col h-full`}>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Básico</h3>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-6">Operação Padrão</p>
                    <ul className="space-y-4 mb-10 flex-grow">
                        {['1 Meta Ativa', 'Check-in Operacional', 'Sistema de Disciplina'].map(feature => (
                            <li key={feature} className="flex items-center text-xs font-bold text-zinc-400">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-3"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-500 font-black text-[9px] uppercase tracking-widest border border-zinc-700/50">
                        {user.plan === Plan.Gratuito ? 'Nível Ativo' : '-'}
                    </button>
                </div>

                {/* PRO - Ajustado para Inativo/Em Revisão */}
                <div className="p-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/20 flex flex-col h-full relative overflow-hidden group opacity-60 grayscale">
                    <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 font-black text-[7px] uppercase px-3 py-1 tracking-widest rounded-full border border-zinc-700">
                        Indisponível
                    </div>
                    
                    <h3 className="text-2xl font-black text-zinc-400 uppercase tracking-tighter mb-1">Elite PRO</h3>
                    <p className="text-red-500/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Em Revisão Técnica</p>
                    
                    <ul className="space-y-4 mb-10 flex-grow">
                        {['Até 5 Metas Simultâneas', 'Histórico de Atividade', 'Dashboard PRO', 'Sem Anúncios'].map(feature => (
                            <li key={feature} className="flex items-center text-xs font-bold text-zinc-600">
                                <span className="w-1 h-1 rounded-full bg-zinc-700 mr-3"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mb-6">
                        <span className="text-xl font-black text-zinc-500">R$ 27,90</span>
                        <span className="text-[9px] font-bold text-zinc-600 ml-1">/MÊS</span>
                    </div>

                    <button disabled className="w-full py-4 rounded-xl bg-zinc-950 text-zinc-700 border border-zinc-800 font-black text-[9px] uppercase tracking-widest italic cursor-not-allowed">
                        Acesso Inativo
                    </button>
                    
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-lg rotate-[-5deg] shadow-2xl">
                             <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Módulo em Manutenção</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
