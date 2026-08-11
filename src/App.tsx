import React, { useState } from 'react';

// ============================================================================
// CONFIGURATION CENTRALISÉE DES MÉDIAS (PHOTOS & LOGO)
// ============================================================================
const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600",
  facadeCard: "/facade.jpg",
  generalImage: "/enseignement-general.jpg",
  techniqueImage: "/technique.jpg",
  actu1: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600",
  actu2: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
  actu3: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
};

// ============================================================================
// INFORMATIONS OFFICIELLES DU COLLÈGE
// ============================================================================
const SCHOOL_INFO = {
  fullNamePart1: "Collège privé technique Jean Baptiste",
  fullNamePart2: "de la Salle 2",
  shortName: "J.B. de La Salle 2",
  address: "Attécoubé Santé 3, 23 BP 519 Abidjan 23",
  phone: "07 48 627 869",
  phoneFormatted: "+2250748627869",
  whatsappUrl: "https://wa.me/2250748627869?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20le%20Coll%C3%A8ge%20JBS2",
  email: "college.jbs2@gmail.com",
  mapsUrl: "https://www.google.com/maps?q=5.340777,-4.052753",
  facebookUrl: "https://facebook.com",
  drenaUrl: "https://drenaabidjan3.ci/", // Correction: URL officielle de la DRENA Abidjan 3
};

// ============================================================================
// FONCTION DE CALCUL DYNAMIQUE DES FRAIS
// ============================================================================
const calculateSchoolFees = (classe: string, statut: string) => {
  const isAffecte = statut === 'affecte';
  const isCollege = ['6ème', '5ème', '4ème', '3ème'].some(c => classe.includes(c));
  const isLyceeGeneral = ['2nde A', '2nde D', '1ère A', '1ère D', 'Terminale A', 'Terminale D'].some(c => classe.includes(c));

  if (isAffecte) {
    return {
      inscription: 10000,
      scolarite: 15000,
      total: 25000,
      note: "Prise en charge par l'État de Côte d'Ivoire (Seuls les frais annexes d'inscription s'appliquent)."
    };
  } else {
    if (isCollege) {
      return {
        inscription: 25000,
        scolarite: 95000,
        total: 120000,
        note: "Tarif Inscription Libre - Premier Cycle Général."
      };
    } else if (isLyceeGeneral) {
      return {
        inscription: 30000,
        scolarite: 110000,
        total: 140000,
        note: "Tarif Inscription Libre - Second Cycle Général (Séries A/D)."
      };
    } else {
      return {
        inscription: 35000,
        scolarite: 125000,
        total: 160000,
        note: "Tarif Inscription Libre - Pôle Technique Tertiaire (G1, G2, AB)."
      };
    }
  }
};

