
import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { BoltIcon } from './icons';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [localError, setLocalError] = useState('');
    
    const { login, register, loading, notifications } = useUser();

    // Limpar erro local quando as notificações do sistema mudarem
    useEffect(() => {
        if (notifications.some(n => n.type === 'error')) {
            setLocalError('');
        }
    }, [notifications]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 11) setPhone(val);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!validateEmail(email)) {
            setLocalError('Insira um e-mail válido.');
            return;
        }

        if (password.length < 6) {
            setLocalError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        if (isRegistering) {
            if (name.length < 3) {
                setLocalError('Nome muito curto.');
                return;
            }
            if (phone.length !== 11) {
                setLocalError('Telefone inválido (DDD+Número).');
                return;
            }
            if (password !== confirmPassword) {
                setLocalError('Senhas não coincidem.');
                return;
            }
            await register({ email, name, phone, password });
        } else {
            await login(email, password);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-500 rounded-3xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <BoltIcon className="w-12 h-12 text-black" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">
                        Foco<span className="text-emerald-500">Absoluto</span>
                    </h1>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex mb-8 bg-black p-1 rounded-2xl border border-zinc-800">
                        <button 
                            onClick={() => { setIsRegistering(false); setLocalError(''); }}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isRegistering ? 'bg-white text-black' : 'text-zinc-500'}`}
                        >
                            Acesso
                        </button>
                        <button 
                            onClick={() => { setIsRegistering(true); setLocalError(''); }}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isRegistering ? 'bg-white text-black' : 'text-zinc-500'}`}
                        >
                            Cadastro
                        </button>
                    </div>

                    {localError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                            {localError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegistering && (
                            <>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome Completo"
                                    className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold text-sm"
                                    required
                                />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="WhatsApp (DDD + Número)"
                                    className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold text-sm"
                                    required
                                />
                            </>
                        )}
                        
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold text-sm"
                            required
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold text-sm"
                            required
                        />

                        {isRegistering && (
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmar Senha"
                                className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none font-bold text-sm"
                                required
                            />
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl mt-4 transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                        >
                            {loading ? 'Processando...' : (isRegistering ? 'Criar Conta' : 'Entrar')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
