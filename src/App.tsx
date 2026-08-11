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
  actu1: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600", // Calendrier / Dates
  actu2: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600", // Vie scolaire
  actu3: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600", // Festif & Culturel
};

// ============================================================================
// INFORMATIONS OFFICIELLES DU COLLÈGE
// ============================================================================
const SCHOOL_INFO = {
  name: "Collège Privé Technique Jean Baptiste de La Salle 2",
  shortName: "J.B. de La Salle 2",
  address: "Attécoubé Santé 3, 23 BP 519 Abidjan 23",
  phone: "07 48 627 869",
  phoneFormatted: "+225 07 48 62 78 69",
  email: "college.jbs2@gmail.com",
  mapsUrl: "https://www.google.com/maps?q=5.340777,-4.052753",
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
                  <>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-[#0a2540]">Français (Moyenne Globale)</td>
                      <td className={`p-3 font-bold text-center ${Number(student.francais.globale) >= 10 ? 'text-[#047857]' : 'text-red-600'}`}>
                        {student.francais.globale}
                      </td>
                    </tr>
                  </>
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
              <span className="material-symbols-outlined text-base">print</span> Imprimer le bulletin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================
export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<'general' | 'technique' | null>(null);
  const [actuModal, setActuModal] = useState<'dates' | 'viescolaire' | 'festif' | null>(null);
  const [inscriptionModal, setInscriptionModal] = useState(false);
  const [inscriptionStep, setInscriptionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'eleves' | 'parents' | 'profs'>('eleves');

  // FORMULAIRE DE PRÉ-INSCRIPTION / RÉSERVATION DE PLACE
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    classe: '6ème — Enseignement Général',
    statut: 'affecte',
    etablissementOrigine: '',
    mga: '',
    filiere: 'general',
  });

  const [messages, setMessages] = useState([
    { id: '1', sender: 'assistant', text: `Bonjour ! Je suis l'Assistant Virtuel du Collège J.B. de La Salle 2. Comment puis-je vous aider aujourd'hui ? Vous pouvez aussi contacter le secrétariat au ${SCHOOL_INFO.phone}.` }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Merci pour votre message ! Le secrétariat d'Attécoubé Santé 3 reste joignable au ${SCHOOL_INFO.phone} ou par email à ${SCHOOL_INFO.email}.`
      }]);
    }, 600);
  };

  const openInscriptionWithFiliere = (filiere: 'general' | 'technique') => {
    setFormData(prev => ({ 
      ...prev, 
      filiere, 
      classe: filiere === 'general' ? '6ème — Enseignement Général' : '2nde G1/G2/AB'
    }));
    setInscriptionStep(1);
    setInscriptionModal(true);
  };

  const handleReservationSubmit = async () => {
    setIsSubmitting(true);

    const reservationPayload = {
      matricule_eleve: formData.matricule,
      nom: formData.nom,
      prenom: formData.prenom,
      classe_sollicitee: formData.classe,
      statut_affecte: formData.statut === 'affecte',
      etablissement_origine: formData.etablissementOrigine,
      mga: parseFloat(formData.mga) || 0,
      filiere: formData.filiere,
      frais_estimes: calculateSchoolFees(formData.classe, formData.statut),
      created_at: new Date().toISOString()
    };

    console.log("📥 payload prêt pour envoi au backend:", reservationPayload);

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setInscriptionStep(3);
  };

  const currentFees = calculateSchoolFees(formData.classe, formData.statut);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 lg:px-10 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 min-w-0">
            <img src={MEDIA_CONFIG.logo} alt="Logo JBS2" className="h-9 sm:h-11 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm sm:text-lg text-[#0a2540] tracking-tight whitespace-nowrap truncate">
                  {SCHOOL_INFO.shortName}
                </span>
                <span className="hidden sm:inline-block bg-[#0b3c5d] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                  DRENA 3
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Attécoubé Santé 3 • Abidjan</p>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-7 text-xs font-bold text-slate-700">
            <a href="#accueil" className="text-[#0a2540] border-b-2 border-[#0a2540] pb-1">Accueil</a>
            <a href="#formations" className="hover:text-[#0a2540] transition-colors pb-1">Formations</a>
            <a href="#portails" className="hover:text-[#0a2540] transition-colors pb-1">Portails Numériques</a>
            <a href="#actualites" className="hover:text-[#0a2540] transition-colors pb-1">Actualités & Examens</a>
            <a href="#contact" className="hover:text-[#0a2540] transition-colors pb-1">Nous Trouver</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button 
              onClick={() => setAiOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">smart_toy</span>
              <span className="hidden sm:inline">Assistant IA</span>
            </button>

            <button 
              onClick={() => openInscriptionWithFiliere('general')}
              className="flex items-center gap-1 px-2.5 sm:px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">how_to_reg</span>
              <span>Réservation<span className="hidden sm:inline"> en Ligne</span></span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="accueil" className="relative bg-[#0a2540] text-white overflow-hidden py-12 lg:py-20 px-4 lg:px-12">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${MEDIA_CONFIG.heroBackground})` }}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f59e0b] text-[#0a2540] text-xs font-extrabold uppercase rounded-full tracking-wide shadow-sm">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              ÉTABLISSEMENT D'EXCELLENCE • DRENA 3
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              L'Excellence Éducative et Technique au Cœur d'Attécoubé
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Le <em>{SCHOOL_INFO.name}</em> forme les leaders de demain à travers un enseignement général rigoureux et un pôle technique tertiaire de haut niveau au service du développement ivoirien.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => openInscriptionWithFiliere('general')}
                className="flex items-center gap-2 px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-lg">event_seat</span>
                Réserver une place en Ligne
              </button>
              <a href="#formations" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs sm:text-sm backdrop-blur-sm transition-all">
                <span className="material-symbols-outlined text-lg">explore</span>
                Visiter le Collège
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-black text-[#f59e0b]">94.8%</span>
                <p className="text-xs text-slate-300 font-medium">Réussite BEPC</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-black text-[#f59e0b]">92.3%</span>
                <p className="text-xs text-slate-300 font-medium">Réussite BAC G1/G2</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-black text-[#f59e0b]">1 450+</span>
                <p className="text-xs text-slate-300 font-medium">Élèves Enseignés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-black text-[#f59e0b]">DRENA 3</span>
                <p className="text-xs text-slate-300 font-medium">Rang d'Élite</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/20 shadow-2xl space-y-3">
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 border border-white/10">
                <img src={MEDIA_CONFIG.facadeCard} alt="Façade Collège" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#0a2540]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <span className="material-symbols-outlined text-sm text-[#f59e0b]">verified</span>
                  Façade Officielle
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <h3 className="font-bold text-base">{SCHOOL_INFO.shortName}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Attécoubé Santé 3 • Abidjan
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Cadre d'études & Sécurité</p>
                  <p className="text-[11px] text-slate-300">Enseignement Général & Tertiaire</p>
                </div>
                <a href="#formations" className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a2540] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all">
                  <span>Découvrir</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION FORMATIONS */}
      <section id="formations" className="max-w-7xl mx-auto px-4 lg:px-10 py-16 space-y-10">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Carte Enseignement Général */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden">
                <img src={MEDIA_CONFIG.generalImage} alt="Enseignement Général" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-[#f59e0b] text-[#0a2540] text-[11px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">
                  PREMIER & SECOND CYCLES
                </span>
                <div className="absolute bottom-4 left-4 text-white font-extrabold text-2xl drop-shadow-md">
                  Enseignement Général
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  De la 6ème à la Terminale (Séries A & D). Un encadrement pédagogique d'élite pour la réussite aux examens nationaux du BEPC et du BAC.
                </p>
                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <p className="flex items-center gap-2"><span className="text-[#047857] text-base">✓</span> Cycle Orientation (6ème - 3ème)</p>
                  <p className="flex items-center gap-2"><span className="text-[#047857] text-base">✓</span> Cycle Secondaire (2nde - Terminale A/D)</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <button 
                onClick={() => setDetailsModal('general')}
                className="w-full py-3 border border-[#0a2540] text-[#0a2540] hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">info</span>
                Détails du cursus
              </button>
              
              <button 
                onClick={() => openInscriptionWithFiliere('general')}
                className="w-full py-3.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-lg">event_seat</span>
                Préinscription & Réservation de Place (Général)
              </button>
            </div>
          </div>

          {/* Carte Technique Tertiaire */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden">
                <img src={MEDIA_CONFIG.techniqueImage} alt="Technique Tertiaire" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-[#047857] text-white text-[11px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">
                  PÔLE TERTIAIRE SPÉCIALISÉ
                </span>
                <div className="absolute bottom-4 left-4 text-white font-extrabold text-2xl drop-shadow-md">
                  Technique Tertiaire
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Formations professionnalisantes en G1, G2, Série AB, Comptabilité et Secrétariat. Préparez votre insertion immédiate en entreprise ou vos études supérieures.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Série G1 (Secrétariat)</div>
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Série G2 (Comptabilité)</div>
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Série AB (Économie)</div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <button 
                onClick={() => setDetailsModal('technique')}
                className="w-full py-3 border border-[#047857] text-[#047857] hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">work</span>
                Découvrir les métiers & programmes
              </button>
              
              <button 
                onClick={() => openInscriptionWithFiliere('technique')}
                className="w-full py-3.5 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-lg">event_seat</span>
                Préinscription & Réservation de Place (Technique)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PORTAILS NUMÉRIQUES */}
      <section id="portails" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="bg-[#0a2540] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
              ESPACE NUMÉRIQUE SÉCURISÉ
            </span>
            <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Portails Numériques</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Accédez directement aux plateformes gouvernementales et scolaires officielles.</p>
          </div>

          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-1 shadow-sm">
            <button 
              onClick={() => setActivePortalTab('eleves')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activePortalTab === 'eleves' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-base">school</span> Élèves
            </button>
            <button 
              onClick={() => setActivePortalTab('parents')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activePortalTab === 'parents' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-base">family_restroom</span> Parents
            </button>
            <button 
              onClick={() => setActivePortalTab('profs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activePortalTab === 'profs' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-base">person</span> Professeurs
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0a2540]">
              <span className="material-symbols-outlined text-2xl">domain</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Site de la DESPS</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Portail officiel de la Direction des Établissements Privés Scolaires de Côte d'Ivoire.</p>
            <a href="https://mena-desps.org/" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">
              Visiter le site →
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#f59e0b]">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Moyenne d'Orientation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Consultez et calculez vos notes d'orientation BEPC sur le serveur officiel DOB.</p>
            <a href="https://bourses.mendob.ci/index.php?adr=consultnotesbepc.inc" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#f59e0b] flex items-center gap-1 hover:underline">
              Calculer ma moyenne →
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#0b3c5d]/10 rounded-2xl flex items-center justify-center text-[#0b3c5d]">
              <span className="material-symbols-outlined text-2xl">engineering</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Enseignement Technique</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Plateforme ERSYS-CI dédiée aux informations et diplômes de la formation technique.</p>
            <a href="https://www.ersys-ci.net/" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0b3c5d] flex items-center gap-1 hover:underline">
              Accéder à ERSYS-CI →
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#047857]">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Clubs & Vie Sociale</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Rejoignez nos clubs sportifs, d'art oratoire, de génie en herbe et informatique.</p>
            <button className="text-xs font-bold text-[#047857] flex items-center gap-1 hover:underline">Découvrir les clubs →</button>
          </div>
        </div>

        <BulletinNumeriqueSearch />

      </section>

      {/* 5. ACTUALITÉS & ÉVÉNEMENTS ACADÉMIQUES (RESTRUCTURÉ) */}
      <section id="actualites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#f59e0b] text-[#0a2540] text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
            VIE DE L'ÉTABLISSEMENT
          </span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Actualités & Événements Académiques</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consultez les dates clés, la vie scolaire et les événements culturels du Collège J.B. de La Salle 2.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* CARTE 1 : CERCLE JAUNE - DATES IMPORTANTES DE L'ANNÉE SCOLAIRE */}
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative h-48">
                <img src={MEDIA_CONFIG.actu1} alt="Dates Importantes" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  CALENDRIER SCOLAIRE
                </span>
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">ANNÉE ACADÉMIQUE 2026-2027</span>
                <h3 className="font-bold text-base text-[#0a2540] leading-snug">
                  Dates Importantes, Découpage & Examens
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Retrouvez le calendrier officiel des trimestres, les périodes de congés scolaires, les examens et les courriers officiels du Ministère.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button 
                onClick={() => setActuModal('dates')} 
                className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a2540] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Consulter le calendrier</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* CARTE 2 : CERCLE VERT - VIE SCOLAIRE & ÉVÉNEMENTS À VENIR */}
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-400 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative h-48">
                <img src={MEDIA_CONFIG.actu2} alt="Vie Scolaire" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  VIE SCOLAIRE
                </span>
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[11px] text-[#047857] font-bold uppercase tracking-wider">ACTIVITÉS & CLUBS</span>
                <h3 className="font-bold text-base text-[#0a2540] leading-snug">
                  Vie Scolaire & Événements Pédagogiques
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Découvrez la vie des élèves, les conseils de classe, les examens blancs DRENA 3 et les activités des clubs scientifiques.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button 
                onClick={() => setActuModal('viescolaire')} 
                className="w-full py-2.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Découvrir la vie scolaire</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* CARTE 3 : CERCLE BLEU - ACTUALITÉ FESTIVE, CULTURELLE & ÉVASIVE */}
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-indigo-300 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative h-48">
                <img src={MEDIA_CONFIG.actu3} alt="Culturel et Festif" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#0b3c5d] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  CULTURE & ÉVASION
                </span>
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[11px] text-[#0b3c5d] font-bold uppercase tracking-wider">FÊTES & TRADITIONS</span>
                <h3 className="font-bold text-base text-[#0a2540] leading-snug">
                  Actualités Festives & Journées Culturelles
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Moments forts de l'établissement : Journée du Mérite, cérémonies de graduation, sorties éducatives et célébrations lasalliennes.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button 
                onClick={() => setActuModal('festif')} 
                className="w-full py-2.5 bg-[#0a2540] hover:bg-[#061726] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Voir les événements</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. NOUS TROUVER & CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#0a2540] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">LOCALISATION & CONTACT</span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Nous Trouver</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Situé dans le quartier paisible d'Attécoubé Santé 3, notre établissement offre un cadre d'études moderne, sécurisé et propice à la concentration.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Adresse Officielle</h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{SCHOOL_INFO.address}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Téléphone (Secrétariat)</h4>
                <a href={`tel:${SCHOOL_INFO.phoneFormatted}`} className="text-xs text-slate-600 mt-0.5 font-bold hover:text-[#047857] transition-colors block">
                  {SCHOOL_INFO.phone}
                </a>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Courrier Électronique</h4>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="text-xs text-slate-600 mt-0.5 font-bold hover:text-[#047857] transition-colors block">
                  {SCHOOL_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-200 rounded-3xl h-72 lg:h-80 border border-slate-300 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0a2540_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center space-y-3 z-10 max-w-sm border border-slate-100">
              <div className="w-12 h-12 bg-[#0a2540] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h4 className="font-extrabold text-[#0a2540] text-base">{SCHOOL_INFO.shortName}</h4>
                <p className="text-xs text-slate-500">Attécoubé Santé 3 (23 BP 519 Abidjan 23)</p>
              </div>
              <a href={SCHOOL_INFO.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                <span className="material-symbols-outlined text-base">map</span> Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MODALS D'ACTUALITÉS SPÉCIFIQUES (AU CLIC SUR LES 3 CARTE) */}
      {actuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActuModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* MODAL 1 : DATES IMPORTANTES DE L'ANNÉE SCOLAIRE */}
            {actuModal === 'dates' && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="w-10 h-10 bg-amber-100 text-[#f59e0b] rounded-xl flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div>
                    <span className="bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">ANNÉE ACADÉMIQUE 2026-2027</span>
                    <h3 className="font-extrabold text-lg text-[#0a2540]">Dates Importantes & Calendrier Officiel</h3>
                  </div>
                </div>

                {/* DÉCOUPAGE TRIMESTRIEL */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#0a2540] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#f59e0b]">schedule</span>
                    Découpage Trimestriel :
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="font-semibold">1er Trimestre :</span>
                      <span>Lundi 08 Septembre 2026 — Vendredi 27 Novembre 2026</span>
                    </li>
                    <li className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="font-semibold">2ème Trimestre :</span>
                      <span>Lundi 30 Novembre 2026 — Vendredi 26 Février 2027</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">3ème Trimestre :</span>
                      <span>Lundi 01 Mars 2027 — Vendredi 14 Mai 2027</span>
                    </li>
                  </ul>
                </div>

                {/* CONGÉS & VACANCES */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#0a2540] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#0a2540]">beach_access</span>
                    Congés Scolaires & Examens :
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex justify-between border-b pb-1">
                      <span>Congés de Toussaint :</span>
                      <strong className="text-slate-800">Fin Octobre 2026</strong>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span>Congés de Noël & Nouvel An :</span>
                      <strong className="text-slate-800">Décembre 2026 — Janvier 2027</strong>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span>Congés de Pâques :</span>
                      <strong className="text-slate-800">Avril 2027</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Épreuves Écrites BEPC & BAC :</span>
                      <strong className="text-[#047857]">Mai — Juin 2027</strong>
                    </li>
                  </ul>
                </div>

                {/* EMPLACEMENT 2 COURRIERS OFFICIELS */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-sm text-[#0a2540] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-blue-600">description</span>
                    Courriers Officiels du Ministère (MENA) :
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Note Circulaire Rentrée 2026-2027</p>
                        <p className="text-[10px] text-slate-400">Ministère de l'Éducation Nationale</p>
                      </div>
                      <span className="material-symbols-outlined text-blue-600">picture_as_pdf</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Calendrier National des Examens</p>
                        <p className="text-[10px] text-slate-400">Direction des Examens et Concours</p>
                      </div>
                      <span className="material-symbols-outlined text-blue-600">picture_as_pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 2 : VIE SCOLAIRE & ÉVÉNEMENTS À VENIR */}
            {actuModal === 'viescolaire' && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="w-10 h-10 bg-emerald-100 text-[#047857] rounded-xl flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div>
                    <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">PÉDAGOGIE & DISCIPLINE</span>
                    <h3 className="font-extrabold text-lg text-[#0a2540]">Vie Scolaire & Événements à Venir</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="bg-emerald-100 text-[#047857] font-bold text-[10px] px-2 py-0.5 rounded-md">15 MAI 2026</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Résultats des Examens Blancs DRENA 3</h4>
                    <p className="text-slate-600">
                      Analyse des taux de réussite aux épreuves régionales préparatoires pour les classes de 3ème, Terminales A, D, G1 et G2.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="bg-emerald-100 text-[#047857] font-bold text-[10px] px-2 py-0.5 rounded-md">20 OCTOBRE 2026</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Élection des Délégués de Classe & Bureau des Élèves</h4>
                    <p className="text-slate-600">
                      Sensibilisation à la citoyenneté, élection des représentants d'élèves et installation du Conseil des Délégués.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="bg-emerald-100 text-[#047857] font-bold text-[10px] px-2 py-0.5 rounded-md">12 NOVEMBRE 2026</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Lancement des Clubs Scientifiques & Génie en Herbe</h4>
                    <p className="text-slate-600">
                      Inscriptions aux ateliers d'informatique, de débat, de théâtre et aux rencontres de compétition inter-classes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 3 : ACTUALITÉ FESTIVE, CULTURELLE & ÉVASIVE */}
            {actuModal === 'festif' && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="w-10 h-10 bg-indigo-100 text-[#0a2540] rounded-xl flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined">celebration</span>
                  </div>
                  <div>
                    <span className="bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">CULTURE & RÉCONPENSES</span>
                    <h3 className="font-extrabold text-lg text-[#0a2540]">Actualités Festives & Culturelles</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
                    <span className="bg-[#0a2540] text-white font-bold text-[10px] px-2 py-0.5 rounded-md">02 JUIN 2026</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Remise des Diplômes & Journée d'Orientation Professionnelle</h4>
                    <p className="text-slate-600">
                      Cérémonie solennelle de graduation pour les élèves de Terminale et rencontre avec les cabinets partenaires et universités.
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
                    <span className="bg-[#0a2540] text-white font-bold text-[10px] px-2 py-0.5 rounded-md">15 FÉVRIER 2027</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Journée Culturelle & Foire Gastronomique de la Salle</h4>
                    <p className="text-slate-600">
                      Présentation des danses traditionnelles, concours de tenues traditionnelles ivoiriennes et dégustation culinaire régionale.
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
                    <span className="bg-[#0a2540] text-white font-bold text-[10px] px-2 py-0.5 rounded-md">25 AVRIL 2027</span>
                    <h4 className="font-bold text-sm text-[#0a2540]">Excursion Éducative & Journée Sportive Lasallienne</h4>
                    <p className="text-slate-600">
                      Sortie de découverte pédagogique à Yamoussoukro et tournois sportifs interdisciplinaires (Football, Handball, Athlétisme).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <button onClick={() => setActuModal(null)} className="px-5 py-2.5 bg-[#0a2540] text-white rounded-xl text-xs font-bold">
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL : DÉTAILS CURSUS */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button onClick={() => setDetailsModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {detailsModal === 'general' ? (
              <div className="space-y-4">
                <span className="bg-[#f59e0b] text-[#0a2540] text-xs font-extrabold px-3 py-1 rounded-md uppercase">PREMIER & SECOND CYCLES</span>
                <h3 className="text-2xl font-extrabold text-[#0a2540]">Enseignement Général — Programme & Débouchés</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Le pôle Enseignement Général prépare intensivement aux examens d'État avec un taux de réussite régulier de plus de 90%.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0a2540] text-sm">Premier Cycle (6ème à la 3ème)</h4>
                    <p className="text-slate-500">Acquisition des fondamentaux scientifiques et littéraires. Épreuves préparatoires au BEPC.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0a2540] text-sm">Second Cycle (Séries A & D)</h4>
                    <p className="text-slate-500">Spécialisation en BAC A (Littéraire, Langues, Philosophie) et BAC D (Sciences Expérimentales, Biologie, Mathématiques).</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setDetailsModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Fermer</button>
                  <button onClick={() => { setDetailsModal(null); openInscriptionWithFiliere('general'); }} className="px-5 py-2 bg-[#047857] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">event_seat</span> Réserver une place
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="bg-[#047857] text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase">PÔLE TERTIAIRE SPÉCIALISÉ</span>
                <h3 className="text-2xl font-extrabold text-[#0a2540]">Technique Tertiaire — Métiers G1, G2 & Série AB</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Formation pratique et théorique orientée vers les besoins immédiats des entreprises, cabinets comptables et structures économiques.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#047857] text-sm">Série G1 : Secrétariat</h4>
                    <p className="text-slate-600">Bureautique avancée, correspondance administrative, dactylographie, accueil et gestion d'agenda de direction.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#047857] text-sm">Série G2 : Comptabilité</h4>
                    <p className="text-slate-600">Comptabilité générale SYSCOHADA, mathématiques financières, logiciels SAGE, fiscalité et gestion de paie.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#047857] text-sm">Série AB : Économie</h4>
                    <p className="text-slate-600">Sciences économiques et sociales, analyse de marché, gestion financière et fondamentaux du droit des affaires.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setDetailsModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Fermer</button>
                  <button onClick={() => { setDetailsModal(null); openInscriptionWithFiliere('technique'); }} className="px-5 py-2 bg-[#0a2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">event_seat</span> Réserver une place
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL : FORMULAIRE DE PRÉ-INSCRIPTION / RÉSERVATION DE PLACES */}
      {inscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a2540] text-white rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">event_seat</span>
                </div>
                <div>
                  <span className="bg-emerald-100 text-[#047857] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">RÉSERVATION DE PLACES 2026-2027</span>
                  <h3 className="font-extrabold text-lg text-[#0a2540]">Formulaire de Préinscription</h3>
                  <p className="text-xs text-slate-500">{SCHOOL_INFO.name}</p>
                </div>
              </div>
              <button onClick={() => setInscriptionModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#0a2540]">
                <span>
                  {inscriptionStep === 1 && "Étape 1 : Formulaire de Réservation"}
                  {inscriptionStep === 2 && "Étape 2 : Frais d'Inscription & Scolarité"}
                  {inscriptionStep === 3 && "Confirmation : Place Réservée"}
                </span>
                <span>{inscriptionStep === 1 ? '50%' : '100%'}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#047857] transition-all duration-300" style={{ width: inscriptionStep === 1 ? '50%' : '100%' }} />
              </div>
            </div>

            {inscriptionStep === 1 && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#047857]">badge</span>
                  Informations de l'Élève Candidate :
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matricule de l'élève (si attribué)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 25170040G (Optionnel si nouveau)" 
                    value={formData.matricule} 
                    onChange={e => setFormData(prev => ({ ...prev, matricule: e.target.value }))} 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom de l'Élève *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: KOUASSI" 
                      value={formData.nom} 
                      onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))} 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prénom(s) de l'Élève *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jean-Marc Emmanuel" 
                      value={formData.prenom} 
                      onChange={e => setFormData(prev => ({ ...prev, prenom: e.target.value }))} 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe Sollicitée *</label>
                  <select 
                    value={formData.classe} 
                    onChange={e => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-[#0a2540]"
                  >
                    <optgroup label="Enseignement Général">
                      <option value="6ème — Enseignement Général">6ème — Enseignement Général</option>
                      <option value="5ème — Enseignement Général">5ème — Enseignement Général</option>
                      <option value="4ème — Enseignement Général">4ème — Enseignement Général</option>
                      <option value="3ème — Enseignement Général">3ème — Enseignement Général</option>
                      <option value="2nde A / D">2nde A / D</option>
                      <option value="1ère A / D">1ère A / D</option>
                      <option value="Terminale A / D">Terminale A / D</option>
                    </optgroup>
                    <optgroup label="Technique Tertiaire">
                      <option value="2nde G1/G2/AB">2nde G1 / G2 / AB</option>
                      <option value="1ère G1 (Secrétariat)">1ère G1 (Secrétariat)</option>
                      <option value="1ère G2 (Comptabilité)">1ère G2 (Comptabilité)</option>
                      <option value="1ère AB (Économie)">1ère AB (Économie)</option>
                      <option value="Série G1 (Secrétariat - Terminale)">Série G1 (Secrétariat - Terminale)</option>
                      <option value="Série G2 (Comptabilité - Terminale)">Série G2 (Comptabilité - Terminale)</option>
                      <option value="Série AB (Économie - Terminale)">Série AB (Économie - Terminale)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
                  <span className="font-bold text-slate-700">Statut de l'Élève :</span>
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <label className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition-all ${formData.statut === 'affecte' ? 'border-[#047857] bg-emerald-50/60 font-bold text-[#047857]' : 'border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="statut" 
                        checked={formData.statut === 'affecte'} 
                        onChange={() => setFormData(prev => ({ ...prev, statut: 'affecte' }))} 
                      />
                      <span>Affecté de l'État (DRENA 3)</span>
                    </label>

                    <label className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition-all ${formData.statut === 'non_affecte' ? 'border-[#0a2540] bg-slate-100 font-bold text-[#0a2540]' : 'border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="statut" 
                        checked={formData.statut === 'non_affecte'} 
                        onChange={() => setFormData(prev => ({ ...prev, statut: 'non_affecte' }))} 
                      />
                      <span>Non-affecté / Inscription Libre</span>
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Établissement d'Origine *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: EPP Attécoubé 1 ou Collège X" 
                      value={formData.etablissementOrigine} 
                      onChange={e => setFormData(prev => ({ ...prev, etablissementOrigine: e.target.value }))} 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Moyenne de Fin d'Année (MGA) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="20" 
                      placeholder="Ex: 14.25 / 20" 
                      value={formData.mga} 
                      onChange={e => setFormData(prev => ({ ...prev, mga: e.target.value }))} 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-bold text-[#047857]" 
                    />
                  </div>
                </div>

              </div>
            )}

            {inscriptionStep === 2 && (
              <div className="space-y-5 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-sm text-[#0a2540] border-b pb-2">Récapitulatif de la Réservation</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <p>Candidate : <strong className="text-slate-800">{formData.nom || '—'} {formData.prenom}</strong></p>
                    <p>Classe : <strong className="text-[#047857]">{formData.classe}</strong></p>
                    <p>Statut : <strong>{formData.statut === 'affecte' ? "Affecté de l'État" : "Non-affecté / Inscription Libre"}</strong></p>
                    <p>MGA : <strong className="text-[#047857]">{formData.mga ? `${formData.mga} / 20` : '—'}</strong></p>
                    <p className="col-span-2">Établissement d'Origine : <strong>{formData.etablissementOrigine || '—'}</strong></p>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-[#047857] font-extrabold text-sm">
                    <span className="material-symbols-outlined">payments</span>
                    <span>Détail des Frais d'Inscription & Scolarité</span>
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold text-slate-600">Frais d'Inscription & Dossier :</span>
                      <span className="font-bold text-slate-800">{currentFees.inscription.toLocaleString()} FCFA</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2 pt-1">
                      <span className="font-semibold text-slate-600">Frais de Scolarité Annuelle :</span>
                      <span className="font-bold text-slate-800">{currentFees.scolarite.toLocaleString()} FCFA</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm font-black text-[#0a2540]">
                      <span>MONTANT TOTAL À PAYER :</span>
                      <span className="text-base text-[#047857] bg-emerald-100 px-3 py-1 rounded-lg">
                        {currentFees.total.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic bg-white/50 p-2.5 rounded-lg border border-emerald-100">
                    💡 {currentFees.note}
                  </p>
                </div>

              </div>
            )}

            {inscriptionStep === 3 && (
              <div className="space-y-4 text-xs text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-[#047857] rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-[#0a2540]">Réservation de Place Enregistrée !</h4>
                  <p className="text-slate-500 max-w-md mx-auto">
                    La préinscription de <strong>{formData.nom} {formData.prenom}</strong> en classe de <strong>{formData.classe}</strong> a été enregistrée avec succès dans le système.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2 max-w-md mx-auto">
                  <p className="font-bold text-[#0a2540] border-b pb-1">Bordereau de Réservation :</p>
                  <p className="flex justify-between"><span>Matricule :</span> <strong>{formData.matricule || 'N/A'}</strong></p>
                  <p className="flex justify-between"><span>Total Frais à Réglera :</span> <strong className="text-[#047857]">{currentFees.total.toLocaleString()} FCFA</strong></p>
                  <p className="flex justify-between"><span>Lieu de Dépôt :</span> <strong>Secrétariat J.B. de La Salle 2 (Attécoubé Santé 3)</strong></p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              {inscriptionStep === 2 && (
                <button 
                  onClick={() => setInscriptionStep(1)} 
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Retour
                </button>
              )}

              {inscriptionStep === 1 && (
                <button 
                  onClick={() => setInscriptionStep(2)} 
                  disabled={!formData.nom || !formData.prenom || !formData.etablissementOrigine}
                  className="px-6 py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto disabled:opacity-50 shadow-md"
                >
                  <span>Étape Suivante (Calcul des Frais)</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              )}

              {inscriptionStep === 2 && (
                <button 
                  onClick={handleReservationSubmit} 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center gap-2 ml-auto shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      <span>Enregistrement dans le système...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">how_to_reg</span>
                      <span>Valider la Réservation en Ligne</span>
                    </>
                  )}
                </button>
              )}

              {inscriptionStep === 3 && (
                <button 
                  onClick={() => setInscriptionModal(false)} 
                  className="px-6 py-3 bg-[#0a2540] text-white rounded-xl text-xs font-bold ml-auto"
                >
                  Fermer & Imprimer la Fiche
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL ASSISTANT IA */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full h-[520px] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-4 bg-[#0a2540] text-white flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#f59e0b]">smart_toy</span>
                Assistant IA Lasallien
              </span>
              <button onClick={() => setAiOpen(false)} className="hover:opacity-75"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-[#0a2540] text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input 
                type="text" 
                placeholder="Posez votre question..." 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]" 
              />
              <button onClick={handleSend} className="p-2.5 bg-[#0a2540] text-white rounded-xl hover:bg-[#061726] transition-colors">
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0a2540] text-white text-xs py-12 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-base">
              <span className="material-symbols-outlined text-[#f59e0b]">school</span>
              {SCHOOL_INFO.shortName}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Fondé sur les valeurs de foi, de service et de communauté, notre collège privé technique est un pilier de l'éducation générale et tertiaire en Côte d'Ivoire.
            </p>
            <span className="inline-block bg-white/10 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
              DRENA 3 - Abidjan
            </span>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#f59e0b] mb-3 uppercase tracking-wider">LIENS UTILES</h4>
            <ul className="space-y-2 text-slate-300 text-[11px]">
              <li><a href="#mentions" className="hover:underline">Mentions Légales</a></li>
              <li><a href="#drena" className="hover:underline">Portail Administratif DRENA 3</a></li>
              <li><a href="#plan" className="hover:underline">Plan du Site</a></li>
              <li><a href="#contact" className="hover:underline">Contact & Secrétariat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#f59e0b] mb-3 uppercase tracking-wider">ACADÉMIQUE</h4>
            <ul className="space-y-2 text-slate-300 text-[11px]">
              <li><a href="#calendrier" className="hover:underline">Calendrier Scolaire 2026-2027</a></li>
              <li><a href="#fournitures" className="hover:underline">Listes de Fournitures Scolaires</a></li>
              <li><a href="#examens" className="hover:underline">Examens Blancs & Épreuves</a></li>
              <li><a href="#assiduite" className="hover:underline">Suivi du Carnet d'Assiduité</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#f59e0b] mb-3 uppercase tracking-wider">SUIVEZ-NOUS</h4>
            <p className="text-slate-400 text-[11px] mb-3">Restez informés des actualités et événements sur nos réseaux officiels.</p>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <span className="material-symbols-outlined text-sm">public</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-10 mt-12 pt-6 border-t border-white/10 text-center text-slate-400 text-[11px]">
          © 2026 {SCHOOL_INFO.name} — DRENA 3 - Abidjan. Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}