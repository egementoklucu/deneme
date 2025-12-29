
import React from 'react';
import { SimulationResult, MatchEvent } from '../types';

interface SimulationViewProps {
  result: SimulationResult;
}

const EventIcon = ({ type }: { type: MatchEvent['type'] }) => {
  switch (type) {
    case 'goal': return <span className="text-2xl">⚽</span>;
    case 'yellow_card': return <div className="w-4 h-6 bg-yellow-400 rounded-sm"></div>;
    case 'red_card': return <div className="w-4 h-6 bg-red-600 rounded-sm"></div>;
    case 'var': return <div className="bg-blue-600 px-1 text-[10px] font-bold rounded">VAR</div>;
    case 'substitution': return <span className="text-xl">🔄</span>;
    default: return <span className="text-xl">📢</span>;
  }
};

const SimulationView: React.FC<SimulationViewProps> = ({ result }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Scoreboard Header */}
      <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-gray-500">
          AI İşlem Süresi: {result.simulationProcessTimeMs}ms
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center flex-1">
            <h3 className="text-4xl font-oswald uppercase mb-2 text-green-400">{result.homeTeam}</h3>
            <div className="flex flex-wrap justify-center gap-1">
               {result.timeline.filter(e => e.type === 'goal' && e.team === 'home').map((g, i) => (
                 <span key={i} className="text-xs text-gray-400">{g.player} ({g.minute}')</span>
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-gray-900 px-10 py-4 rounded-2xl border border-green-900/50">
            <span className="text-7xl font-oswald leading-none">{result.homeScore}</span>
            <span className="text-3xl text-gray-600 font-oswald">-</span>
            <span className="text-7xl font-oswald leading-none">{result.awayScore}</span>
          </div>

          <div className="text-center flex-1">
            <h3 className="text-4xl font-oswald uppercase mb-2 text-green-400">{result.awayTeam}</h3>
            <div className="flex flex-wrap justify-center gap-1">
               {result.timeline.filter(e => e.type === 'goal' && e.team === 'away').map((g, i) => (
                 <span key={i} className="text-xs text-gray-400">{g.player} ({g.minute}')</span>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Summary & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h4 className="text-xl font-oswald mb-4 uppercase text-gray-400 border-b border-gray-700 pb-2">Maç Analizi</h4>
            <p className="text-gray-300 leading-relaxed italic">{result.summary}</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h4 className="text-xl font-oswald mb-6 uppercase text-gray-400">Maç İstatistikleri</h4>
            <div className="space-y-6">
              {[
                { label: 'Topla Oynama', values: result.stats.possession, suffix: '%' },
                { label: 'Toplam Şut', values: result.stats.shots },
                { label: 'İsabetli Şut', values: result.stats.shotsOnTarget },
                { label: 'Korner', values: result.stats.corners },
                { label: 'Faul', values: result.stats.fouls },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{stat.values[0]}{stat.suffix || ''}</span>
                    <span className="uppercase text-gray-500 tracking-tighter">{stat.label}</span>
                    <span>{stat.values[1]}{stat.suffix || ''}</span>
                  </div>
                  <div className="h-2 bg-gray-900 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-1000" 
                      style={{ width: `${(stat.values[0] / (stat.values[0] + stat.values[1])) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-gray-600 h-full transition-all duration-1000" 
                      style={{ width: `${(stat.values[1] / (stat.values[0] + stat.values[1])) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lineups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LineupCard title={result.homeTeam} lineup={result.homeLineup} />
            <LineupCard title={result.awayTeam} lineup={result.awayLineup} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-700 p-6 h-fit max-h-[1200px] overflow-y-auto">
          <h4 className="text-xl font-oswald mb-8 uppercase text-gray-400 sticky top-0 bg-gray-900/90 py-2 z-10">Canlı Anlatım</h4>
          <div className="relative border-l-2 border-gray-700 ml-4 space-y-8">
            {result.timeline.sort((a,b) => a.minute - b.minute).map((event, idx) => (
              <div key={idx} className="relative pl-8 group">
                <div className="absolute -left-[11px] top-0 bg-gray-900 p-1 rounded-full border-2 border-gray-700 group-hover:border-green-500 transition-colors">
                  <EventIcon type={event.type} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-oswald text-xl text-green-400">
                      {event.minute}{event.extraMinute ? `+${event.extraMinute}` : ''}'
                    </span>
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      event.team === 'home' ? 'bg-green-900 text-green-200' : 
                      event.team === 'away' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {event.team === 'home' ? result.homeTeam : event.team === 'away' ? result.awayTeam : 'MAÇ'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {event.player && <strong className="text-white mr-1">{event.player}:</strong>}
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-0 bg-gray-900 p-1 rounded-full border-2 border-gray-700">🏁</div>
              <div className="font-oswald text-xl text-gray-500 uppercase">Maç Sonucu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LineupCard = ({ title, lineup }: { title: string, lineup: any }) => (
  <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h5 className="font-oswald text-lg text-gray-300 uppercase">{title}</h5>
      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400 font-bold">{lineup.formation}</span>
    </div>
    <div className="space-y-2">
      {lineup.startingXI.map((player: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between text-sm group">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono w-6">{player.position}</span>
            <span className="text-gray-200">{player.name}</span>
          </div>
          <div className="flex items-center gap-3">
             {player.statusNotes && (
               <div className="relative group/note">
                 <span className="cursor-help text-amber-500">⚠️</span>
                 <div className="absolute bottom-full right-0 mb-2 w-48 bg-black p-2 text-[10px] rounded hidden group-hover/note:block z-50 shadow-xl border border-gray-700">
                   {player.statusNotes}
                 </div>
               </div>
             )}
            <span className={`font-mono text-[10px] ${player.rating >= 8 ? 'text-green-400' : 'text-gray-500'}`}>{player.rating}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SimulationView;
