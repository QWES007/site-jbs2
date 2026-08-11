import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURATION SUPABASE & CENTRALISÉE DES MÉDIAS
// ============================================================================
const SUPABASE_URL = "https://kwbdawzllmgfsfqpafyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YmRhd3psbG1nZnNmcXBhZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDYyNTksImV4cCI6MjEwMjAyMjI1OX0.HR8WHmAP2QOFN70AEBPN1NGNAw5BqDuuMDYpkqe3rCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600",
  facadeCard: "/facade.jpg",
  generalImage: "/enseignement-general.jpg",
  techniqueImage: "/technique.jpg",
};

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
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  // Modale Préinscription
  const [inscriptionModal, setInscriptionModal] = useState(false);
  const [inscriptionStep, setInscriptionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // État des Activités Supabase
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Mode Administration
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Formulaire d'ajout d'activité
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'fetes',
    date_label: 'Août 2026',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // Chargement des activités depuis Supabase
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const { data, error } = await supabase
        .from('activites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setActivities(data);
    } catch (err) {
      console.error("Erreur chargement activités:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Connexion Admin
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "JBS2Admin2026") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert("Mot de passe incorrect !");
    }
  };

  // Upload et publication d'une activité
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !selectedFile) {
      alert("Veuillez renseigner le titre et sélectionner une photo.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('activites-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('activites-photos')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from('activites').insert([
        {
          title: newActivity.title,
          category: newActivity.category,
          date_label: newActivity.date_label,
          description: newActivity.description,
          image_url: imageUrl,
        }
      ]);

      if (insertError) throw insertError;

      alert("Nouvelle activité publiée avec succès !");
      setNewActivity({ title: '', category: 'fetes', date_label: 'Août 2026', description: '' });
      setSelectedFile(null);
      fetchActivities();
    } catch (err: any) {
      alert("Erreur lors de l'ajout: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Suppression d'une activité
  const handleDeleteActivity = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return;

    try {
      const { error } = await supabase.from('activites').delete().eq('id', id);
      if (error) throw error;
      fetchActivities();
    } catch (err: any) {
      alert("Erreur lors de la suppression: " + err.message);
    }
  };

  const filteredActivities = selectedCategory === 'tous' 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. HEADER RESPONSIVE */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-2.5 shadow-sm">
        <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={MEDIA_CONFIG.logo} alt="Logo JBS2" className="h-8 sm:h-9 w-auto object-contain shrink-0" />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-xs text-[#0a2540] tracking-tight whitespace-nowrap">
                  {SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}
                </span>
                <span className="bg-[#0b3c5d] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                  DRENA 3
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{SCHOOL_INFO.address}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 shrink-0">
            <a href="#accueil" className="text-[#0a2540] border-b-2 border-[#0a2540] pb-1">Accueil</a>
            <a href="#formations" className="hover:text-[#0a2540] transition-colors pb-1">Formations</a>
            <a href="#portails" className="hover:text-[#0a2540] transition-colors pb-1">Portails Numériques</a>
            <a href="#activites" className="hover:text-[#0a2540] transition-colors pb-1">Découverte & Activités</a>
            <a href="#contact" className="hover:text-[#0a2540] transition-colors pb-1">Nous Trouver</a>
          </nav>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0a2540] hover:bg-slate-100 rounded-xl focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden mt-2 pt-2 pb-3 border-t border-slate-100 flex flex-col space-y-1 text-xs font-bold text-slate-700 bg-white px-2 rounded-xl shadow-lg">
            <a href="#accueil" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg text-[#0a2540]">Accueil</a>
            <a href="#formations" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Formations</a>
            <a href="#portails" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Portails Numériques</a>
            <a href="#activites" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Découverte & Activités</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Nous Trouver</a>
          </nav>
        )}
      </header>

      {/* 2. HERO SECTION */}
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
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              L'Excellence Éducative et Technique au Cœur d'Attécoubé
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
              Le <em>{SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}</em> forme les leaders de demain à travers un enseignement général rigoureux et un pôle technique tertiaire de haut niveau au service du développement ivoirien.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#formations" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-sm transition-all">
                <span className="material-symbols-outlined text-base">explore</span>
                Visiter le Collège
              </a>
            </div>

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

      {/* 3. SECTION FORMATIONS & PRÉINSCRIPTION */}
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

            <div className="p-5 pt-0">
              <button 
                onClick={() => openInscriptionWithFiliere('general')}
                className="w-full py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
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

            <div className="p-5 pt-0">
              <button 
                onClick={() => openInscriptionWithFiliere('technique')}
                className="w-full py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                Préinscription (Technique)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PORTAILS NUMÉRIQUES */}
      <section id="portails" className="max-w-7xl mx-auto px-4 lg:px-10 py-8 space-y-6">
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

      {/* 5. DÉCOUVERTE & ACTIVITÉS DYNAMIQUES */}
      <section id="activites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                VIE SCOLAIRE & ACTIVITÉS
              </span>
              {!isAdmin ? (
                <button 
                  onClick={() => setShowAdminLogin(true)} 
                  className="text-[10px] text-slate-400 hover:text-[#0a2540] underline cursor-pointer"
                >
                  (Espace Admin)
                </button>
              ) : (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Mode Administration Actif
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] mt-1">
              Découverte des Activités de l'École
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explorez les moments forts, sorties et célébrations récents au Collège J.B. de La Salle 2.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
            <button onClick={() => setSelectedCategory('tous')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'tous' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Toutes</button>
            <button onClick={() => setSelectedCategory('fetes')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'fetes' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Fêtes & Culture</button>
            <button onClick={() => setSelectedCategory('sports')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'sports' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Sports</button>
            <button onClick={() => setSelectedCategory('pedagogie')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'pedagogie' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Pédagogie & Sorties</button>
          </div>
        </div>

        {/* PANNEAU D'ADMINISTRATION POUR AJOUTER UNE PHOTO */}
        {isAdmin && (
          <div className="bg-amber-50/80 border-2 border-[#f59e0b] p-6 rounded-3xl space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <h3 className="font-extrabold text-sm text-[#0a2540] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f59e0b]">add_a_photo</span>
                Ajouter une nouvelle activité photo
              </h3>
              <button onClick={() => setIsAdmin(false)} className="text-xs text-slate-500 font-bold hover:underline cursor-pointer">Déconnexion Admin</button>
            </div>

            <form onSubmit={handleAddActivity} className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'activité *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Tournoi sportif inter-classes" 
                  value={newActivity.title} 
                  onChange={e => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                <select 
                  value={newActivity.category} 
                  onChange={e => setNewActivity(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold"
                >
                  <option value="fetes">Fêtes & Culture</option>
                  <option value="sports">Sports</option>
                  <option value="pedagogie">Pédagogie & Sorties</option>
                  <option value="vie_scolaire">Vie Scolaire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date (Mois / Année) *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Août 2026" 
                  value={newActivity.date_label} 
                  onChange={e => setNewActivity(prev => ({ ...prev, date_label: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo à importer *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs" 
                  required 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Description / Commentaire</label>
                <textarea 
                  placeholder="Écrivez un court commentaire sur cet événement..." 
                  value={newActivity.description} 
                  onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none h-20"
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading} 
                className="sm:col-span-2 py-3 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {uploading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">publish</span>}
                {uploading ? 'Téléversement en cours...' : 'Publier immédiatement sur le site'}
              </button>
            </form>
          </div>
        )}

        {/* AFFICHAGE DE LA GALERIE PHOTO */}
        {loadingActivities ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
            <p>Chargement des activités de l'école...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            Aucune activité enregistrée dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map(act => (
              <div 
                key={act.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between relative"
              >
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteActivity(act.id)}
                    className="absolute top-3 right-3 z-20 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    title="Supprimer cette photo"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}

                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={act.image_url} 
                      alt={act.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <span className="absolute top-3 left-3 bg-[#0a2540]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      {act.date_label}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base text-[#0a2540] leading-snug group-hover:text-[#047857] transition-colors">
                      {act.title}
                    </h3>
                    {act.description && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => setSelectedPhoto(act)}
                    className="w-full py-2 bg-slate-100 hover:bg-[#0a2540] hover:text-white text-[#0a2540] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">zoom_in</span>
                    <span>Agrandir la photo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL PHOTO AGRANDIE */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
            <button 
              onClick={() => setSelectedPhoto(null)} 
              className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="rounded-2xl overflow-hidden h-72 sm:h-96">
              <img src={selectedPhoto.image_url} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                {selectedPhoto.date_label}
              </span>
              <h3 className="font-extrabold text-lg text-[#0a2540]">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-600">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRÉINSCRIPTION */}
      {inscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a2540] text-white rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">how_to_reg</span>
                </div>
                <div>
                  <span className="bg-emerald-100 text-[#047857] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">PRÉINSCRIPTION 2026-2027</span>
                  <h3 className="font-extrabold text-lg text-[#0a2540]">Formulaire de Préinscription</h3>
                  <p className="text-xs text-slate-500">{SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}</p>
                </div>
              </div>
              <button onClick={() => setInscriptionModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#0a2540]">
                <span>
                  {inscriptionStep === 1 && "Étape 1 : Informations de l'élève"}
                  {inscriptionStep === 2 && "Étape 2 : Frais d'Inscription & Scolarité"}
                  {inscriptionStep === 3 && "Confirmation de Préinscription"}
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
                    placeholder="Ex: 25170040G (Optionnel)" 
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
                  <h4 className="font-bold text-sm text-[#0a2540] border-b pb-2">Récapitulatif de la Préinscription</h4>
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
                  <h4 className="font-extrabold text-lg text-[#0a2540]">Préinscription Enregistrée !</h4>
                  <p className="text-slate-500 max-w-md mx-auto">
                    La préinscription de <strong>{formData.nom} {formData.prenom}</strong> en classe de <strong>{formData.classe}</strong> a été enregistrée avec succès.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2 max-w-md mx-auto">
                  <p className="font-bold text-[#0a2540] border-b pb-1">Bordereau de Préinscription :</p>
                  <p className="flex justify-between"><span>Matricule :</span> <strong>{formData.matricule || 'N/A'}</strong></p>
                  <p className="flex justify-between"><span>Total Frais à Régler :</span> <strong className="text-[#047857]">{currentFees.total.toLocaleString()} FCFA</strong></p>
                  <p className="flex justify-between"><span>Lieu de Dépôt :</span> <strong>Secrétariat J.B. de La Salle 2 (Attécoubé Santé 3)</strong></p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              {inscriptionStep === 2 && (
                <button 
                  onClick={() => setInscriptionStep(1)} 
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Retour
                </button>
              )}

              {inscriptionStep === 1 && (
                <button 
                  onClick={() => setInscriptionStep(2)} 
                  disabled={!formData.nom || !formData.prenom || !formData.etablissementOrigine}
                  className="px-6 py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto disabled:opacity-50 shadow-md cursor-pointer"
                >
                  <span>Étape Suivante (Calcul des Frais)</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              )}

              {inscriptionStep === 2 && (
                <button 
                  onClick={handleReservationSubmit} 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center gap-2 ml-auto shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">how_to_reg</span>
                      <span>Valider la Préinscription</span>
                    </>
                  )}
                </button>
              )}

              {inscriptionStep === 3 && (
                <button 
                  onClick={() => setInscriptionModal(false)} 
                  className="px-6 py-3 bg-[#0a2540] text-white rounded-xl text-xs font-bold ml-auto cursor-pointer"
                >
                  Fermer & Imprimer la Fiche
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL LOGIN ADMIN */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setShowAdminLogin(false)} className="absolute top-3 right-3 text-slate-400 cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center space-y-1">
              <span className="material-symbols-outlined text-3xl text-[#0a2540]">admin_panel_settings</span>
              <h3 className="font-extrabold text-base text-[#0a2540]">Connexion Administrateur</h3>
              <p className="text-xs text-slate-500">Pour ajouter ou supprimer des photos d'activités.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input 
                type="password" 
                placeholder="Mot de passe d'administration..." 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0a2540]"
                required
              />
              <button type="submit" className="w-full py-3 bg-[#0a2540] text-white font-bold text-xs rounded-xl cursor-pointer">
                Se connecter
              </button>
            </form>
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
              <li><a href="#accueil" className="hover:underline">Plan du Site & Accueil</a></li>
              <li><a href="#contact" className="hover:underline">Contact & Secrétariat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#f59e0b] mb-2 uppercase tracking-wider">ACADÉMIQUE</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
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

        <div className="max-w-7xl mx-auto px-4 lg:px-10 mt-8 pt-4 border-t border-white/10 text-center text-slate-400 text-[10px] flex justify-between items-center">
          <span>© 2026 {SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}. Tous droits réservés.</span>
          <button onClick={() => setShowAdminLogin(true)} className="hover:text-white transition-colors cursor-pointer">
            Administration
          </button>
        </div>
      </footer>

    </div>
  );
}