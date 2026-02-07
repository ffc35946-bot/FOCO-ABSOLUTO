
import React from 'react';
import { BoltIcon } from './icons';

interface BlockedOverlayProps {
    onOpenStore: () => void;
}

const BlockedOverlay: React.FC<BlockedOverlayProps> = ({ onOpenStore }) => {
    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6 text-center backdrop-blur-md">
            <div className="max-w-md w-full">
                <div className="flex justify-center mb-8">
                    <div className="bg-red-500/10 p-6 rounded-full border border-red-500/20">
                        <BoltIcon className="w-16 h-16 text-red-500 animate-pulse" />
                    </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">Sistema Travado</h1>
                <p className="text-zinc-500 mb-10 font-medium text-sm sm:text-base">
                    Sua disciplina operacional atingiu o nível crítico. O sistema foi bloqueado para evitar falha total da missão.
                </p>
                <button
                    onClick={onOpenStore}
                    className="w-full bg-white hover:bg-emerald-500 text-black font-black py-5 px-8 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-[1.03] shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    Recarregar Disciplina
                </button>
            </div>
        </div>
    );
};

export default BlockedOverlay;
