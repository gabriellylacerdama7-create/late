export type TaskCategory = 'social-media' | 'fotografia' | 'edicao-video';
export type TaskStatus = 'para-iniciar' | 'em-andamento' | 'concluido';
export type TaskPriority = 'alta' | 'media' | 'baixa';

export interface TaskLinks {
  briefing: string;
  references: string[];
  finalVideo: string;
  editedPhotos: string;
  other: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  client: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  links: TaskLinks;
  notes: string;
}

export interface AppData {
  tasks: Task[];
  clients: string[];
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  'social-media': 'Social Media',
  'fotografia': 'Fotografia',
  'edicao-video': 'Edição de Vídeo',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'para-iniciar': 'Para Iniciar',
  'em-andamento': 'Em Andamento',
  'concluido': 'Concluído',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  'alta': 'Alta',
  'media': 'Média',
  'baixa': 'Baixa',
};

export const EMPTY_LINKS: TaskLinks = {
  briefing: '',
  references: [],
  finalVideo: '',
  editedPhotos: '',
  other: [],
};
