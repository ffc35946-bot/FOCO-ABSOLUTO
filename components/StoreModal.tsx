
import React from 'react';
import { useUser } from '../hooks/useUser';
import { BoltIcon, XIcon } from './icons';
import { STORE_PACKAGE } from '../constants';

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose }) => {
    const { buyDisciplina } = useUser();

    const handlePurchase = () => {
        buyDisciplina(STORE_PACKAGE.disciplina);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <div className="bg-gray-900 rounded-[2rem] w-full max-w-md border border-gray-800 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-gray-800">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Mercado de <span className="text-emerald-500">Disciplina</span></h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-gray-800 p-2 rounded-full">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-10">
                    <p className="text-gray-400 mb-10 font-medium">Não permita que sua evolução pare por falta de créditos operacionais. Recarregue agora.</p>
                    <div className="bg-black p-10 rounded-[2rem] border-2 border-emerald-500/20 flex flex-col items-center group hover:border-emerald-500 transition-all cursor-pointer shadow-inner">
                        <BoltIcon className="w-20 h-20 text-emerald-500 mb-6 group-hover:scale-110 transition-transform"/>
                        <p className="text-6xl font-black text-white tracking-tighter">{STORE_PACKAGE.disciplina}</p>
                        <p className="text-xs font-black text-emerald-500/60 uppercase tracking-[0.3em] mt-2">PONTOS DE DISCIPLINA</p>
                        <div className="h-px w-12 bg-gray-800 my-6"></div>
                        <p className="text-3xl font-black text-white">R$ {STORE_PACKAGE.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button
                        onClick={handlePurchase}
                        className="w-full mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 px-4 rounded-2xl transition-all transform hover:scale-[1.03] shadow-2xl shadow-emerald-500/30 uppercase tracking-widest text-sm active:scale-95"
                    >
                        Confirmar Transação
                    </button>
                    <p className="text-[10px] text-gray-600 text-center mt-6 font-bold uppercase tracking-widest">Acesso instantâneo após confirmação</p>
                </div>
            </div>
        </div>
    );
};

export default StoreModal;
