
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { BoltIcon, FireIcon, CashIcon } from './icons';
import { STORE_PACKAGE, DISCIPLINA_PENALTY, INITIAL_DISCIPLINA } from '../constants';

const TutorialModal: React.FC = () => {
    const { user, completeTutorial } = useUser();
    const [step, setStep] = useState(0);

    if (!user || user.hasCompletedTutorial) return null;

    const steps = [
        {
            title: "O Despertar",
            subtitle: "CONCEITO DO SISTEMA",
            desc: "Bem-vindo ao protocolo Foco Absoluto. Aqui, metas não são sugestões, são COMPROMISSOS. Falhar tem um custo real e imediato na sua experiência.",
            icon: (
                <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                    <div className="relative z-10 p-6 bg-zinc-900 border border-emerald-500/20 rounded-[2rem] shadow-2xl">
                        <BoltIcon className="w-16 h-16 text-emerald-500 animate-pulse" />
                    </div>
                </div>
            )
        },
        {
            title: "Sua Energia",
            subtitle: "RECURSO: DISCIPLINA",
            desc: `Você inicia com ${INITIAL_DISCIPLINA} Pontos de Disciplina. Cada check-in diário realizado protege sua energia. Sem check-in, o sistema drena sua conta.`,
            icon: (
                <div className="relative flex items-center justify-center w-32 h-32">
                    <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-orbit"></div>
                    <div className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-orbit [animation-delay:1s]"></div>
                    <div className="absolute w-2 h-2 bg-emerald-600 rounded-full animate-orbit [animation-delay:2s]"></div>
                    <div className="flex flex-col items-center animate-float">
                        <span className="text-6xl font-black text-white tracking-tighter emerald-glow-text">{INITIAL_DISCIPLINA}</span>
                        <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mt-1">VITALIDADE</span>
                    </div>
                </div>
            )
        },
        {
            title: "A Falha",
            subtitle: "CONSEQUÊNCIA REAL",
            desc: `O tempo é seu inimigo. Passou 24h sem check-in? Você perde ${DISCIPLINA_PENALTY} pontos. Zerar a disciplina bloqueia o acesso ao seu painel permanentemente.`,
            icon: (
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative z-10 p-6 bg-zinc-950 border border-red-500/30 rounded-[2rem]">
                        <FireIcon className="w-16 h-16 text-red-500" />
                        <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg shadow-red-600/20 animate-shake">
                            -{DISCIPLINA_PENALTY} PTS
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Resgate",
            subtitle: "RECARGA OPERACIONAL",
            desc: `Se o sistema travar, o único caminho de volta é via Mercado. Adquira créditos de disciplina para reativar seu protocolo e continuar sua jornada.`,
            icon: (
                <div className="relative flex flex-col items-center group">
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl group-hover:border-emerald-500/40 transition-all duration-500">
                        <CashIcon className="w-14 h-14 text-white group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                        <span className="text-lg font-black text-emerald-500 tracking-tighter">R$ {STORE_PACKAGE.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            )
        }
    ];

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[70] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header do Tutorial */}
                <div className="p-8 pb-4 flex justify-between items-center border-b border-zinc-800/50 bg-zinc-950/30">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{currentStep.subtitle}</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        {step + 1} / {steps.length}
                    </div>
                </div>

                <div className="p-10 text-center flex-grow flex flex-col items-center">
                    <div className="mb-12 flex items-center justify-center min-h-[160px] w-full">
                        {currentStep.icon}
                    </div>

                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic italic">{currentStep.title}</h2>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto mb-10">{currentStep.desc}</p>

                    {/* Barra de Progresso Visual */}
                    <div className="flex space-x-2 mb-10 items-center">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : i < step ? 'w-3 bg-emerald-900/40' : 'w-2 bg-zinc-800'}`}
                            ></div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (step < steps.length - 1) setStep(step + 1);
                            else completeTutorial();
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl text-[12px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.1)] border border-emerald-400/20"
                    >
                        {step < steps.length - 1 ? 'Prosseguir Briefing' : 'Iniciar Protocolo'}
                    </button>
                    
                    {step < steps.length - 1 && (
                         <button 
                            onClick={completeTutorial}
                            className="mt-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
                        >
                            Ignorar Tutorial
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;