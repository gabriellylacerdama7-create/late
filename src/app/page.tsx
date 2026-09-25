'use client'

import { useState } from 'react'
import { useTaskContext } from '@/contexts/TaskContext'
import { Task, CATEGORY_LABELS, STATUS_LABELS } from '@/types'
import { ListTodo, Clock, CheckCircle2, AlertCircle, TrendingUp, Plus } from 'lucide-react'
import { isTaskToday, isTaskOverdue, formatDate, getStatusColor, getCategoryColor, getClientTaskCounts } from '@/lib/utils'
import TaskModal from '@/components/TaskModal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  const { tasks } = useTaskContext()

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(undefined)
  }

  const currentHour = new Date().getHours()
  let greeting = 'Bom dia! 👋'
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Boa tarde! 👋'
  } else if (currentHour >= 18) {
    greeting = 'Boa noite! 👋'
  }

  const todayFormatted = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const activeTasks = tasks.filter(t => t.status !== 'concluido')
  const paraIniciarCount = tasks.filter(t => t.status === 'para-iniciar').length
  const emAndamentoCount = tasks.filter(t => t.status === 'em-andamento').length
  const completedTodayCount = tasks.filter(t => t.status === 'concluido' && isTaskToday(t)).length

  const todayTasks = tasks.filter(t => t.status !== 'concluido' && isTaskToday(t))
  const overdueTasks = tasks.filter(t => isTaskOverdue(t))

  const clientCounts = getClientTaskCounts(tasks)
  const maxClientCount = clientCounts.length > 0 ? Math.max(...clientCounts.map(c => c.count)) : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C1810]">{greeting}</h1>
          <p className="text-[#8B7355] capitalize">{todayFormatted}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#A0845C] text-white rounded-lg hover:bg-[#C4A882] transition-colors"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8B7355] font-medium mb-1">Total de Tarefas</p>
            <p className="text-2xl font-semibold text-[#2C1810]">{activeTasks.length}</p>
          </div>
          <div className="p-2 bg-[#FAF7F2] rounded-lg">
            <ListTodo size={20} className="text-[#8B7355]" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8B7355] font-medium mb-1">Para Iniciar</p>
            <p className="text-2xl font-semibold text-[#2C1810]">{paraIniciarCount}</p>
          </div>
          <div className="p-2 bg-[#F2D7D9] rounded-lg">
            <Clock size={20} className="text-[#8B4049]" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8B7355] font-medium mb-1">Em Andamento</p>
            <p className="text-2xl font-semibold text-[#2C1810]">{emAndamentoCount}</p>
          </div>
          <div className="p-2 bg-[#F5E6C8] rounded-lg">
            <AlertCircle size={20} className="text-[#8B6914]" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8B7355] font-medium mb-1">Concluídas Hoje</p>
            <p className="text-2xl font-semibold text-[#2C1810]">{completedTodayCount}</p>
          </div>
          <div className="p-2 bg-[#D4E8D0] rounded-lg">
            <CheckCircle2 size={20} className="text-[#2D6A2E]" />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-3 space-y-6">
          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#8B4049] flex items-center gap-2">
                <AlertCircle size={20} /> Tarefas Atrasadas
              </h2>
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleOpenModal(task)}
                    className="bg-white rounded-lg p-4 border border-red-200 shadow-sm cursor-pointer hover:border-red-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-[#2C1810]">{task.title}</h3>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                          {CATEGORY_LABELS[task.category]}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#8B7355]">
                      <span>Cliente: {task.client}</span>
                      <span className="text-red-500 font-medium">Vencimento: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#2C1810]">Atividades de Hoje</h2>
            {todayTasks.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-[#E8DDD3] text-center">
                <CheckCircle2 size={40} className="mx-auto text-[#D4E8D0] mb-3" />
                <p className="text-[#2C1810] font-medium">Nenhuma tarefa para hoje</p>
                <p className="text-[#8B7355] text-sm mt-1">Aproveite para adiantar outras atividades ou relaxar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleOpenModal(task)}
                    className="bg-white rounded-lg p-4 border border-[#E8DDD3] shadow-sm cursor-pointer hover:border-[#C4A882] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-[#2C1810]">{task.title}</h3>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                          {CATEGORY_LABELS[task.category]}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-[#8B7355]">
                      Cliente: {task.client}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[#2C1810] flex items-center gap-2">
            <TrendingUp size={20} className="text-[#A0845C]" /> Clientes mais ativos
          </h2>
          <div className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm">
            {clientCounts.length === 0 ? (
              <p className="text-[#8B7355] text-sm text-center py-4">Nenhum cliente com tarefas ativas no momento.</p>
            ) : (
              <div className="space-y-4">
                {clientCounts.slice(0, 5).map((client, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#2C1810]">{client.client}</span>
                      <span className="text-[#8B7355]">{client.count} {client.count === 1 ? 'tarefa' : 'tarefas'}</span>
                    </div>
                    <div className="h-2 w-full bg-[#E8DDD3] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#A0845C] rounded-full transition-all duration-500"
                        style={{ width: `${(client.count / maxClientCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </div>
  )
}
