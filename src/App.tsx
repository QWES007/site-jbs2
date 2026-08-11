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

// GALERIE DES ACTIVITÉS DE L'ÉCOLE (Prête à recevoir plusieurs photos de toutes sortes)
const SCHOOL_ACTIVITIES = [
  {
    id: 1,
    title: "Journée du Mérite & Récompenses",
    category: "fetes",
    date: "Mai 2026",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
    desc: "Célébration des meilleurs élèves de l'année académique."
  },
  {
    id: 2,
    title: "Tournoi Inter-classes de Football & Basket",
    category: "sports",
    date: "Avril 2026",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600",
    desc: "Compétition sportive annuelle entre le 1er et 2nd cycle."
  },
  {
    id: 3,
    title: "Sortie Éducative & Visite d'Entreprise",
    category: "pedagogie",
    date: "Mars 2026",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    desc: "Immersion des élèves des séries G1 et G2 en milieu professionnel."
  },
  {
    id: 4,
    title: "Atelier Scientifique & Informatique",
    category: "pedagogie",
    date: "Février 2026",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600",
    desc: "Pratique sur ordinateurs et démonstrations en laboratoire."
  },
  {
    id: 5,
    title: "Fête Culturelle & Danses Traditionnelles",
    category: "fetes",
    date: "Décembre 2025",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
    desc: "Mise en valeur du patrimoine culturel et des talents des élèves."
  },
  {
    id: 6,
    title: "Séance de Sensibilisation & Secourisme",
    category: "vie_scolaire",
    date: "Novembre 2025",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600",
    desc: "Formation aux premiers secours et conseils de citoyenneté."
  }
];

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
  drenaUrl: "https://drenaabidjan3.ci/",
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
// COMPOSANT: RECHERCHE DE BULLETIN NUMÉRIQUE
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
        setError(`Aucun élève trouvé pour "${query}". Vérifiez le matricule ou l'orthographe.`);
      }
    } catch (err) {
      setError("Fichier notes.json introuvable.");
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
            <button onClick={() => window.print()} className="w-full sm:w-auto px-5 py-2.5 bg-[#0a2540] hover:bg-[#061726] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
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
  const [footerModal, setFooterModal] = useState<'mentions' | 'fournitures' | null>(null);
  const [inscriptionModal, setInscriptionModal] = useState(false);
  const [inscriptionStep, setInscriptionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'eleves' | 'parents' | 'profs'>('eleves');
  
  // Filtre pour la galerie photos des activités
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

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
    { id: '1', sender: 'assistant', text: `Bonjour ! Je suis l'Assistant Virtuel du Collège J.B. de La Salle 2. Comment puis-je vous aider aujourd'hui ? Vous pouvez contacter le secrétariat au ${SCHOOL_INFO.phone}.` }
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
        text: `Merci pour votre message ! Le secrétariat d'Attécoubé Santé 3 reste joignable au ${SCHOOL_INFO.phone}.`
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
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setInscriptionStep(3);
  };

  const currentFees = calculateSchoolFees(formData.classe, formData.statut);

  const filteredActivities = selectedCategory === 'tous' 
    ? SCHOOL_ACTIVITIES 
    : SCHOOL_ACTIVITIES.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-2 shadow-sm">
        <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 min-w-0">
            <img src={MEDIA_CONFIG.logo} alt="Logo JBS2" className="h-9 w-auto object-contain shrink-0" />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-[#0a2540] tracking-tight leading-snug">
                    {SCHOOL_INFO.fullNamePart1}
                  </span>
                  <span className="font-extrabold text-xs text-[#0a2540] tracking-tight leading-snug text-center">
                    {SCHOOL_INFO.fullNamePart2}
                  </span>
                </div>
                <span className="inline-block bg-[#0b3c5d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                  DRENA 3
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{SCHOOL_INFO.address}</p>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#accueil" className="text-[#0a2540] border-b-2 border-[#0a2540] pb-1">Accueil</a>
            <a href="#formations" className="hover:text-[#0a2540] transition-colors pb-1">Formations</a>
            <a href="#portails" className="hover:text-[#0a2540] transition-colors pb-1">Portails Numériques</a>
            <a href="#activites" className="hover:text-[#0a2540] transition-colors pb-1">Découverte & Activités</a>
            <a href="#contact" className="hover:text-[#0a2540] transition-colors pb-1">Nous Trouver</a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setAiOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              <span className="hidden sm:inline">Assistant IA</span>
            </button>

            <button 
              onClick={() => openInscriptionWithFiliere('general')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
              <span>Réservation<span className="hidden sm:inline"> en Ligne</span></span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION (POLICE RÉDUITE & POLICE DES STATS RÉDUITE COMME SUR L'IMAGE 2) */}
      <section id="accueil" className="relative bg-[#0a2540] text-white overflow-hidden py-10 lg:py-14 px-4 lg:px-12">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${MEDIA_CONFIG.heroBackground})` }}
        />

        <div className="max-w-[90rem] mx-auto grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold uppercase rounded-full tracking-wide shadow-sm">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              ÉTABLISSEMENT D'EXCELLENCE • DRENA 3
            </span>
            
            {/* Titre réduit pour correspondre exactement au style visuel de l'image 2 */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              L'Excellence Éducative et Technique au Cœur d'Attécoubé
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
              Le <em>{SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}</em> forme les leaders de demain à travers un enseignement général rigoureux et un pôle technique tertiaire de haut niveau au service du développement ivoirien.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => openInscriptionWithFiliere('general')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-base">event_seat</span>
                Réserver une place en Ligne
              </button>
              <a href="#formations" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-sm transition-all">
                <span className="material-symbols-outlined text-base">explore</span>
                Visiter le Collège
              </a>
            </div>

            {/* SECTION STATISTIQUES (Taille de police réduite exactement comme sur l'image 2) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-inner text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-extrabold text-[#f59e0b]">58,88 %</span>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Réussite BEPC</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-inner text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-extrabold text-[#f59e0b]">49,50 %</span>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Réussite BAC</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-inner text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-extrabold text-[#f59e0b]">1 450+</span>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Élèves Enseignés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-inner text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-extrabold text-[#f59e0b]">DRENA 3</span>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Rang d'Élite</p>
              </div>
            </div>
          </div>

          {/* CARTE PHOTO */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-2xl space-y-3">
              <div className="relative rounded-xl overflow-hidden h-64 sm:h-72 border border-white/10 shadow-inner">
                <img src={MEDIA_CONFIG.facadeCard} alt="Façade du Collège" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#0a2540]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md">
                  <span className="material-symbols-outlined text-xs text-[#f59e0b]">verified</span>
                  Façade Officielle
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
                  <h3 className="font-extrabold text-sm tracking-tight">{SCHOOL_INFO.shortName}</h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {SCHOOL_INFO.address}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-white">Cadre d'études & Sécurité</p>
                  <p className="text-[10px] text-slate-300">Enseignement Général & Tertiaire</p>
                </div>
                <a href="#formations" className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a2540] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-md">
                  <span>Découvrir</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION FORMATIONS */}
      <section id="formations" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div className="grid lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-56 overflow-hidden">
                <img src={MEDIA_CONFIG.generalImage} alt="Enseignement Général" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  PREMIER & SECOND CYCLES
                </span>
                <div className="absolute bottom-3 left-3 text-white font-extrabold text-xl drop-shadow-md">
                  Enseignement Général
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  De la 6ème à la Terminale (Séries A & D). Un encadrement pédagogique d'élite pour la réussite aux examens nationaux du BEPC et du BAC.
                </p>
                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <p className="flex items-center gap-2"><span className="text-[#047857]">✓</span> Cycle Orientation (6ème - 3ème)</p>
                  <p className="flex items-center gap-2"><span className="text-[#047857]">✓</span> Cycle Secondaire (2nde - Terminale A/D)</p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-2">
              <button 
                onClick={() => setDetailsModal('general')}
                className="w-full py-2.5 border border-[#0a2540] text-[#0a2540] hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">info</span>
                Détails du cursus
              </button>
              
              <button 
                onClick={() => openInscriptionWithFiliere('general')}
                className="w-full py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-base">event_seat</span>
                Préinscription (Général)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-56 overflow-hidden">
                <img src={MEDIA_CONFIG.techniqueImage} alt="Technique Tertiaire" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  PÔLE TERTIAIRE SPÉCIALISÉ
                </span>
                <div className="absolute bottom-3 left-3 text-white font-extrabold text-xl drop-shadow-md">
                  Technique Tertiaire
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Formations professionnalisantes en G1, G2, Série AB, Comptabilité et Secrétariat. Préparez votre insertion immédiate en entreprise.
                </p>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 bg-emerald-50 text-[#047857] font-bold rounded-lg text-center">Série G1</div>
                  <div className="p-2 bg-emerald-50 text-[#047857] font-bold rounded-lg text-center">Série G2</div>
                  <div className="p-2 bg-emerald-50 text-[#047857] font-bold rounded-lg text-center">Série AB</div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-2">
              <button 
                onClick={() => setDetailsModal('technique')}
                className="w-full py-2.5 border border-[#047857] text-[#047857] hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">work</span>
                Découvrir les métiers
              </button>
              
              <button 
                onClick={() => openInscriptionWithFiliere('technique')}
                className="w-full py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-base">event_seat</span>
                Préinscription (Technique)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PORTAILS NUMÉRIQUES */}
      <section id="portails" className="max-w-7xl mx-auto px-4 lg:px-10 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              ESPACE NUMÉRIQUE SÉCURISÉ
            </span>
            <h2 className="text-2xl font-extrabold text-[#0a2540] mt-1">Portails Numériques</h2>
            <p className="text-xs text-slate-500">Accédez directement aux plateformes gouvernementales et scolaires officielles.</p>
          </div>

          <div className="bg-white p-1 rounded-xl border border-slate-200 flex gap-1 shadow-sm">
            <button 
              onClick={() => setActivePortalTab('eleves')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activePortalTab === 'eleves' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-sm">school</span> Élèves
            </button>
            <button 
              onClick={() => setActivePortalTab('parents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activePortalTab === 'parents' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-sm">family_restroom</span> Parents
            </button>
            <button 
              onClick={() => setActivePortalTab('profs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activePortalTab === 'profs' ? 'bg-[#0a2540] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined text-sm">person</span> Professeurs
            </button>
          </div>
        </div>

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

        <BulletinNumeriqueSearch />

      </section>

      {/* 5. DÉCOUVERTE & GALERIE DE TOUTES LES ACTIVITÉS DE L'ÉCOLE */}
      <section id="activites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              VIE SCOLAIRE & ACTIVITÉS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] mt-1">
              Découverte des Activités de l'École
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explorez les moments forts, sorties, événements sportifs et célébrations au Collège J.B. de La Salle 2.
            </p>
          </div>

          {/* BARRE DE FILTRES DYNAMIQUES */}
          <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
            <button 
              onClick={() => setSelectedCategory('tous')}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedCategory === 'tous' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setSelectedCategory('fetes')}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedCategory === 'fetes' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Fêtes & Culture
            </button>
            <button 
              onClick={() => setSelectedCategory('sports')}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedCategory === 'sports' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Sports
            </button>
            <button 
              onClick={() => setSelectedCategory('pedagogie')}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedCategory === 'pedagogie' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Pédagogie & Sorties
            </button>
          </div>
        </div>

        {/* GRILLE MULTI-PHOTOS DE TOUTES SORTES */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(act => (
            <div 
              key={act.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={act.image} 
                    alt={act.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-3 left-3 bg-[#0a2540]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                    {act.date}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-[#0a2540] leading-snug group-hover:text-[#047857] transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button 
                  onClick={() => setSelectedPhoto(act)}
                  className="w-full py-2 bg-slate-100 hover:bg-[#0a2540] hover:text-white text-[#0a2540] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">zoom_in</span>
                  <span>Agrandir la photo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL PHOTO AGRANDIE */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
            <button 
              onClick={() => setSelectedPhoto(null)} 
              className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="rounded-2xl overflow-hidden h-72 sm:h-96">
              <img src={selectedPhoto.image} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                {selectedPhoto.date}
              </span>
              <h3 className="font-extrabold text-lg text-[#0a2540]">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-600">{selectedPhoto.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. NOUS TROUVER & CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">LOCALISATION & CONTACT</span>
          <h2 className="text-2xl font-extrabold text-[#0a2540] mt-1">Nous Trouver</h2>
          <p className="text-xs text-slate-500 mt-1">Situé à Attécoubé Santé 3, notre établissement offre un cadre sécurisé et propice aux études.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0a2540]">Adresse Officielle</h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{SCHOOL_INFO.address}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined text-lg">call</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0a2540]">Téléphone (Secrétariat)</h4>
                <a href={`tel:${SCHOOL_INFO.phoneFormatted}`} className="text-xs text-slate-600 mt-0.5 font-bold hover:text-[#047857] transition-colors block">
                  {SCHOOL_INFO.phone}
                </a>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0a2540]">Courrier Électronique</h4>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="text-xs text-slate-600 mt-0.5 font-bold hover:text-[#047857] transition-colors block">
                  {SCHOOL_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-200 rounded-3xl h-64 lg:h-72 border border-slate-300 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0a2540_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="bg-white p-5 rounded-3xl shadow-xl text-center space-y-2 z-10 max-w-sm border border-slate-100">
              <div className="w-10 h-10 bg-[#0a2540] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <div>
                <h4 className="font-extrabold text-[#0a2540] text-sm">{SCHOOL_INFO.shortName}</h4>
                <p className="text-xs text-slate-500">Attécoubé Santé 3 (23 BP 519 Abidjan 23)</p>
              </div>
              <a href={SCHOOL_INFO.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                <span className="material-symbols-outlined text-base">map</span> Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a2540] text-white text-xs py-10 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-sm">
              <span className="material-symbols-outlined text-[#f59e0b]">school</span>
              {SCHOOL_INFO.shortName}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Établissement privé d'enseignement général et technique tertiaire d'excellence à Abidjan.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#f59e0b] mb-2 uppercase tracking-wider">LIENS UTILES</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li><button onClick={() => setFooterModal('mentions')} className="hover:underline text-left">Mentions Légales & Agréments</button></li>
              <li><a href="#accueil" className="hover:underline">Plan du Site & Accueil</a></li>
              <li><a href="#contact" className="hover:underline">Contact & Secrétariat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#f59e0b] mb-2 uppercase tracking-wider">ACADÉMIQUE</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li><button onClick={() => setActuModal('dates')} className="hover:underline text-left">Calendrier Scolaire 2026-2027</button></li>
              <li><button onClick={() => setFooterModal('fournitures')} className="hover:underline text-left">Listes de Fournitures Scolaires</button></li>
              <li><a href="#portails" className="hover:underline">Bulletins Numériques</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#f59e0b] mb-2 uppercase tracking-wider">RÉSEAUX & CONTACT</h4>
            <div className="flex gap-2 pt-1">
              <a href={SCHOOL_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="w-8 h-8 bg-emerald-600/30 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-base">chat</span>
              </a>
              <a href={SCHOOL_INFO.facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 bg-blue-600/30 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-base">public</span>
              </a>
              <a href={SCHOOL_INFO.drenaUrl} target="_blank" rel="noreferrer" className="w-8 h-8 bg-emerald-600/30 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-base">account_balance</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-10 mt-8 pt-4 border-t border-white/10 text-center text-slate-400 text-[10px]">
          © 2026 {SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}. Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}