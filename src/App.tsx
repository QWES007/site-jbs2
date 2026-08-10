import React, { useState } from 'react';

// ============================================================================
// CONFIGURATION CENTRALISÉE DES MÉDIAS (PHOTOS & LOGO)
// ============================================================================
const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600",
  facadeCard: "/facade.jpg",
  generalImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
  techniqueImage: "/technique.jpg",
  actu1: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
  actu2: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
  actu3: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
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
};

export default function App() {
  // --- ÉTATS DES MODALS ---
  const [aiOpen, setAiOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<'general' | 'technique' | null>(null);
  const [inscriptionModal, setInscriptionModal] = useState(false);
  const [inscriptionStep, setInscriptionStep] = useState(1);
  const [activePortalTab, setActivePortalTab] = useState<'eleves' | 'parents' | 'profs'>('eleves');

  // Formulaire d'inscription
  const [formData, setFormData] = useState({
    filiere: 'general',
    classe: '3ème — Enseignement Général',
    statut: 'affecte',
    cantine: false,
    transport: false,
    nomEleve: '',
    dateNaissance: '',
    etablissementOrigine: '',
    genre: 'Masculin',
    nomTuteur: '',
    phoneTuteur: '',
  });

  // Assistant IA
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
      classe: filiere === 'general' ? '3ème — Enseignement Général' : 'Série G2 (Comptabilité)'
    }));
    setInscriptionStep(1);
    setInscriptionModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src={MEDIA_CONFIG.logo} alt="Logo JBS2" className="h-11 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#0a2540] tracking-tight">{SCHOOL_INFO.shortName}</span>
              <span className="bg-[#0b3c5d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">DRENA 3</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Attécoubé Santé 3 • Abidjan</p>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-7 text-xs font-bold text-slate-700">
          <a href="#accueil" className="text-[#0a2540] border-b-2 border-[#0a2540] pb-1">Accueil</a>
          <a href="#formations" className="hover:text-[#0a2540] transition-colors pb-1">Formations</a>
          <a href="#portails" className="hover:text-[#0a2540] transition-colors pb-1">Portails Numériques</a>
          <a href="#actualites" className="hover:text-[#0a2540] transition-colors pb-1">Actualités & Examens</a>
          <a href="#contact" className="hover:text-[#0a2540] transition-colors pb-1">Nous Trouver</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setAiOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>Assistant IA</span>
          </button>

          <button 
            onClick={() => openInscriptionWithFiliere('general')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Inscriptions</span>
          </button>
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
                <span className="material-symbols-outlined text-lg">person_add</span>
                Inscriptions En Ligne
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
                className="w-full py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                S'inscrire en Enseignement Général
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
                  Formations professionnalisantes en G1, G2, Comptabilité et Secrétariat. Préparez votre insertion immédiate en entreprise ou vos études supérieures.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Série G1 (Secrétariat)</div>
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Série G2 (Comptabilité)</div>
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Comptabilité SYSCOHADA</div>
                  <div className="p-2.5 bg-emerald-50 text-[#047857] font-bold rounded-xl text-center">Logiciels Sage & Excel</div>
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
                className="w-full py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                S'inscrire en Technique Tertiaire
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
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Accédez à votre espace dédié et suivez la vie scolaire en temps réel.</p>
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
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Emploi du Temps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Consultez vos horaires hebdomadaires et les salles de cours par classe.</p>
            <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">Voir le planning →</button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#f59e0b]">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Simulateur de Moyenne</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Testez vos notes avec les coefficients BEPC & BAC G1/G2 pour estimer votre moyenne.</p>
            <button className="text-xs font-bold text-[#f59e0b] flex items-center gap-1 hover:underline">Calculer ma moyenne →</button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0a2540]">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Règlement Intérieur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Les valeurs Lasalliennes, le port de l'uniforme et les règles de vie au collège.</p>
            <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">Consulter le règlement →</button>
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

        <div className="bg-[#0a2540] text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f59e0b]">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <div>
              <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                EXEMPLE DE BULLETIN NUMÉRIQUE
              </span>
              <h4 className="font-bold text-lg mt-1">Consulter le Bulletin Scolaire DRENA 3</h4>
              <p className="text-xs text-slate-300">Affichez la simulation complète du bulletin avec moyennes pondérées et appréciations.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-initial px-4 py-2.5 bg-white text-[#0a2540] rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
              3ème 1 (Kouassi Jean)
            </button>
            <button className="flex-1 md:flex-initial px-4 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-bold hover:bg-[#065f46] transition-all">
              Tle G2 (Yao Marie)
            </button>
          </div>
        </div>
      </section>

      {/* 5. ACTUALITÉS */}
      <section id="actualites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#f59e0b] text-[#0a2540] text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">VIE DE L'ÉTABLISSEMENT</span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Actualités & Événements Académiques</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Suivez les temps forts, examens régionaux DRENA 3 et avis de la direction.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={MEDIA_CONFIG.actu1} alt="Inscriptions" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">INSCRIPTIONS</span>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-[11px] text-slate-400 font-medium">28 Juillet 2026</span>
              <h3 className="font-bold text-base text-[#0a2540] leading-snug">Inscriptions & Réinscriptions Année Académique 2026-2027</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Les dossiers de réinscription et de nouvelles candidatures pour l'Enseignement Général et la Technique Tertiaire sont ouverts au secrétariat.</p>
              <button onClick={() => openInscriptionWithFiliere('general')} className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">M'inscrire maintenant →</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={MEDIA_CONFIG.actu2} alt="Examens" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">EXAMENS</span>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-[11px] text-slate-400 font-medium">15 Mai 2026</span>
              <h3 className="font-bold text-base text-[#0a2540] leading-snug">Résultats des Examens Blancs DRENA 3 (BEPC & BAC)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Excellentes performances de nos élèves de 3ème, Terminale A, D, G1 et G2 aux épreuves régionales de la DRENA 3.</p>
              <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">Lire la suite →</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={MEDIA_CONFIG.actu3} alt="Vie Scolaire" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#0b3c5d] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">VIE SCOLAIRE</span>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-[11px] text-slate-400 font-medium">02 Juin 2026</span>
              <h3 className="font-bold text-base text-[#0a2540] leading-snug">Remise des Diplômes et Journée d'Orientation Professionnelle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Des cabinets comptables et entreprises partenaires viendront présenter les débouchés de la filière tertiaire aux élèves de Terminale.</p>
              <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">Lire la suite →</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NOUS TROUVER & CONTACT (VRAIES COORDONNÉES INCLUSES) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#0a2540] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">LOCALISATION & CONTACT</span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Nous Trouver</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Situé dans le quartier paisible d'Attécoubé Santé 3, notre établissement offre un cadre d'études moderne, sécurisé et propice à la concentration.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            
            {/* Adresse & BP */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Adresse Officielle</h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{SCHOOL_INFO.address}</p>
              </div>
            </div>

            {/* Téléphone */}
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

            {/* Email */}
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
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                <span className="material-symbols-outlined text-base">map</span> Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Formulaire de Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0a2540]">Envoyer un Message au Secrétariat</h3>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénoms *</label>
                <input type="text" placeholder="Ex: Touré Amadou" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone *</label>
                <input type="text" placeholder="+225 07..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Votre Message *</label>
              <textarea rows={4} placeholder="Posez votre question concernant les filières, les inscriptions ou les tarifs..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]" />
            </div>
            <button type="submit" className="px-6 py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md">
              <span className="material-symbols-outlined text-base">send</span>
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      {/* MODAL : DÉTAILS CURSUS */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
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
                    <span className="material-symbols-outlined text-base">person_add</span> S'inscrire maintenant
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="bg-[#047857] text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase">PÔLE TERTIAIRE SPÉCIALISÉ</span>
                <h3 className="text-2xl font-extrabold text-[#0a2540]">Technique Tertiaire — Métiers G1 & G2</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Formation pratique et théorique orientée vers les besoins immédiats des entreprises et cabinets comptables.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#047857] text-sm">Série G1 : Secrétariat</h4>
                    <p className="text-slate-600">Bureautique avancée, correspondance administrative, dactylographie, accueil et gestion d'agenda de direction.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#047857] text-sm">Série G2 : Comptabilité</h4>
                    <p className="text-slate-600">Comptabilité générale SYSCOHADA, mathématiques financières, logiciels SAGE, fiscalité et gestion de paie.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setDetailsModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Fermer</button>
                  <button onClick={() => { setDetailsModal(null); openInscriptionWithFiliere('technique'); }} className="px-5 py-2 bg-[#0a2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">person_add</span> S'inscrire maintenant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL : FORMULAIRE DE PRÉ-INSCRIPTION EN 4 ÉTAPES */}
      {inscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a2540] text-white rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <span className="bg-emerald-100 text-[#047857] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">ANNÉE ACADÉMIQUE 2026-2027</span>
                  <h3 className="font-extrabold text-lg text-[#0a2540]">Pré-Inscription & Inscription en Ligne</h3>
                  <p className="text-xs text-slate-500">{SCHOOL_INFO.name} (DRENA 3)</p>
                </div>
              </div>
              <button onClick={() => setInscriptionModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#0a2540]">
                <span>Étape {inscriptionStep} sur 4 : {
                  inscriptionStep === 1 ? 'Choix de la Filière' :
                  inscriptionStep === 2 ? 'Niveau d\'Étape & Options' :
                  inscriptionStep === 3 ? 'Informations de l\'Élève & Parent' : 'Récapitulatif & Devis'
                }</span>
                <span>{inscriptionStep * 25}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#047857] transition-all duration-300" style={{ width: `${inscriptionStep * 25}%` }} />
              </div>
            </div>

            {inscriptionStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-800">1. Choisissez le parcours de formation souhaité :</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, filiere: 'general', classe: '3ème — Enseignement Général' }))}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${formData.filiere === 'general' ? 'border-[#0a2540] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="material-symbols-outlined text-2xl text-[#0a2540]">school</span>
                      {formData.filiere === 'general' && <span className="material-symbols-outlined text-[#0a2540]">check_circle</span>}
                    </div>
                    <h5 className="font-bold text-sm text-[#0a2540]">Enseignement Général</h5>
                    <p className="text-[11px] text-slate-500">De la 6ème à la Terminale A & D. Préparation intensive au BEPC et BAC Général.</p>
                  </div>

                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, filiere: 'technique', classe: 'Série G2 (Comptabilité)' }))}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${formData.filiere === 'technique' ? 'border-[#047857] bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="material-symbols-outlined text-2xl text-[#047857]">work</span>
                      {formData.filiere === 'technique' && <span className="material-symbols-outlined text-[#047857]">check_circle</span>}
                    </div>
                    <h5 className="font-bold text-sm text-[#047857]">Technique Tertiaire</h5>
                    <p className="text-[11px] text-slate-500">Séries G1 (Secrétariat) & G2 (Comptabilité). Préparation au BAC Technique.</p>
                  </div>
                </div>
              </div>
            )}

            {inscriptionStep === 2 && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-sm text-slate-800">2. Sélectionnez la classe demandée et les options :</h4>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe visée pour la rentrée 2026-2027 :</label>
                  <select 
                    value={formData.classe} 
                    onChange={e => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                  >
                    {formData.filiere === 'general' ? (
                      <>
                        <option>6ème — Enseignement Général</option>
                        <option>5ème — Enseignement Général</option>
                        <option>4ème — Enseignement Général</option>
                        <option>3ème — Enseignement Général</option>
                        <option>2nde A / D</option>
                        <option>1ère A / D</option>
                        <option>Terminale A / D</option>
                      </>
                    ) : (
                      <>
                        <option>2nde G1 / G2</option>
                        <option>1ère G1 (Secrétariat)</option>
                        <option>1ère G2 (Comptabilité)</option>
                        <option>Série G1 (Secrétariat - Terminale)</option>
                        <option>Série G2 (Comptabilité - Terminale)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
                  <span className="font-bold text-slate-700">Statut de l'affectation :</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="statut" checked={formData.statut === 'affecte'} onChange={() => setFormData(prev => ({ ...prev, statut: 'affecte' }))} />
                      <span>Affecté par l'État (DRENA 3)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="statut" checked={formData.statut === 'libre'} onChange={() => setFormData(prev => ({ ...prev, statut: 'libre' }))} />
                      <span>Inscriptif Libre / Non-affecté</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-700">Services optionnels :</span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer ${formData.cantine ? 'border-[#047857] bg-emerald-50/50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#047857]">restaurant</span>
                        <span>Service Cantine / Déjeuner (+75 000 FCFA/an)</span>
                      </div>
                      <input type="checkbox" checked={formData.cantine} onChange={e => setFormData(prev => ({ ...prev, cantine: e.target.checked }))} />
                    </label>

                    <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer ${formData.transport ? 'border-[#047857] bg-emerald-50/50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#047857]">directions_bus</span>
                        <span>Transport Scolaire Attécoubé (+60 000 FCFA/an)</span>
                      </div>
                      <input type="checkbox" checked={formData.transport} onChange={e => setFormData(prev => ({ ...prev, transport: e.target.checked }))} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {inscriptionStep === 3 && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-sm text-slate-800">3. Renseignez l'état civil de l'élève et du tuteur :</h4>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom & Prénoms de l'Élève *</label>
                    <input type="text" placeholder="Ex: Kouassi Koffi Emmanuel" value={formData.nomEleve} onChange={e => setFormData(prev => ({ ...prev, nomEleve: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date de Naissance *</label>
                    <input type="date" value={formData.dateNaissance} onChange={e => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Établissement d'Origine</label>
                    <input type="text" placeholder="Établissement Primaire / Collège" value={formData.etablissementOrigine} onChange={e => setFormData(prev => ({ ...prev, etablissementOrigine: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Genre</label>
                    <select value={formData.genre} onChange={e => setFormData(prev => ({ ...prev, genre: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none font-bold">
                      <option>Masculin</option>
                      <option>Féminin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-3">
                  <span className="font-bold text-slate-800">Coordonnées du Parent / Tuteur Légal :</span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nom & Prénoms du Tuteur *</label>
                      <input type="text" placeholder="Ex: Kouassi Charles" value={formData.nomTuteur} onChange={e => setFormData(prev => ({ ...prev, nomTuteur: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Numéro WhatsApp *</label>
                      <input type="text" placeholder="+225 07..." value={formData.phoneTuteur} onChange={e => setFormData(prev => ({ ...prev, phoneTuteur: e.target.value }))} className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inscriptionStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#047857]">check_circle</span>
                  <h4 className="font-extrabold text-[#047857] text-base">Fiche de Pré-Inscription Générée avec Succès !</h4>
                  <p className="text-slate-600">Votre dossier pour <strong>{formData.nomEleve || "L'élève"}</strong> en <strong>{formData.classe}</strong> a été enregistré.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border space-y-2">
                  <h5 className="font-bold text-[#0a2540]">Récapitulatif des frais estimés :</h5>
                  <div className="flex justify-between border-b pb-1">
                    <span>Droits d'inscription ({formData.statut === 'affecte' ? 'État DRENA 3' : 'Libre'}) :</span>
                    <span className="font-bold">{formData.statut === 'affecte' ? 'Frais d\'État' : '95 000 FCFA'}</span>
                  </div>
                  {formData.cantine && <div className="flex justify-between border-b pb-1"><span>Option Cantine :</span><span className="font-bold">75 000 FCFA</span></div>}
                  {formData.transport && <div className="flex justify-between border-b pb-1"><span>Option Transport Scolaire :</span><span className="font-bold">60 000 FCFA</span></div>}
                  <p className="text-[11px] text-slate-500 pt-1">Le secrétariat contactera le tuteur au <strong>{formData.phoneTuteur || SCHOOL_INFO.phone}</strong> pour finaliser le dépôt physique.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              {inscriptionStep > 1 && inscriptionStep < 4 ? (
                <button onClick={() => setInscriptionStep(prev => prev - 1)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                  Retour
                </button>
              ) : <div />}

              {inscriptionStep < 3 && (
                <button onClick={() => setInscriptionStep(prev => prev + 1)} className="px-6 py-2.5 bg-[#0a2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto">
                  <span>Étape Suivante</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              )}

              {inscriptionStep === 3 && (
                <button onClick={() => setInscriptionStep(4)} className="px-6 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto">
                  <span>Voir le Devis & Valider</span>
                  <span className="material-symbols-outlined text-base">check</span>
                </button>
              )}

              {inscriptionStep === 4 && (
                <button onClick={() => setInscriptionModal(false)} className="px-6 py-2.5 bg-[#0a2540] text-white rounded-xl text-xs font-bold ml-auto">
                  Fermer & Terminer
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