
import React, { useState } from 'react';

interface MatchFormProps {
  onSimulate: (home: string, away: string, date: string) => void;
  isLoading: boolean;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSimulate, isLoading }) => {
  const [home, setHome] = useState('Galatasaray');
  const [away, setAway] = useState('Fenerbahçe');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (home && away && date) {
      onSimulate(home, away, date);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl mx-auto">
      <h2 className="text-3xl font-oswald mb-8 text-center uppercase tracking-wider text-green-400">Yeni Simülasyon Başlat</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Ev Sahibi Takım</label>
          <input
            type="text"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Örn: Real Madrid"
          />
        </div>
        <div className="flex items-center justify-center pt-6">
          <span className="text-4xl font-oswald text-gray-500 italic">VS</span>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Deplasman Takımı</label>
          <input
            type="text"
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Örn: Manchester City"
          />
        </div>
        <div className="md:col-span-3 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Maç Tarihi</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`md:col-span-3 py-4 rounded-lg font-bold text-xl uppercase tracking-widest transition-all ${
            isLoading 
            ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
            : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Haberler Analiz Ediliyor...
            </div>
          ) : 'Simülasyonu Başlat'}
        </button>
      </form>
    </div>
  );
};

export default MatchForm;
