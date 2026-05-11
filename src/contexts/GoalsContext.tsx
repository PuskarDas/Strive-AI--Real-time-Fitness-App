import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface Goals {
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  water: number;
}

interface GoalsContextType {
  goals: Goals;
  updateGoals: (newGoals: Partial<Goals>) => Promise<void>;
  loading: boolean;
}

const defaultGoals: Goals = {
  steps: 10000,
  distance: 8,
  calories: 2500,
  activeMinutes: 60,
  water: 2500,
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goals>(defaultGoals);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGoals(defaultGoals);
      setLoading(false);
      return;
    }

    const goalsDocPath = `users/${user.uid}/goals/current`;
    const unsubscribe = onSnapshot(doc(db, goalsDocPath), (docSnap) => {
      if (docSnap.exists()) {
        setGoals(docSnap.data() as Goals);
      } else {
        setGoals(defaultGoals);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching goals:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const updateGoals = async (newGoals: Partial<Goals>) => {
    if (!user) return;

    const goalsDocPath = `users/${user.uid}/goals/current`;
    try {
      await setDoc(doc(db, goalsDocPath), {
        ...goals,
        ...newGoals,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating goals:", error);
    }
  };

  return (
    <GoalsContext.Provider value={{ goals, updateGoals, loading }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
