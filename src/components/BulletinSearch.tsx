import React, { useState } from 'react';
import { SCHOOL_INFO } from '../config/school';

export const BulletinSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [student, setStudent] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    setStudent(null);

    try {
      const res = await fetch('/notes.json');
      if (!res.ok) throw new Error("Fichier introuvable");
      const data = await res.json();

      const searchTerm = query.toLowerCase().trim();
      const found = data.find((s: any) =>
        s.matricule.toLowerCase().includes(searchTerm) ||
        s.nom.toLowerCase().includes(searchTerm)
      );

      if (found) {
        setStudent(found);
      } else {
        setError(`Aucun élève trouvé pour "${query}". Vérifiez le matricule ou l'orthographe.`);
      }
    } catch (err) {
      setError("Fichier notes.json introuvable.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 CARTES DES PORTAILS NUMÉRIQUES */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540]">
            <span className="material-symbols-outlined text-xl">domain</span>
          </div>
          <h3 className="font-bold text-sm text-[#0a2540]">Site de la DESPS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Portail officiel de la Direction des Établissements Privés Scolaires.</p>
          <a href="https://mena-desps.org/" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">
            Visiter le site →
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-[#f59e0b]">
            <span className="material-symbols-outlined text-xl">calculate</span>
          </div>
          <h3 className="font-bold text-sm text-[#0a2540]">Moyenne d'Orientation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Consultez vos notes d'orientation BEPC sur le serveur officiel DOB.</p>
          <a href="https://bourses.mendob.ci/index.php?adr=consultnotesbepc.inc" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#f59e0b] flex items-center gap-1 hover:underline">
            Calculer ma moyenne →
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-[#0b3c5d]/10 rounded-xl flex items-center justify-center text-[#0b3c5d]">
            <span className="material-symbols-outlined text-xl">engineering</span>
          </div>
          <h3 className="font-bold text-sm text-[#0a2540]">Enseignement Technique</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Plateforme ERSYS-CI dédiée aux informations et diplômes techniques.</p>
          <a href="https://www.ersys-ci.net/" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0b3c5d] flex items-center gap-1 hover:underline">
            Accéder à ERSYS-CI →
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#047857]">
            <span className="material-symbols-outlined text-xl">account_balance</span>
          </div>
          <h3 className="font-bold text-sm text-[#0a2540]">Portail DRENA 3</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Site officiel de la Direction Régionale de l'Éducation Nationale Abidjan 3.</p>
          <a href={SCHOOL_INFO.drenaUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#047857] flex items-center gap-1 hover:underline">
            Accéder à la DRENA 3 →
          </a>
        </div>
      </div>

      {/* RECHERCHE DE BULLETIN NUMÉRIQUE */}
      <div className="bg-[#0a2540] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/10 pb-6 text-center md:text-left">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f59e0b] shrink-0">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
              3ème TRIMESTRE 2025-2026
            </span>
            <h4 className="font-bold text-base sm:text-lg mt-1 text-white">Consulter le Bulletin Numérique</h4>
            <p className="text-xs text-slate-300">Entrez le matricule ou le nom de l'élève pour générer le récapitulatif.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ex: 25170040G ou BABOYEHE CHRIST..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-[#f59e0b] placeholder-slate-400"
          />
          <button type="submit" disabled={searching} className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
            {searching ? <span className="material-symbols-outlined animate-spin text-base">sync</span> : <span className="material-symbols-outlined text-base">search</span>}
            Rechercher
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2 border border-red-500/30">
            <span className="material-symbols-outlined text-base">error</span> {error}
          </div>
        )}

        {student && (
          <div className="mt-6 bg-white rounded-2xl p-6 sm:p-8 text-slate-800 shadow-2xl relative overflow-hidden">
            <div className="text-center border-b-2 border-slate-200 pb-4 mb-6 space-y-1">
              <h3 className="font-extrabold text-lg text-[#0a2540]">{SCHOOL_INFO.shortName}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bulletin Récapitulatif - 3ème Trimestre</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Nom & Prénoms</p>
                <p className="font-bold text-xs sm:text-sm text-[#0a2540]">{student.nom}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Matricule</p>
                <p className="font-bold text-xs sm:text-sm text-[#0a2540]">{student.matricule}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Classe</p>
                <p className="font-bold text-xs sm:text-sm text-[#047857]">{student.classe}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0a2540] text-white">
                  <tr>
                    <th className="p-3 font-bold">Matière</th>
                    <th className="p-3 font-bold text-center w-24">Note / 20</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.francais && student.francais.globale && (
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-[#0a2540]">Français (Moyenne Globale)</td>
                      <td className={`p-3 font-bold text-center ${Number(student.francais.globale) >= 10 ? 'text-[#047857]' : 'text-red-600'}`}>
                        {student.francais.globale}
                      </td>
                    </tr>
                  )}

                  {student.notes && Object.entries(student.notes).map(([matiere, note]) => (
                    <tr key={matiere} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{matiere}</td>
                      <td className={`p-3 font-bold text-center ${Number(note) >= 10 ? 'text-[#047857]' : 'text-red-600'}`}>
                        {note as React.ReactNode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-[#047857] text-white rounded-full flex items-center justify-center font-black text-lg shadow-md border-4 border-white">
                  {student.moyenne}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#047857] uppercase tracking-wider">Moyenne Trimestrielle</p>
                  <p className="text-xs font-extrabold text-[#0a2540]">
                    Rang : {student.rang !== 'N/A' && student.rang !== 'nan' ? student.rang : 'Non classé'}
                  </p>
                </div>
              </div>
              <button onClick={() => window.print()} className="w-full sm:w-auto px-5 py-2.5 bg-[#0a2540] hover:bg-[#061726] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer">
                <span className="material-symbols-outlined text-base">print</span> Imprimer le bulletin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};