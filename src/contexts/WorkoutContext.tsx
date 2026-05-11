import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, auth: any) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
}

export interface WorkoutRecord {
  id: string;
  type: string;
  category: 'Strength' | 'Running' | 'Mobility';
  date: string;
  duration: string;
  intensity: 'High' | 'Medium' | 'Low';
  calories: number;
  exercises?: Exercise[];
  userId: string;
  createdAt: any;
}

interface WorkoutContextType {
  history: WorkoutRecord[];
  addWorkout: (workout: Omit<WorkoutRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  loading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const workoutsPath = `users/${user.uid}/workouts`;
    const q = query(collection(db, workoutsPath), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkoutRecord[];
      setHistory(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, workoutsPath, { currentUser: user });
    });

    return unsubscribe;
  }, [user]);

  const addWorkout = async (workout: Omit<WorkoutRecord, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const workoutsPath = `users/${user.uid}/workouts`;
    try {
      await addDoc(collection(db, workoutsPath), {
        ...workout,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, workoutsPath, { currentUser: user });
    }
  };

  return (
    <WorkoutContext.Provider value={{ history, addWorkout, loading }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
}
