
import React, { useState } from 'react';
import MatchForm from './components/MatchForm';
import SimulationView from './components/SimulationView';
import { simulateMatch } from './services/geminiService';
import { SimulationResult } from './types';

type ActiveTab = 'simulator' | 'about' | 'api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (home: string, away: string, date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateMatch(home, away, date);
      setResult(data);
      setActiveTab('simulator');
    } catch (err) {
      console.error(err);
      setError("Maç simülasyonu sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
    } else {
      window.open('https://ai.google.dev/gemini-api/docs/api-key', '_blank');
    }
  };

  return (
    <div className="min-h-screen grass-bg selection:bg-green-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => { setActiveTab('simulator'); setResult(null); }}
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-oswald text-2xl rotate-3 shadow-[0_0_15px_rgba(22,163,74,0.5)]">AI</div>
            <h1 className="text-2xl font-oswald tracking-tighter uppercase italic">Futbol Simülatörü <span className="text-green-500">PRO</span></h1>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`hover:text-green-500 transition-colors ${activeTab === 'about' ? 'text-white border-b-2 border-green-500' : ''}`}
            >
              Hakkında
            </button>
            <button 
              onClick={() => setActiveTab('api')} 
              className={`hover:text-green-500 transition-colors ${activeTab === 'api' ? 'text-white border-b-2 border-green-500' : ''}`}
            >
              API Entegrasyonu
            </button>
            <button 
              onClick={() => setActiveTab('simulator')} 
              className={`hover:text-green-500 transition-colors ${activeTab === 'simulator' ? 'text-white border-b-2 border-green-500' : ''}`}
            >
              Simülatör
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'simulator' && (
          <>
            {!result && !loading && (
              <div className="mt-10 animate-fade-in">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-6xl font-oswald uppercase tracking-tighter">Geleceğin Skorunu <span className="text-green-500">Yapay Zeka</span> Yazsın</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Google Search destekli ajanlarımız oyuncu sakatlıklarını, disiplin durumlarını ve hatta sosyal medya modlarını analiz eder. Saniyeler içinde dakika dakika simülasyonu başlatın.
                  </p>
                </div>
                <MatchForm onSimulate={handleSimulate} isLoading={loading} />
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-32 space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-green-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-4xl animate-bounce">⚽</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-oswald uppercase text-green-400 animate-pulse">Veriler Toplanıyor</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto italic">
                    Sakatlık raporları, sosyal medya paylaşımları ve taktiksel haberler taranıyor...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-8">
                 <div className="flex justify-between items-center mb-8">
                   <button 
                    onClick={() => setResult(null)}
                    className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"
                   >
                     ← Yeni Simülasyon
                   </button>
                 </div>
                 <SimulationView result={result} />
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-gray-800/50 p-10 rounded-3xl border border-gray-700 animate-fade-in">
            <h2 className="text-4xl font-oswald uppercase mb-6 text-green-400">Proje Hakkında</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Futbol Simülatörü AI, geleneksel istatistiksel modellerin ötesine geçerek futbol dünyasındaki 
                <strong> anlık gelişmeleri</strong> analiz eden bir yapay zeka platformudur.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h4 className="font-bold text-white mb-2">Haber Analizi</h4>
                  <p className="text-sm">Maç günündeki sakatlık haberleri, antrenman raporları ve teknik direktör açıklamaları Google Search aracılığıyla taranır.</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h4 className="font-bold text-white mb-2">Psikolojik Faktörler</h4>
                  <p className="text-sm">Sosyal medya hareketliliği, oyuncuların moral durumu ve disiplin cezaları kadro seçimlerini ve performansı doğrudan etkiler.</p>
                </div>
              </div>
              <p>
                Gemini 3 Flash modelinin akıl yürütme yetenekleri sayesinde, her maç binlerce veri noktası işlenerek dakika dakika, 
                gerçekçi bir senaryo eşliğinde simüle edilir.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="max-w-4xl mx-auto bg-gray-800/50 p-10 rounded-3xl border border-gray-700 animate-fade-in">
            <h2 className="text-4xl font-oswald uppercase mb-6 text-green-400">Teknoloji & API</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Gemini 3 Flash API</h4>
                <p className="text-gray-400 text-sm">Uygulama, karmaşık futbol verilerini işlemek ve gerçek zamanlı haber taraması yapmak için Google'ın en güncel LLM teknolojisini kullanır.</p>
              </div>
              
              <div className="p-6 bg-black/40 rounded-2xl border border-green-900/30">
                <h4 className="font-oswald uppercase text-xl mb-4 text-green-500">Geliştirici Erişimi</h4>
                <p className="text-gray-300 mb-6 italic text-sm">
                  Kendi projenizde bu simülatörü kullanmak veya modelleri özelleştirmek için Google AI Studio üzerinden bir API anahtarı almanız gerekmektedir.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleOpenKeySelector}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                  >
                    Google AI Studio'yu Aç
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-600 hover:border-gray-400 text-gray-300 font-bold py-3 rounded-xl text-center transition-all"
                  >
                    Faturalandırma Bilgisi
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">⚛️</div>
                  <div className="text-xs font-bold text-gray-500">React 19</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-xs font-bold text-gray-500">Tailwind</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-xs font-bold text-gray-500">Google Search</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-xs font-bold text-gray-500">GenAI SDK</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-10 bg-red-900/20 border border-red-500/50 p-6 rounded-2xl text-center">
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-4 text-xs font-bold uppercase underline text-red-400 hover:text-red-300"
            >
              Kapat
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 AI Football Predictor. Tüm veriler yapay zeka tarafından tahmin amaçlı üretilmiştir.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
