'use client';

import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task, STATUS_LABELS, CATEGORY_LABELS } from '@/types';
import { isTaskOnDate, getStatusColor, getCategoryColor, formatDate } from '@/lib/utils';
import TaskModal from '@/components/TaskModal';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isToday, getDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarPage() {
  const { tasks } = useTaskContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startingDayIndex = getDay(monthStart);
  const paddingDays = Array.from({ length: startingDayIndex }).map((_, i) => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - (startingDayIndex - i));
    return d;
  });

  const allDays = [...paddingDays, ...daysInMonth];
  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const monthName = capitalize(format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR }));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDateTasks = selectedDate 
    ? tasks.filter(task => isTaskOnDate(task, selectedDate))
    : [];

  const handleNewTaskForDate = () => {
    setEditTask(undefined);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Calendário</h1>
          <p className="text-[#8B7355] mt-1">Visualize suas tarefas por data de entrega</p>
        </div>
        <button
          onClick={() => {
            setEditTask(undefined);
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#A0845C] hover:bg-[#C4A882] text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
        >
          <Plus size={20} />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DDD3] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C1810]">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-[#FAF7F2] text-[#8B7355] transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-[#FAF7F2] text-[#8B7355] transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-xs text-[#8B7355] font-medium text-center py-2">
              {day}
            </div>
          ))}

          {allDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isTodayDate = isToday(date);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const dayTasks = tasks.filter(t => isTaskOnDate(t, date));

            return (
              <div
                key={index}
                onClick={() => handleDayClick(date)}
                className={`min-h-[100px] md:min-h-[120px] bg-white rounded-lg border p-1.5 cursor-pointer transition-all ${
                  isCurrentMonth ? 'border-[#E8DDD3] hover:border-[#A0845C]' : 'border-transparent opacity-30 pointer-events-none'
                } ${isSelected ? 'ring-2 ring-[#A0845C]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-xs font-medium ${
                      isTodayDate
                        ? 'bg-[#A0845C] text-white w-6 h-6 rounded-full flex items-center justify-center'
                        : 'text-[#2C1810] p-1'
                    }`}
                  >
                    {format(date, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-[#8B7355]">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium truncate ${getStatusColor(task.status)}`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-[#8B7355] font-medium px-1">
                      +{dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl border border-[#E8DDD3] p-5 mt-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-[#2C1810]">
              Tarefas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <button
              onClick={handleNewTaskForDate}
              className="flex items-center justify-center gap-1 text-sm bg-[#FAF7F2] hover:bg-[#E8DDD3] text-[#2C1810] px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Adicionar tarefa</span>
            </button>
          </div>

          {selectedDateTasks.length === 0 ? (
            <p className="text-[#8B7355] py-4 text-center">Nenhuma tarefa para este dia.</p>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleEditTask(task)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-[#E8DDD3] hover:border-[#A0845C] cursor-pointer transition-colors bg-[#FAF7F2] gap-3"
                >
                  <div>
                    <h4 className="font-medium text-[#2C1810]">{task.title}</h4>
                    {task.client && (
                      <p className="text-xs text-[#8B7355] mt-0.5">{task.client}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(task.category)}`}>
                      {CATEGORY_LABELS[task.category]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <TaskModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditTask(undefined);
          }}
          task={editTask}
        />
    </div>
  );
}
