
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../hooks/useUser';
import { GoalCategory, GoalType } from '../types';
import { XIcon } from './icons';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose }) => {
    const { addGoal } = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<GoalCategory>(GoalCategory.Pessoal);
    const [months, setMonths] = useState('1');
    const [goalType, setGoalType] = useState<GoalType>(GoalType.Daily);
    const [targetAmount, setTargetAmount] = useState('');
    const [contributionType, setContributionType] = useState<'weekly' | 'monthly'>('monthly');

    useEffect(() => {
        if (goalType === GoalType.Money) {
            setCategory(GoalCategory.Dinheiro);
        } else if (category === GoalCategory.Dinheiro) {
            setCategory(GoalCategory.Pessoal);
        }
    }, [goalType]);

    const calculatedPeriodAmount = useMemo(() => {
        const total = parseFloat(targetAmount);
        const m = parseInt(months);
        if (isNaN(total) || isNaN(m) || m <= 0 || total <= 0) return 0;

        if (contributionType === 'monthly') {
            return total / m;
        } else {
            // Aproximadamente 4.345 semanas por mês
            const totalWeeks = m * 4.345;
            return total / totalWeeks;
        }
    }, [targetAmount, months, contributionType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !months) return;

        const numMonths = parseInt(months);
        if (isNaN(numMonths) || numMonths <= 0) return;

        const deadlineDate = new Date();
        deadlineDate.setMonth(deadlineDate.getMonth() + numMonths);

        const goalData: any = {
            name,
            description,
            category,
            deadline: deadlineDate.toISOString(),
            type: goalType,
        };

        if (goalType === GoalType.Money) {
            const amount = parseFloat(targetAmount);
            if (isNaN(amount) || amount <= 0) return;
            goalData.targetAmount = amount;
            goalData.contributionType = contributionType;
            goalData.amountPerPeriod = calculatedPeriodAmount;
        }

        addGoal(goalData);
        resetForm();
    };
    
    const resetForm = () => {
        setName('');
        setDescription('');
        setCategory(GoalCategory.Pessoal);
        setMonths('1');
        setGoalType(GoalType.Daily);
        setTargetAmount('');
        setContributionType('monthly');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 sm:p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                    <div>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 sm:mb-2 block">Configuração de Alvo</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">Nova Missão</h2>
                    </div>
                    <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 p-2 sm:p-3 rounded-full text-zinc-400 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
                    {/* Switcher de Tipo de Meta */}
                    <div className="bg-black p-1 rounded-xl flex border border-zinc-800">
                        <button type="button" onClick={() => setGoalType(GoalType.Daily)} className={`flex-1 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${goalType === GoalType.Daily ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>Hábito Diário</button>
                        <button type="button" onClick={() => setGoalType(GoalType.Money)} className={`flex-1 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${goalType === GoalType.Money ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>Meta Financeira</button>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {goalType === GoalType.Money && (
                            <>
                                <div className="space-y-3 sm:space-y-4">
                                    <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor Total da Conquista</label>
                                    <div className="relative">
                                        <span className="absolute left-0 bottom-2 sm:bottom-3 text-2xl sm:text-3xl font-black text-zinc-700">R$</span>
                                        <input
                                            type="number"
                                            value={targetAmount}
                                            onChange={(e) => setTargetAmount(e.target.value)}
                                            className="w-full bg-transparent border-b-2 sm:border-b-4 border-zinc-800 focus:border-emerald-500 text-5xl sm:text-7xl font-black text-white outline-none pl-10 sm:pl-12 pb-1 sm:pb-2 transition-all placeholder:text-zinc-800"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Frequência de Aporte</label>
                                        <div className="bg-black p-1 rounded-xl flex border border-zinc-800">
                                            <button type="button" onClick={() => setContributionType('weekly')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${contributionType === 'weekly' ? 'bg-emerald-600 text-white' : 'text-zinc-500'}`}>Semanal</button>
                                            <button type="button" onClick={() => setContributionType('monthly')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${contributionType === 'monthly' ? 'bg-emerald-600 text-white' : 'text-zinc-500'}`}>Mensal</button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-center">
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Cálculo Estimado</span>
                                        <span className="text-xl font-black text-white">R$ {calculatedPeriodAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase">por {contributionType === 'weekly' ? 'semana' : 'mês'}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identificação da Missão</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-zinc-800 focus:border-emerald-500 text-lg sm:text-xl font-bold outline-none placeholder:text-zinc-800 transition-colors"
                                placeholder="Ex: Viagem para Europa"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3 sm:space-y-4">
                                <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                                    disabled={goalType === GoalType.Money}
                                    className="w-full bg-black text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold appearance-none disabled:opacity-20 transition-colors"
                                >
                                    {Object.values(GoalCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Duração (Meses)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    className="w-full bg-black text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <label className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Descrição Estratégica</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-black text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none h-20 resize-none font-medium text-sm transition-colors"
                                placeholder="Por que essa missão é vital?"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button type="button" onClick={onClose} className="order-2 sm:order-1 flex-1 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all">Cancelar</button>
                        <button type="submit" className="order-1 sm:order-2 flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 shadow-xl transition-all transform active:scale-95">Iniciar Protocolo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;
