import React, { useState } from 'react';

// ============================================================================
// CONFIGURATION CENTRALISÉE DES MÉDIAS (PHOTOS & LOGO)
// Placez vos fichiers dans le dossier public/ (ex: public/facade.jpg)
// ============================================================================
const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600",
  facadeCard: "/facade.jpg", // <--- Votre photo locale dans public/facade.jpg
  generalImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
  techniqueImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  actu1: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
  actu2: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
  actu3: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
};

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'eleves' | 'parents' | 'profs'>('eleves');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'assistant', text: 'Bonjour ! Je suis l\'Assistant Virtuel du Collège J.B. de La Salle 2. Comment puis-je vous aider aujourd\'hui ?' }
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
        text: 'Merci pour votre message ! Le secrétariat d\'Attécoubé Santé 3 reste joignable pour tout complément d\'information.'
      }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. BARRE DE NAVIGATION (HEADER) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src={MEDIA_CONFIG.logo} alt="Logo JBS2" className="h-11 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#0a2540] tracking-tight">J.B. de La Salle 2</span>
              <span className="bg-[#0b3c5d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">DRENA 3</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Attécoubé Santé 3 • Abidjan</p>
          </div>
        </div>

        {/* Liens centraux */}
        <nav className="hidden xl:flex items-center gap-7 text-xs font-bold text-slate-700">
          <a href="#accueil" className="text-[#0a2540] border-b-2 border-[#0a2540] pb-1">Accueil</a>
          <a href="#formations" className="hover:text-[#0a2540] transition-colors pb-1">Formations</a>
          <a href="#portails" className="hover:text-[#0a2540] transition-colors pb-1">Portails Numériques</a>
          <a href="#actualites" className="hover:text-[#0a2540] transition-colors pb-1">Actualités & Examens</a>
          <a href="#contact" className="hover:text-[#0a2540] transition-colors pb-1">Nous Trouver</a>
        </nav>

        {/* Boutons d'actions header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
            <span className="material-symbols-outlined text-base">download</span>
            <span>Fichier HTML Autonome</span>
          </button>
          
          <button 
            onClick={() => setAiOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>Assistant IA</span>
          </button>

          <a href="#contact" className="flex items-center gap-1.5 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Inscriptions</span>
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION AVEC FILIGRANE ET CARTE FLOTTANTE */}
      <section id="accueil" className="relative bg-[#0a2540] text-white overflow-hidden py-12 lg:py-20 px-4 lg:px-12">
        {/* Image en filigrane de fond */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${MEDIA_CONFIG.heroBackground})` }}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Texte Hero (Gauche) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f59e0b] text-[#0a2540] text-xs font-extrabold uppercase rounded-full tracking-wide shadow-sm">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              ÉTABLISSEMENT D'EXCELLENCE • DRENA 3
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              L'Excellence Éducative et Technique au Cœur d'Attécoubé
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Le <em>Collège Privé Technique Jean Baptiste de La Salle 2</em> forme les leaders de demain à travers un enseignement général rigoureux et un pôle technique tertiaire de haut niveau au service du développement ivoirien.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#contact" className="flex items-center gap-2 px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md">
                <span className="material-symbols-outlined text-lg">person_add</span>
                Inscriptions En Ligne
              </a>
              <a href="#formations" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs sm:text-sm backdrop-blur-sm transition-all">
                <span className="material-symbols-outlined text-lg">explore</span>
                Visiter le Collège
              </a>
            </div>

            {/* Statistiques en bas du Hero */}
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

          {/* Carte Façade Officielle (Droite) */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/20 shadow-2xl space-y-3">
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 border border-white/10">
                <img src={MEDIA_CONFIG.facadeCard} alt="Façade Collège" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#0a2540]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <span className="material-symbols-outlined text-sm text-[#f59e0b]">verified</span>
                  Façade Officielle
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <h3 className="font-bold text-base">Collège J.B. de La Salle 2</h3>
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
                <button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a2540] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all">
                  <span>Découvrir</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION FORMATIONS (GÉNÉRAL & TECHNIQUE) */}
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
              <button className="w-full py-3 border border-[#0a2540] text-[#0a2540] hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-base">info</span>
                Détails du cursus
              </button>
              <button className="w-full py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm">
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
              <button className="w-full py-3 border border-[#047857] text-[#047857] hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-base">work</span>
                Découvrir les métiers & programmes
              </button>
              <button className="w-full py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-base">person_add</span>
                S'inscrire en Technique Tertiaire
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECTION PORTAILS NUMÉRIQUES */}
      <section id="portails" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="bg-[#0a2540] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
              ESPACE NUMÉRIQUE SÉCURISÉ
            </span>
            <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Portails Numériques</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Accédez à votre espace dédié et suivez la vie scolaire en temps réel.</p>
          </div>

          {/* Onglets Élèves / Parents / Professeurs */}
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

        {/* 4 Cartes Portails */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0a2540]">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Emploi du Temps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Consultez vos horaires hebdomadaires et les salles de cours par classe.</p>
            <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">
              Voir le planning →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#f59e0b]">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Simulateur de Moyenne</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Testez vos notes avec les coefficients BEPC & BAC G1/G2 pour estimer votre moyenne.</p>
            <button className="text-xs font-bold text-[#f59e0b] flex items-center gap-1 hover:underline">
              Calculer ma moyenne →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0a2540]">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Règlement Intérieur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Les valeurs Lasalliennes, le port de l'uniforme et les règles de vie au collège.</p>
            <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">
              Consulter le règlement →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#047857]">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <h3 className="font-bold text-base text-[#0a2540]">Clubs & Vie Sociale</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Rejoignez nos clubs sportifs, d'art oratoire, de génie en herbe et informatique.</p>
            <button className="text-xs font-bold text-[#047857] flex items-center gap-1 hover:underline">
              Découvrir les clubs →
            </button>
          </div>

        </div>

        {/* Bannière d'accès au Bulletin Scolaire */}
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

      {/* 5. SECTION ACTUALITÉS & ÉVÉNEMENTS */}
      <section id="actualites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#f59e0b] text-[#0a2540] text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
            VIE DE L'ÉTABLISSEMENT
          </span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Actualités & Événements Académiques</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Suivez les temps forts, examens régionaux DRENA 3 et avis de la direction.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={MEDIA_CONFIG.actu1} alt="Inscriptions" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                INSCRIPTIONS
              </span>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-[11px] text-slate-400 font-medium">28 Juillet 2026</span>
              <h3 className="font-bold text-base text-[#0a2540] leading-snug">Inscriptions & Réinscriptions Année Académique 2026-2027</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Les dossiers de réinscription et de nouvelles candidatures pour l'Enseignement Général et la Technique Tertiaire sont ouverts au secrétariat.</p>
              <button className="text-xs font-bold text-[#0a2540] flex items-center gap-1 hover:underline">Lire la suite →</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={MEDIA_CONFIG.actu2} alt="Examens" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                EXAMENS
              </span>
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
              <span className="absolute top-3 left-3 bg-[#0b3c5d] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                VIE SCOLAIRE
              </span>
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

      {/* 6. SECTION NOUS TROUVER & FORMULAIRE DE CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div>
          <span className="bg-[#0a2540] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
            LOCALISATION & CONTACT
          </span>
          <h2 className="text-3xl font-extrabold text-[#0a2540] mt-2">Nous Trouver</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Situé dans le quartier paisible d'Attécoubé Santé 3, notre établissement offre un cadre d'études moderne, sécurisé et propice à la concentration.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Coordonnées (Gauche) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Adresse Officielle</h4>
                <p className="text-xs text-slate-500 mt-0.5">Attécoubé Santé 3, près de la cité RAN, Abidjan, Côte d'Ivoire</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Téléphones (Secrétariat)</h4>
                <p className="text-xs text-slate-500 mt-0.5">+225 07 00 00 00 00 / +225 27 00 00 00 00</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0a2540] shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0a2540]">Courrier Électronique</h4>
                <p className="text-xs text-slate-500 mt-0.5">contact@lasalle2-abidjan.ci</p>
              </div>
            </div>
          </div>

          {/* Carte Google Maps (Droite) */}
          <div className="lg:col-span-8 bg-slate-200 rounded-3xl h-72 lg:h-80 border border-slate-300 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0a2540_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center space-y-3 z-10 max-w-sm border border-slate-100">
              <div className="w-12 h-12 bg-[#0a2540] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h4 className="font-extrabold text-[#0a2540] text-base">Jean Baptiste de La Salle 2</h4>
                <p className="text-xs text-slate-500">Attécoubé Santé 3 (près cité RAN)</p>
              </div>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-base">map</span>
                Ouvrir dans Google Maps
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
                <input type="text" placeholder="+225 07 00 00 00 00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]" />
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

      {/* 7. MODAL ASSISTANT IA */}
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

      {/* 8. FOOTER FINAL (BLEU NUIT) */}
      <footer className="bg-[#0a2540] text-white text-xs py-12 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-base">
              <span className="material-symbols-outlined text-[#f59e0b]">school</span>
              J.B. de La Salle 2
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
          © 2026 Collège Privé Technique Jean Baptiste de La Salle 2 — DRENA 3 - Abidjan. Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}