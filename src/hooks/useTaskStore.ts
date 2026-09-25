'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, AppData, EMPTY_LINKS } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'taskflow-data';

const DEFAULT_DATA: AppData = {
  tasks: [],
  clients: [],
};

function loadData(): AppData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as AppData;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      clients: Array.isArray(parsed.clients) ? parsed.clients : [],
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function useTaskStore() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setIsLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (isLoaded) {
      saveData(data);
    }
  }, [data, isLoaded]);

  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        links: taskData.links || EMPTY_LINKS,
      };
      setData((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const addClient = useCallback((name: string) => {
    setData((prev) => {
      if (prev.clients.includes(name)) return prev;
      return { ...prev, clients: [...prev.clients, name].sort() };
    });
  }, []);

  const removeClient = useCallback((name: string) => {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c !== name),
    }));
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as AppData;
      if (Array.isArray(parsed.tasks) && Array.isArray(parsed.clients)) {
        setData(parsed);
      }
    } catch (e) {
      console.error('Failed to import data:', e);
    }
  }, []);

  const clearAll = useCallback(() => {
    setData(DEFAULT_DATA);
  }, []);

  return {
    tasks: data.tasks,
    clients: data.clients,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    addClient,
    removeClient,
    exportData,
    importData,
    clearAll,
  };
}
