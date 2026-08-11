import React, { useState } from 'react';
import { Student } from './types';
import { calculateSchoolFees, SCHOOL_INFO, MEDIA_CONFIG } from './config/school';

import { PrintSheet } from './components/PrintSheet';
import { BulletinSearch } from './components/BulletinSearch';
import { InscriptionModal } from './components/InscriptionModal';
import { Activities } from './components/Activities';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inscriptionModal, setInscriptionModal] = useState(false);
  const [referenceNum, setReferenceNum] = useState('');

  // Mode Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [formData, setFormData] = useState<Student>({
    matricule: '',
    nom: '',
    prenom: '',
    classe: '6ème',
    statut: 'affecte',
    etablissementOrigine: '',
    mga: '',
    filiere: 'general',
  });

  const openInscriptionWithFiliere = (filiere: 'general' | 'technique') => {
    setFormData(prev => ({ 
      ...prev, 
      filiere, 
      classe: filiere === 'general' ? '6ème' : '2nd AB'
    }));
    setInscriptionModal(true);
  };

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

  const currentFees = calculateSchoolFees(formData.classe, formData.statut);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1e293b] font-sans antialiased">
      
      {/* 1. IMPRESSION A4 (Isolée) */}
      <PrintSheet 
        formData={formData} 
        currentFees={currentFees} 
        referenceNum={referenceNum} 
      />

      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-2.5 shadow-sm print:hidden">
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

      {/* 3. HERO SECTION */}
      <section id="accueil" className="relative bg-[#0a2540] text-white overflow-hidden py-10 lg:py-14 px-4 lg:px-12 print:hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none"
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
            </div>
          </div>
        </div>
      </section>

      {/* 4. FORMATIONS */}
      <section id="formations" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8 print:hidden">
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
                  De la 6ème à la Terminale. Un encadrement pédagogique d'élite pour la réussite aux examens nationaux.
                </p>
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
                  Formations professionnalisantes en G1, G2, Série B / AB.
                </p>
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

      {/* 5. PORTAILS NUMÉRIQUES & BULLETIN */}
      <section id="portails" className="max-w-7xl mx-auto px-4 lg:px-10 py-8 space-y-6 print:hidden">
        <BulletinSearch />
      </section>

      {/* 6. DÉCOUVERTE & ACTIVITÉS */}
      <Activities isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      {/* MODAL PRÉINSCRIPTION */}
      {inscriptionModal && (
        <InscriptionModal 
          formData={formData}
          setFormData={setFormData}
          currentFees={currentFees}
          onClose={() => setInscriptionModal(false)}
          onSuccess={(ref) => setReferenceNum(ref)}
        />
      )}

      {/* MODAL LOGIN ADMIN */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setShowAdminLogin(false)} className="absolute top-3 right-3 text-slate-400 cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center space-y-1">
              <span className="material-symbols-outlined text-3xl text-[#0a2540]">admin_panel_settings</span>
              <h3 className="font-extrabold text-base text-[#0a2540]">Connexion Administrateur</h3>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input 
                type="password" 
                placeholder="Mot de passe d'administration..." 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                required
              />
              <button type="submit" className="w-full py-3 bg-[#0a2540] text-white font-bold text-xs rounded-xl cursor-pointer">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0a2540] text-white text-xs py-10 border-t border-white/10 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex justify-between items-center text-slate-400 text-[10px]">
          <span>© 2026 {SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}. Tous droits réservés.</span>
          <button onClick={() => setShowAdminLogin(true)} className="hover:text-white transition-colors cursor-pointer">
            Administration
          </button>
        </div>
      </footer>

    </div>
  );
}