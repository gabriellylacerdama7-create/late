'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { X } from 'lucide-react';
import { Task, TaskCategory, TaskStatus, TaskPriority, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, EMPTY_LINKS } from '@/types';
import { useTaskContext } from '@/contexts/TaskContext';
import { getTodayISO } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { addTask, updateTask, clients, addClient } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [newClient, setNewClient] = useState('');
  const [category, setCategory] = useState<TaskCategory>('social-media');
  const [status, setStatus] = useState<TaskStatus>('para-iniciar');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [notes, setNotes] = useState('');
  const [briefing, setBriefing] = useState('');
  const [finalVideo, setFinalVideo] = useState('');
  const [editedPhotos, setEditedPhotos] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [otherUrl, setOtherUrl] = useState('');
  const [otherLinks, setOtherLinks] = useState<string[]>([]);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setClient(task.client);
      setCategory(task.category);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setNotes(task.notes);
      setBriefing(task.links.briefing);
      setFinalVideo(task.links.finalVideo);
      setEditedPhotos(task.links.editedPhotos);
      setReferences(task.links.references || []);
      setOtherLinks(task.links.other || []);
      setShowLinks(!!(task.links.briefing || task.links.finalVideo || task.links.editedPhotos || task.links.references?.length || task.links.other?.length));
    } else {
      setTitle('');
      setDescription('');
      setClient('');
      setCategory('social-media');
      setStatus('para-iniciar');
      setPriority('media');
      setDueDate(getTodayISO());
      setNotes('');
      setBriefing('');
      setFinalVideo('');
      setEditedPhotos('');
      setReferences([]);
      setOtherLinks([]);
      setShowLinks(false);
    }
    setNewClient('');
    setReferenceUrl('');
    setOtherUrl('');
  }, [task, isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        client,
        category,
        status,
        priority,
        dueDate,
        notes: notes.trim(),
        links: {
          briefing,
          references,
          finalVideo,
          editedPhotos,
          other: otherLinks,
        },
      };

      if (task) {
        updateTask(task.id, taskData);
      } else {
        addTask(taskData);
      }
      onClose();
    },
    [title, description, client, category, status, priority, dueDate, notes, briefing, references, finalVideo, editedPhotos, otherLinks, task, addTask, updateTask, onClose]
  );

  const handleAddClient = useCallback(() => {
    if (newClient.trim()) {
      addClient(newClient.trim());
      setClient(newClient.trim());
      setNewClient('');
    }
  }, [newClient, addClient]);

  const addReference = useCallback(() => {
    if (referenceUrl.trim()) {
      setReferences((prev) => [...prev, referenceUrl.trim()]);
      setReferenceUrl('');
    }
  }, [referenceUrl]);

  const addOtherLink = useCallback(() => {
    if (otherUrl.trim()) {
      setOtherLinks((prev) => [...prev, otherUrl.trim()]);
      setOtherUrl('');
    }
  }, [otherUrl]);

  if (!isOpen) return null;

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-[#E8DDD3] bg-white text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#A0845C]/40 focus:border-[#A0845C] placeholder:text-[#8B7355]/50';
  const labelClass = 'block text-xs font-semibold text-[#8B7355] mb-1';
  const selectClass = inputClass + ' appearance-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#FAF7F2] px-6 py-4 border-b border-[#E8DDD3] flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-[#2C1810]">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#E8DDD3] text-[#8B7355]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass}>Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criar posts para Instagram"
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Row: Client + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cliente</label>
              <select value={client} onChange={(e) => setClient(e.target.value)} className={selectClass}>
                <option value="">Selecionar cliente</option>
                {clients.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="Novo cliente..."
                  className={inputClass + ' flex-1'}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddClient(); } }}
                />
                <button type="button" onClick={handleAddClient} className="px-3 py-2 bg-[#A0845C] text-white text-xs font-semibold rounded-lg hover:bg-[#C4A882] transition-colors whitespace-nowrap">
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} className={selectClass}>
                {(Object.entries(CATEGORY_LABELS) as [TaskCategory, string][]).map(([val, lab]) => (
                  <option key={val} value={val}>{lab}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Status + Priority + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectClass}>
                {(Object.entries(STATUS_LABELS) as [TaskStatus, string][]).map(([val, lab]) => (
                  <option key={val} value={val}>{lab}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prioridade</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={selectClass}>
                {(Object.entries(PRIORITY_LABELS) as [TaskPriority, string][]).map(([val, lab]) => (
                  <option key={val} value={val}>{lab}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prazo</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionais..."
              rows={2}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Links Section Toggle */}
          <button
            type="button"
            onClick={() => setShowLinks(!showLinks)}
            className="text-sm font-semibold text-[#A0845C] hover:text-[#C4A882] transition-colors"
          >
            {showLinks ? '▾ Ocultar Links e Anexos' : '▸ Adicionar Links e Anexos'}
          </button>

          {showLinks && (
            <div className="space-y-3 p-4 bg-white rounded-xl border border-[#E8DDD3]">
              <div>
                <label className={labelClass}>Briefing (URL)</label>
                <input
                  type="url"
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Vídeo Pronto (URL)</label>
                <input
                  type="url"
                  value={finalVideo}
                  onChange={(e) => setFinalVideo(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fotos Editadas (URL)</label>
                <input
                  type="url"
                  value={editedPhotos}
                  onChange={(e) => setEditedPhotos(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* References */}
              <div>
                <label className={labelClass}>Referências</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputClass + ' flex-1'}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addReference(); } }}
                  />
                  <button type="button" onClick={addReference} className="px-3 py-2 bg-[#A0845C] text-white text-xs font-semibold rounded-lg hover:bg-[#C4A882] transition-colors">
                    +
                  </button>
                </div>
                {references.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {references.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#8B7355]">
                        <a href={url} target="_blank" rel="noopener" className="truncate hover:text-[#A0845C] flex-1">{url}</a>
                        <button type="button" onClick={() => setReferences((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other links */}
              <div>
                <label className={labelClass}>Outros Links</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={otherUrl}
                    onChange={(e) => setOtherUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputClass + ' flex-1'}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOtherLink(); } }}
                  />
                  <button type="button" onClick={addOtherLink} className="px-3 py-2 bg-[#A0845C] text-white text-xs font-semibold rounded-lg hover:bg-[#C4A882] transition-colors">
                    +
                  </button>
                </div>
                {otherLinks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {otherLinks.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#8B7355]">
                        <a href={url} target="_blank" rel="noopener" className="truncate hover:text-[#A0845C] flex-1">{url}</a>
                        <button type="button" onClick={() => setOtherLinks((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-[#8B7355] hover:bg-[#E8DDD3] rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold bg-[#A0845C] text-white rounded-lg hover:bg-[#C4A882] transition-colors shadow-sm">
              {task ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
