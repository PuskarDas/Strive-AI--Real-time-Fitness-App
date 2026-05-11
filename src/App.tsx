/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoalsProvider } from './contexts/GoalsContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import DailyStats from './components/DailyStats';
import Biometrics from './components/Biometrics';
import Training from './components/Training';
import Recovery from './components/Recovery';
import WorkoutHistory from './components/WorkoutHistory';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

function MainApp() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans flex flex-col overflow-x-hidden selection:bg-[#CFFF04] selection:text-black" id="app-root">
      <Header />
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-10 max-w-[1600px] mx-auto w-full" id="main-content">
        
        {/* Left Panel: Main Daily Progress */}
        <section className="lg:col-span-8 flex flex-col gap-6" id="left-panel">
          <DailyStats />
          <Biometrics />
          <WorkoutHistory />
        </section>

        {/* Right Panel: Training & Insights */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="right-panel">
          <Training />
          <Recovery />
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <WorkoutProvider>
          <MainApp />
        </WorkoutProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}
