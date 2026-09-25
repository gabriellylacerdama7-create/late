'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Task } from '@/types';

interface TaskContextType {
  tasks: Task[];
  clients: string[];
  isLoaded: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addClient: (name: string) => void;
  removeClient: (name: string) => void;
  exportData: () => string;
  importData: (json: string) => void;
  clearAll: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const store = useTaskStore();
  return <TaskContext.Provider value={store}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}
