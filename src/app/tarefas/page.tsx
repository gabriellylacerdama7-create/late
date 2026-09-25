'use client'

import { useState } from 'react'
import { useTaskContext } from '@/contexts/TaskContext'
import { Task, TaskStatus, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '@/types'
import { 
  formatDate, 
  getStatusColor, 
  getCategoryColor, 
  getPriorityColor, 
  isTaskToday, 
  isTaskUpcoming, 
  isTaskOverdue 
} from '@/lib/utils'
import TaskModal from '@/components/TaskModal'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  FileText, 
  Video, 
  Image, 
  Link2, 
  Calendar, 
  Clock, 
  AlertTriangle,
  X
} from 'lucide-react'

export default function TarefasPage() {
  const { tasks, deleteTask } = useTaskContext()
  const [activeTab, setActiveTab] = useState<'hoje' | 'proximas' | 'concluidas'>('hoje')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | undefined>(undefined)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'hoje') {
      return (isTaskToday(task) && task.status !== 'concluido') || (isTaskOverdue(task) && task.status !== 'concluido')
    }
    if (activeTab === 'proximas') {
      return isTaskUpcoming(task) && task.status !== 'concluido'
    }
    if (activeTab === 'concluidas') {
      return task.status === 'concluido'
    }
    return false
  })

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(id)
      if (selectedTask?.id === id) {
        setSelectedTask(null)
      }
    }
  }

  const handleEdit = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation()
    setEditTask(task)
    setModalOpen(true)
  }

  const countLinks = (task: Task) => {
    let count = 0
    if (task.links?.briefing) count++
    if (task.links?.finalVideo) count++
    if (task.links?.editedPhotos) count++
    if (task.links?.references?.length) count += task.links.references.length
    if (task.links?.other?.length) count += task.links.other.length
    return count
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2C1810]">Tarefas</h1>
        <button
          onClick={() => {
            setEditTask(undefined)
            setModalOpen(true)
          }}
          className="bg-[#A0845C] text-white rounded-lg px-4 py-2.5 flex items-center gap-2 hover:bg-[#C4A882] transition-colors"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg p-1 border border-[#E8DDD3] w-fit">
        {(['hoje', 'proximas', 'concluidas'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize rounded-md px-4 py-2 text-sm transition-colors ${
              activeTab === tab
                ? 'bg-[#A0845C] text-white font-medium'
                : 'text-[#8B7355] hover:bg-[#E8DDD3]'
            }`}
          >
            {tab === 'hoje' ? 'Hoje' : tab === 'proximas' ? 'Próximas' : 'Concluídas'}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl p-10 border border-[#E8DDD3] flex flex-col items-center justify-center text-center space-y-3">
          <Calendar size={48} className="text-[#E8DDD3]" />
          <div className="text-[#8B7355]">
            Nenhuma tarefa encontrada para esta categoria.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map(task => {
            const linkCount = countLinks(task)
            const isOverdue = isTaskOverdue(task) && task.status !== 'concluido'

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-xl p-5 border border-[#E8DDD3] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[#2C1810] group-hover:text-[#A0845C] transition-colors">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEdit(e, task)}
                      className="text-[#8B7355] hover:text-[#2C1810] p-1 rounded hover:bg-[#FAF7F2]"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, task.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-[#8B7355] mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}>
                    {STATUS_LABELS[task.status]}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {CATEGORY_LABELS[task.category]}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  {isOverdue && (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Atrasada
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-[#8B7355]">
                  {task.client && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-[#2C1810]">Cliente:</span>
                      {task.client}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(task.dueDate)}
                  </div>
                  {linkCount > 0 && (
                    <div className="flex items-center gap-1" title={`${linkCount} link(s) anexado(s)`}>
                      <Link2 size={14} />
                      {linkCount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Task Detail Panel Backdrop */}
      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setSelectedTask(null)}
        />
      )}

      {/* Task Detail Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF7F2] shadow-2xl z-40 border-l border-[#E8DDD3] transform transition-transform duration-300 ease-in-out ${
          selectedTask ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        {selectedTask && (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-[#E8DDD3] flex items-start justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#2C1810] pr-8">{selectedTask.title}</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-[#8B7355] hover:text-[#2C1810] bg-[#FAF7F2] p-1.5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-grow">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                  {STATUS_LABELS[selectedTask.status]}
                </span>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(selectedTask.category)}`}>
                  {CATEGORY_LABELS[selectedTask.category]}
                </span>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                  {PRIORITY_LABELS[selectedTask.priority]}
                </span>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E8DDD3]">
                {selectedTask.client && (
                  <div>
                    <div className="text-xs font-medium text-[#8B7355] uppercase tracking-wider mb-1">Cliente</div>
                    <div className="text-[#2C1810]">{selectedTask.client}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-medium text-[#8B7355] uppercase tracking-wider mb-1">Data de Entrega</div>
                  <div className="text-[#2C1810] flex items-center gap-2">
                    <Calendar size={16} className="text-[#A0845C]" />
                    {formatDate(selectedTask.dueDate)}
                  </div>
                </div>
              </div>

              {selectedTask.description && (
                <div>
                  <div className="text-sm font-semibold text-[#2C1810] mb-2">Descrição</div>
                  <div className="bg-white p-4 rounded-xl border border-[#E8DDD3] text-[#4A3B32] whitespace-pre-wrap text-sm">
                    {selectedTask.description}
                  </div>
                </div>
              )}

              {selectedTask.notes && (
                <div>
                  <div className="text-sm font-semibold text-[#2C1810] mb-2">Notas</div>
                  <div className="bg-white p-4 rounded-xl border border-[#E8DDD3] text-[#4A3B32] whitespace-pre-wrap text-sm">
                    {selectedTask.notes}
                  </div>
                </div>
              )}

              {/* Links Section */}
              {countLinks(selectedTask) > 0 && (
                <div>
                  <div className="text-sm font-semibold text-[#2C1810] mb-2 flex items-center gap-2">
                    <Link2 size={16} />
                    Links e Anexos
                  </div>
                  <div className="bg-white rounded-xl border border-[#E8DDD3] overflow-hidden divide-y divide-[#E8DDD3]">
                    {selectedTask.links?.briefing && (
                      <a href={selectedTask.links.briefing} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors group">
                        <div className="flex items-center gap-3 text-sm text-[#2C1810]">
                          <FileText size={18} className="text-[#8B7355]" />
                          Briefing
                        </div>
                        <ExternalLink size={14} className="text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {selectedTask.links?.finalVideo && (
                      <a href={selectedTask.links.finalVideo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors group">
                        <div className="flex items-center gap-3 text-sm text-[#2C1810]">
                          <Video size={18} className="text-[#8B7355]" />
                          Vídeo Pronto
                        </div>
                        <ExternalLink size={14} className="text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {selectedTask.links?.editedPhotos && (
                      <a href={selectedTask.links.editedPhotos} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors group">
                        <div className="flex items-center gap-3 text-sm text-[#2C1810]">
                          <Image size={18} className="text-[#8B7355]" />
                          Fotos Editadas
                        </div>
                        <ExternalLink size={14} className="text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {selectedTask.links?.references?.map((ref, idx) => (
                      <a key={idx} href={ref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors group">
                        <div className="flex items-center gap-3 text-sm text-[#2C1810]">
                          <Link2 size={18} className="text-[#8B7355]" />
                          Referência {idx + 1}
                        </div>
                        <ExternalLink size={14} className="text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                    {selectedTask.links?.other?.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors group">
                        <div className="flex items-center gap-3 text-sm text-[#2C1810]">
                          <Link2 size={18} className="text-[#8B7355]" />
                          Link {idx + 1}
                        </div>
                        <ExternalLink size={14} className="text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-[#E8DDD3] sticky bottom-0">
              <button
                onClick={() => {
                  setEditTask(selectedTask)
                  setModalOpen(true)
                  setSelectedTask(null)
                }}
                className="w-full bg-[#A0845C] text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#C4A882] transition-colors font-medium"
              >
                <Edit3 size={18} />
                Editar Tarefa
              </button>
            </div>
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        task={editTask} 
      />
    </div>
  )
}
