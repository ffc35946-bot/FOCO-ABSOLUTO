
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { UserProvider, useUser } from './hooks/useUser';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlockedOverlay from './components/BlockedOverlay';
import Header from './components/Header';
import StoreModal from './components/StoreModal';
import Settings from './components/Settings';

type View = 'dashboard' | 'settings';

const AppContent: React.FC = () => {
    const { user, loading, isBlocked, checkOverdueGoals } = useUser();
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [view, setView] = useState<View>('dashboard');

    useEffect(() => {
        const interval = setInterval(() => {
            checkOverdueGoals();
        }, 60 * 1000); // Check every minute for overdue goals

        return () => clearInterval(interval);
    }, [checkOverdueGoals]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">Sincronizando Protocolo...</p>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-400">
            <Header onNavigate={setView} onOpenStore={() => setStoreOpen(true)} />
            <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                {isBlocked && <BlockedOverlay onOpenStore={() => setStoreOpen(true)} />}
                
                <div className={isBlocked ? 'blur-md pointer-events-none' : ''}>
                    {view === 'dashboard' && <Dashboard />}
                    {view === 'settings' && <Settings onBack={() => setView('dashboard')} />}
                </div>

                <StoreModal isOpen={isStoreOpen} onClose={() => setStoreOpen(false)} />
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
};

export default App;
