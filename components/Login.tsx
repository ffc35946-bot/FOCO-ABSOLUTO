
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { BoltIcon } from './icons';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    
    const { login, register } = useUser();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
        if (val.length <= 11) {
            setPhone(val);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Insira um e-mail válido (ex: nome@dominio.com)');
            return;
        }

        if (isRegistering) {
            if (name.length < 3) {
                setError('Nome muito curto.');
                return;
            }
            if (phone.length !== 11) {
                setError('O número deve ter exatamente 11 dígitos (DDD + Número).');
                return;
            }
            if (password.length < 6) {
                setError('A senha deve ter no mínimo 6 caracteres.');
                return;
            }
            if (password !== confirmPassword) {
                setError('As senhas não coincidem!');
                return;
            }
            register({ email, name, phone, password });
        } else {
            login(email);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-500 rounded-3xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                        <BoltIcon className="w-12 h-12 text-black" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">
                        Foco<span className="text-emerald-500">Absoluto</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Protocolo de Alta Performance
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl transition-all duration-500">
                    <div className="flex mb-8 bg-black p-1 rounded-2xl border border-zinc-800">
                        <button 
                            onClick={() => { setIsRegistering(false); setError(''); }}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isRegistering ? 'bg-zinc-100 text-black' : 'text-zinc-500'}`}
                        >
                            Acesso
                        </button>
                        <button 
                            onClick={() => { setIsRegistering(true); setError(''); }}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isRegistering ? 'bg-zinc-100 text-black' : 'text-zinc-500'}`}
                        >
                            Cadastro
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegistering && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome"
                                        className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">WhatsApp (11 dígitos)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="11912345678"
                                        className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        required
                                    />
                                    <p className="text-[8px] text-zinc-700 font-bold px-1">{phone.length}/11 dígitos</p>
                                </div>
                            </>
                        )}
                        
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">E-mail Operacional</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="agente@foco.com"
                                className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                required
                            />
                        </div>

                        {isRegistering && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Senha</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Confirmar</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isRegistering && (
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-1">Senha</label>
                                <input
                                    type="password"
                                    placeholder="••••••"
                                    className="w-full bg-black text-white px-5 py-3 rounded-xl border border-zinc-800 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 px-4 rounded-xl mt-4 transition-all transform active:scale-95 shadow-xl shadow-emerald-500/10 text-[10px] uppercase tracking-widest"
                        >
                            {isRegistering ? 'Iniciar Recrutamento' : 'Acessar Painel'}
                        </button>
                    </form>
                </div>
            </div>
            
            <footer className="mt-16 text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">
                Versão 3.1.0 // Operação Estrita
            </footer>
        </div>
    );
};

export default Login;
