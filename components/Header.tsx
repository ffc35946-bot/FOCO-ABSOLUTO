
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { BoltIcon, SettingsIcon, LogoutIcon } from './icons';

interface HeaderProps {
    onNavigate: (view: 'dashboard' | 'settings') => void;
    onOpenStore: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenStore }) => {
    const { user, logout } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    
    if (!user) return null;

    const disciplinaColor = user.disciplina > 10 ? 'text-emerald-500' : user.disciplina > 0 ? 'text-yellow-500' : 'text-red-500';

    return (
        <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-40 h-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('dashboard')}>
                    <div className="bg-emerald-500 p-1.5 rounded-lg emerald-glow">
                        <BoltIcon className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-lg font-black ml-3 tracking-tighter text-white uppercase group-hover:text-emerald-500 transition-colors">Foco<span className="opacity-40">Absoluto</span></span>
                </div>

                <div className="flex items-center space-x-8">
                    <div 
                        className="flex items-center cursor-pointer group"
                        onClick={onOpenStore}
                    >
                        <div className="flex flex-col items-end mr-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-emerald-500/60 transition-colors">Sistema de Disciplina</span>
                            <span className={`text-xl font-black ${disciplinaColor} leading-none emerald-glow-text`}>{user.disciplina}</span>
                        </div>
                        <div className="h-8 w-px bg-zinc-800"></div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center group">
                            <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center font-black text-white hover:border-emerald-500/50 transition-all">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                        </button>
                        
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-4 w-64 rounded-2xl shadow-2xl py-2 bg-zinc-900 border border-zinc-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-5 py-4 border-b border-zinc-800">
                                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Conta Ativa</p>
                                        <p className="text-sm text-zinc-100 font-bold truncate">{user.email}</p>
                                        <span className="mt-3 inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-tighter">
                                            Plano {user.plan}
                                        </span>
                                    </div>
                                    <div className="py-2">
                                        <button onClick={() => { onNavigate('settings'); setMenuOpen(false); }} className="w-full flex items-center px-5 py-3 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                                            <SettingsIcon className="w-4 h-4 mr-3" /> Configurações
                                        </button>
                                        <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full flex items-center px-5 py-3 text-sm text-red-500/70 hover:bg-red-500/5 hover:text-red-500 transition-colors">
                                            <LogoutIcon className="w-4 h-4 mr-3" /> Encerrar Protocolo
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
