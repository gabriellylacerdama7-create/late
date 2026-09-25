'use client';

import { useState, useRef } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Plus, Trash2, Download, Upload, AlertTriangle, Users } from 'lucide-react';

export default function SettingsPage() {
  const { clients, addClient, removeClient, exportData, importData, clearAll } = useTaskContext();
  const [newClientName, setNewClientName] = useState('');
  const [importMessage, setImportMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName.trim()) {
      addClient(newClientName.trim());
      setNewClientName('');
    }
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `taskflow-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        setImportMessage({ type: 'success', text: 'Dados importados com sucesso!' });
        setTimeout(() => setImportMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setImportMessage({ type: 'error', text: 'Erro ao importar dados. Arquivo inválido.' });
        setTimeout(() => setImportMessage({ type: '', text: '' }), 3000);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza? Esta ação é irreversível. Todos os dados serão apagados.')) {
      clearAll();
      alert('Todos os dados foram apagados.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#2C1810]">Configurações</h1>
        <p className="text-[#8B7355] mt-1">Gerencie seus clientes e dados do aplicativo</p>
      </div>

      {/* Clientes Section */}
      <section className="bg-white rounded-xl border border-[#E8DDD3] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-[#A0845C]" size={24} />
          <h2 className="text-xl font-bold text-[#2C1810]">Clientes</h2>
        </div>
        
        <div className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-[#8B7355] text-sm">Nenhum cliente cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {clients.map(client => (
                <li key={client} className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-lg border border-[#E8DDD3]">
                  <span className="font-medium text-[#2C1810]">{client}</span>
                  <button 
                    onClick={() => removeClient(client)}
                    className="text-[#8B7355] hover:text-red-500 transition-colors p-1"
                    aria-label="Remover cliente"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddClient} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Novo cliente..."
              className="flex-1 bg-[#FAF7F2] border border-[#E8DDD3] rounded-lg px-4 py-2 text-[#2C1810] focus:outline-none focus:border-[#A0845C] placeholder-[#8B7355]"
            />
            <button 
              type="submit"
              disabled={!newClientName.trim()}
              className="bg-[#A0845C] hover:bg-[#C4A882] disabled:opacity-50 disabled:hover:bg-[#A0845C] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Dados Section */}
      <section className="bg-white rounded-xl border border-[#E8DDD3] p-6 mt-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#2C1810] mb-4">Dados</h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Exportar */}
          <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E8DDD3] flex flex-col items-start">
            <h3 className="font-bold text-[#2C1810] mb-2 flex items-center gap-2">
              <Download size={18} className="text-[#A0845C]" />
              Exportar Dados
            </h3>
            <p className="text-sm text-[#8B7355] mb-4 flex-1">
              Faça backup dos seus dados em formato JSON
            </p>
            <button 
              onClick={handleExport}
              className="bg-[#A0845C] hover:bg-[#C4A882] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
            >
              Exportar
            </button>
          </div>

          {/* Importar */}
          <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E8DDD3] flex flex-col items-start">
            <h3 className="font-bold text-[#2C1810] mb-2 flex items-center gap-2">
              <Upload size={18} className="text-[#A0845C]" />
              Importar Dados
            </h3>
            <p className="text-sm text-[#8B7355] mb-4 flex-1">
              Restaure dados de um backup anterior
            </p>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button 
              onClick={handleImportClick}
              className="bg-white border border-[#E8DDD3] hover:border-[#A0845C] text-[#2C1810] px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
            >
              Importar
            </button>
            {importMessage.text && (
              <p className={`mt-2 text-xs font-medium ${importMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {importMessage.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Zona de Perigo Section */}
      <section className="bg-white rounded-xl border border-red-200 p-6 mt-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-red-600">Limpar Todos os Dados</h2>
        </div>
        <p className="text-[#8B7355] mb-4 text-sm">
          Esta ação é irreversível. Todos os dados serão apagados.
        </p>
        <button 
          onClick={handleClearAll}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Apagar Tudo
        </button>
      </section>
    </div>
  );
}
