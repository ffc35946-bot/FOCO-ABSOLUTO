
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
    const { user, isBlocked, checkOverdueGoals } = useUser();
    const [isStoreOpen, setStoreOpen] = useState(false);
    const [view, setView] = useState<View>('dashboard');

    useEffect(() => {
        const interval = setInterval(() => {
            checkOverdueGoals();
        }, 60 * 1000); // Check every minute for overdue goals

        return () => clearInterval(interval);
    }, [checkOverdueGoals]);

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
                    {view === 'settings' && <Settings />}
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
