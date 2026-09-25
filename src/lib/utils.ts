import { format, isToday, isFuture, isPast, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task, TaskCategory, TaskStatus, TaskPriority } from '@/types';

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), "dd 'de' MMM, yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd/MM', { locale: ptBR });
  } catch {
    return dateStr;
  }
}

export function isTaskToday(task: Task): boolean {
  if (!task.dueDate) return false;
  try {
    return isToday(parseISO(task.dueDate));
  } catch {
    return false;
  }
}

export function isTaskUpcoming(task: Task): boolean {
  if (!task.dueDate) return false;
  try {
    return isFuture(parseISO(task.dueDate));
  } catch {
    return false;
  }
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  try {
    return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && task.status !== 'concluido';
  } catch {
    return false;
  }
}

export function isTaskOnDate(task: Task, date: Date): boolean {
  if (!task.dueDate) return false;
  try {
    return isSameDay(parseISO(task.dueDate), date);
  } catch {
    return false;
  }
}

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    'para-iniciar': 'bg-[#F2D7D9] text-[#8B4049]',
    'em-andamento': 'bg-[#F5E6C8] text-[#8B6914]',
    'concluido': 'bg-[#D4E8D0] text-[#2D6A2E]',
  };
  return colors[status];
}

export function getCategoryColor(category: TaskCategory): string {
  const colors: Record<TaskCategory, string> = {
    'social-media': 'bg-[#E8D5F0] text-[#6B3FA0]',
    'fotografia': 'bg-[#D5E5F0] text-[#2B5F8A]',
    'edicao-video': 'bg-[#F0DDD5] text-[#8B5A3C]',
  };
  return colors[category];
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    'alta': 'bg-red-100 text-red-700',
    'media': 'bg-yellow-100 text-yellow-700',
    'baixa': 'bg-green-100 text-green-700',
  };
  return colors[priority];
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

export function getClientTaskCounts(tasks: Task[]): { client: string; count: number }[] {
  const counts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task.client) {
      counts[task.client] = (counts[task.client] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([client, count]) => ({ client, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
