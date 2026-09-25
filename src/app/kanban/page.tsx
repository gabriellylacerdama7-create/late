'use client';

import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task, TaskStatus, TaskCategory, STATUS_LABELS, CATEGORY_LABELS } from '@/types';
import { getCategoryColor, formatDateShort } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import TaskModal from '@/components/TaskModal';
import { Plus, GripVertical, Calendar, User } from 'lucide-react';

export default function KanbanPage() {
  const { tasks, updateTask } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'Todos'>('Todos');
  const [selectedClient, setSelectedClient] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  const uniqueClients = Array.from(new Set(tasks.map(t => t.client).filter(Boolean)));

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory !== 'Todos' && task.category !== selectedCategory) return false;
    if (selectedClient !== 'Todos' && task.client !== selectedClient) return false;
    return true;
  });

  const columns: { id: TaskStatus; title: string; headerColor: string; }[] = [
    { id: 'para-iniciar', title: 'Para Iniciar', headerColor: 'bg-[#F2D7D9] text-[#8B4049]' },
    { id: 'em-andamento', title: 'Em Andamento', headerColor: 'bg-[#F5E6C8] text-[#8B6914]' },
    { id: 'concluido', title: 'Concluído', headerColor: 'bg-[#D4E8D0] text-[#2D6A2E]' },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    updateTask(draggableId, { status: destination.droppableId as TaskStatus });
  };

  const handleOpenModal = (task?: Task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#2C1810]">Kanban</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'Todos')}
            className="w-full sm:w-auto bg-white border border-[#E8DDD3] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#A0845C]"
          >
            <option value="Todos">Todas Categorias</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full sm:w-auto bg-white border border-[#E8DDD3] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#A0845C]"
          >
            <option value="Todos">Todos Clientes</option>
            {uniqueClients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-[#A0845C] hover:bg-[#C4A882] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">Nova Tarefa</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 md:gap-6 overflow-x-auto min-h-[calc(100vh-200px)] pb-4">
          {columns.map(column => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id);

            return (
              <div key={column.id} className="flex-1 min-w-[280px] md:min-w-[300px] flex flex-col">
                <div className={`rounded-t-xl px-4 py-3 flex items-center justify-between ${column.headerColor}`}>
                  <h2 className="font-medium text-sm">{column.title}</h2>
                  <span className="text-xs font-bold bg-white/30 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white/50 rounded-b-xl p-3 space-y-3 flex-1 border border-[#E8DDD3] border-t-0 flex flex-col"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={(e) => {
                                // Only trigger if it wasn't a drag event (simple heuristic: handle clicks normally)
                                handleOpenModal(task);
                              }}
                              className="bg-white rounded-lg p-4 border border-[#E8DDD3] shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group relative"
                            >
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4 text-[#E8DDD3]" />
                              </div>
                              <h3 className="font-medium text-sm text-[#2C1810] pr-6">{task.title}</h3>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <User className="w-3 h-3 text-[#8B7355]" />
                                <span className="text-xs text-[#8B7355] truncate">{task.client}</span>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <span className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(task.category)}`}>
                                  {CATEGORY_LABELS[task.category as TaskCategory] || task.category}
                                </span>
                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-[#8B7355]">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDateShort(task.dueDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {columnTasks.length === 0 && (
                        <div className="flex-1 border-2 border-dashed border-[#E8DDD3] rounded-lg flex items-center justify-center p-4 min-h-[100px]">
                          <span className="text-sm text-[#8B7355] text-center">Arraste tarefas aqui</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditTask(undefined);
          }}
          task={editTask}
        />
      )}
    </div>
  );
}