// ============================================================================
// COMPOSANT: RECHERCHE DE BULLETIN NUMÉRIQUE (Lit le notes.json)
// ============================================================================
function BulletinNumeriqueSearch() {
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
        setError(`Aucun élève trouvé pour "${query}". Vérifiez le matricule ou l'orthographe du nom.`);
      }
    } catch (err) {
      setError("Impossible de charger les notes. Assurez-vous que les notes ont été exportées (fichier notes.json manquant).");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-[#0a2540] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-white/10 mt-8">
      <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/10 pb-6 text-center md:text-left">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f59e0b] shrink-0">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <div>
          <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
            3ème TRIMESTRE 2025-2026
          </span>
          <h4 className="font-bold text-lg mt-1 text-white">Consulter le Bulletin Numérique</h4>
          <p className="text-xs text-slate-300">Entrez le matricule ou le nom de l'élève pour générer le récapitulatif des moyennes.</p>
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
        <button type="submit" disabled={searching} className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
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
            <h3 className="font-extrabold text-xl text-[#0a2540]">{SCHOOL_INFO.shortName}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bulletin Récapitulatif - 3ème Trimestre</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Nom & Prénoms</p>
              <p className="font-bold text-sm text-[#0a2540]">{student.nom}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Matricule</p>
              <p className="font-bold text-sm text-[#0a2540]">{student.matricule}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Classe</p>
              <p className="font-bold text-sm text-[#047857]">{student.classe}</p>
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
                    <td className={`p-3 font-bold text-center ${Number(note) >= 10 ? 'text-[#047857]' : (Number(note) < 10 ? 'text-red-600' : 'text-slate-400')}`}>
                      {note as React.ReactNode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-[#047857] text-white rounded-full flex items-center justify-center font-black text-xl shadow-md border-4 border-white">
                {student.moyenne}
              </div>
              <div>
                <p className="text-xs font-bold text-[#047857] uppercase tracking-wider">Moyenne Trimestrielle</p>
                <p className="text-sm font-extrabold text-[#0a2540]">
                  Rang : {student.rang !== 'N/A' && student.rang !== 'nan' ? student.rang : 'Non classé'}
                </p>
              </div>
            </div>
            <button onClick={() => window.print()} className="w-full sm:w-auto px-6 py-3 bg-[#0a2540] hover:bg-[#061726] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
              <span className="material-symbols-outlined text-base">print</span> Imprimer le bulletin```tsx
import React, { useState } from 'react';

// ============================================================================
// CONFIGURATION CENTRALISÉE DES MÉDIAS (PHOTOS & LOGO)
// ============================================================================
const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "[https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600](https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600)",
  facadeCard: "/facade.jpg",
  generalImage: "/enseignement-general.jpg",
  techniqueImage: "/technique.jpg",
  actu1: "[https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600)",
  actu2: "[https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600)",
  actu3: "[https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600](https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600)",
};

// ============================================================================
// INFORMATIONS OFFICIELLES DU COLLÈGE
// ============================================================================
const SCHOOL_INFO = {
  fullNamePart1: "Collège privé technique Jean Baptiste",
  fullNamePart2: "de la Salle 2",
  shortName: "J.B. de La Salle 2",
  address: "Attécoubé Santé 3, 23 BP 519 Abidjan 23",
  phone: "07 48 627 869",
  phoneFormatted: "+2250748627869",
  whatsappUrl: "[https://wa.me/2250748627869?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20le%20Coll%C3%A8ge%20JBS2](https://wa.me/2250748627869?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20le%20Coll%C3%A8ge%20JBS2)",
  email: "college.jbs2@gmail.com",
  mapsUrl: "[https://www.google.com/maps?q=5.340777,-4.052753](https://www.google.com/maps?q=5.340777,-4.052753)",
  facebookUrl: "[https://facebook.com](https://facebook.com)",
  drenaUrl: "[https://drenaabidjan3.ci/](https://drenaabidjan3.ci/)", // URL officielle de la DRENA Abidjan 3
};

// ============================================================================
// FONCTION DE CALCUL DYNAMIQUE DES FRAIS
// ============================================================================
const calculateSchoolFees = (classe: string, statut: string) => {
  const isAffecte = statut === 'affecte';
  const isCollege = ['6ème', '5ème', '4ème', '3ème'].some(c => classe.includes(c));
  const isLyceeGeneral = ['2nde A', '2nde D', '1ère A', '1ère D', 'Terminale A', 'Terminale D'].some(c => classe.includes(c));

  if (isAffecte) {
    return {
      inscription: 10000,
      scolarite: 15000,
      total: 25000,
      note: "Prise en charge par l'État de Côte d'Ivoire (Seuls les frais annexes d'inscription s'appliquent)."
    };
  } else {
    if (isCollege) {
      return {
        inscription: 25000,
        scolarite: 95000,
        total: 120000,
        note: "Tarif Inscription Libre - Premier Cycle Général."
      };
    } else if (isLyceeGeneral) {
      return {
        inscription: 30000,
        scolarite: 110000,
        total: 140000,
        note: "Tarif Inscription Libre - Second Cycle Général (Séries A/D)."
      };
    } else {
      return {
        inscription: 35000,
        scolarite: 125000,
        total: 160000,
        note: "Tarif Inscription Libre - Pôle Technique Tertiaire (G1, G2, AB)."
      };
    }
  }
};

// ============================================================================
// COMPOSANT: RECHERCHE DE BULLETIN NUMÉRIQUE (Lit le notes.json)
// ============================================================================
function BulletinNumeriqueSearch() {
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
        setError(`Aucun élève trouvé pour "${query}". Vérifiez le matricule ou l'orthographe du nom.`);
      }
    } catch (err) {
      setError("Impossible de charger les notes. Assurez-vous que les notes ont été exportées (fichier notes.json manquant).");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-[#0a2540] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-white/10 mt-8">
      <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/10 pb-6 text-center md:text-left">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f59e0b] shrink-0">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <div>
          <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
            3ème TRIMESTRE 2025-2026
          </span>
          <h4 className="font-bold text-lg mt-1 text-white">Consulter le Bulletin Numérique</h4>
          <p className="text-xs text-slate-300">Entrez le matricule ou le nom de l'élève pour générer le récapitulatif des moyennes.</p>
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
        <button type="submit" disabled={searching} className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          {searching ? <span className="material-symbols-outlined animate-spin text-base">sync</span> : <span className="material-symbols-outlined text-base">search</span>}
          Rechercher
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2 border border-red-500/30">
          <span className="material-symbols-outlined text-base"></span>