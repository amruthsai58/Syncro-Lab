import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Problem } from '../types';
import { PROBLEMS as DEFAULT_PROBLEMS } from '../data/mockData';

const STORAGE_KEY = 'syncro_custom_problems_v1';

interface ProblemContextValue {
  problems: Problem[];
  addProblem: (problem: Omit<Problem, 'id' | 'totalSubmissions' | 'acceptanceRate'>) => Problem;
  deleteProblem: (id: string) => boolean;
  updateProblem: (id: string, updated: Partial<Problem>) => boolean;
  resetToDefaults: () => void;
  getProblemBySlug: (slug: string) => Problem | undefined;
}

const ProblemContext = createContext<ProblemContextValue | null>(null);

export function ProblemProvider({ children }: { children: React.ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed to load custom problems from storage:', err);
    }
    return DEFAULT_PROBLEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    } catch (err) {
      console.warn('Failed to save problems to storage:', err);
    }
  }, [problems]);

  const addProblem = (newProb: Omit<Problem, 'id' | 'totalSubmissions' | 'acceptanceRate'>): Problem => {
    const id = String(Date.now());
    const slug = newProb.slug || newProb.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const problemWithDefaults: Problem = {
      ...newProb,
      id,
      slug,
      acceptanceRate: 50.0,
      totalSubmissions: 100,
      starterCode: newProb.starterCode || {
        python: '',
        java: '',
        cpp: '',
        javascript: '',
        go: '',
      },
    };

    setProblems(prev => [problemWithDefaults, ...prev]);
    return problemWithDefaults;
  };

  const deleteProblem = (id: string): boolean => {
    setProblems(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const updateProblem = (id: string, updated: Partial<Problem>): boolean => {
    setProblems(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    return true;
  };

  const resetToDefaults = () => {
    setProblems(DEFAULT_PROBLEMS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getProblemBySlug = (slug: string) => {
    return problems.find(p => p.slug === slug);
  };

  return (
    <ProblemContext.Provider
      value={{
        problems,
        addProblem,
        deleteProblem,
        updateProblem,
        resetToDefaults,
        getProblemBySlug,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblems() {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblems must be used within a ProblemProvider');
  }
  return context;
}
