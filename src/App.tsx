import React, { useState } from 'react';

// ============================================================================
// CONFIGURATION CENTRALISÉE DES MÉDIAS (PHOTOS & LOGO)
// Facile à modifier / ajouter / supprimer par la suite !
// ============================================================================
const MEDIA_CONFIG = {
  logo: "/logo.png",
  
  // Photos de couverture / Hero
  heroBanner: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
  
  // Photos des pôles de formation
  generalSection: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
  technicalSection: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",

  // Galerie photo dynamique (Modifiable facilement)
  gallery: [
    { id: 1, title: "Salles de cours Enseignement Général", src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Atelier Bureautique & Comptabilité", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Vie Scolaire & Activités", src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" },
  ]
};

// ============================================================================
// INFORMATIONS DU COLLÈGE
// ============================================================================
const SCHOOL_INFO = {
  name: "Collège Privé Technique Jean Baptiste de La Salle 2",
  shortName: "J.B. de La Salle 2",
  tagline: "Discipline • Travail • Excellence",
  city: "Abidjan",
  district: "Attécoubé Santé 3",
  drena: "DRENA 3 Abidjan",
  bepcPassRate: "94.8%",
  bacPassRate: "91.2%",
  totalStudents: "1,450+",
  phone1: "+225 07 00 00 00 01",
  phone2: "+225 05 00 00 00 02",
  email: "contact@lasalle2-attecoube.ci",
};

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'assistant', text: 'Bonjour ! Je suis l\'Assistant Virtuel du Collège J.B. de La Salle 2. Comment puis-je vous aider aujourd\'hui (inscriptions, séries G1/G2, second cycle) ?' }
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
        text: 'Merci pour votre message. Le secrétariat d\'Attécoubé Santé 3 est à votre disposition pour concrétiser votre inscription !'
      }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ------------------- HEADER ------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src={MEDIA_CONFIG.logo} 
            alt="Logo Collège JBS2" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <span className="font-extrabold text-lg text-[#002046] block leading-tight">{SCHOOL_INFO.shortName}</span>
            <p className="text-xs text-slate-500">{SCHOOL_INFO.district} • {SCHOOL_INFO.drena}</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
          <a href="#general" className="hover:text-[#002046] transition-colors">Enseignement Général</a>
          <a href="#technique" className="hover:text-[#002046] transition-colors">Pôle Technique G1/G2</a>
          <a href="#galerie" className="hover:text-[#002046] transition-colors">Galerie</a>
          <a href="#contact" className="hover:text-[#002046] transition-colors">Contact</a>
        </nav>

        <button 
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#cba72f] text-white hover:bg-[#b59324] rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base">smart_toy</span>
          <span>Assistant IA</span>
        </button>
      </header>

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="relative bg-[#002046] text-white px-6 sm:px-12 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-[#cba72f] text-[#002046] text-xs font-black uppercase rounded-full tracking-wider">
            {SCHOOL_INFO.tagline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Collège Privé Technique <br className="hidden sm:inline"/>Jean Baptiste de La Salle 2
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
            Formation rigoureuse et encadrement pédagogique de premier ordre à Attécoubé Santé 3. Préparation aux diplômes nationaux (BEPC, BAC A, D, G1, G2).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
            <div>
              <span className="text-2xl font-black text-[#cba72f]">{SCHOOL_INFO.bepcPassRate}</span>
              <p className="text-xs text-slate-300">Taux de réussite BEPC</p>
            </div>
            <div>
              <span className="text-2xl font-black text-[#cba72f]">{SCHOOL_INFO.bacPassRate}</span>
              <p className="text-xs text-slate-300">Taux de réussite BAC</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-2xl font-black text-[#cba72f]">{SCHOOL_INFO.totalStudents}</span>
              <p className="text-xs text-slate-300">Élèves formés</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- OFFRES DE FORMATION ------------------- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        
        {/* Section Général */}
        <section id="general" className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#002046] uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg">Premier & Second Cycle</span>
            <h2 className="text-2xl font-bold text-[#002046]">Enseignement Général</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              De la 6ème à la Terminale (Séries A & D). Un suivi rigoureux axé sur la maîtrise des connaissances académiques et la réussite aux examens d'État.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 pt-2">
              <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Premier Cycle : 6ème, 5ème, 4ème, 3ème (BEPC)</li>
              <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Second Cycle Littéraire : Séries A1 & A2</li>
              <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Second Cycle Scientifique : Série D</li>
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden h-64 border border-slate-100 bg-slate-100">
            <img src={MEDIA_CONFIG.generalSection} alt="Enseignement Général" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Section Technique */}
        <section id="technique" className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden h-64 border border-slate-100 bg-slate-100">
            <img src={MEDIA_CONFIG.technicalSection} alt="Pôle Technique" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <span className="text-xs font-bold text-[#cba72f] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-lg">Pôle Tertiaire</span>
            <h2 className="text-2xl font-bold text-[#002046]">Technique Tertiaire (G1 & G2)</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Formation professionnelle d'excellence préparant directement aux diplômes techniques et aux métiers de la gestion et du secrétariat.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 pt-2">
              <li className="flex items-center gap-2"><span className="text-amber-600 font-bold">★</span> <strong>Série G1 :</strong> Secrétariat de Direction & Bureautique</li>
              <li className="flex items-center gap-2"><span className="text-amber-600 font-bold">★</span> <strong>Série G2 :</strong> Comptabilité & Gestion d'Entreprise</li>
            </ul>
          </div>
        </section>

        {/* ------------------- GALERIE PHOTOS DYNAMIQUE ------------------- */}
        <section id="galerie" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[#002046]">Vie de l'Établissement</h2>
            <p className="text-xs text-slate-500">Aperçu du cadre de travail et des infrastructures</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {MEDIA_CONFIG.gallery.map((photo) => (
              <div key={photo.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-slate-100">
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-[#002046]">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ------------------- MODAL ASSISTANT IA ------------------- */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full h-[520px] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-4 bg-[#002046] text-white flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#cba72f]">smart_toy</span>
                Assistant IA Lasallien
              </span>
              <button onClick={() => setAiOpen(false)} className="hover:opacity-75"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-[#002046] text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
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
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#002046]" 
              />
              <button onClick={handleSend} className="p-2.5 bg-[#002046] text-white rounded-xl hover:bg-[#001733] transition-colors">
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- FOOTER ------------------- */}
      <footer id="contact" className="bg-[#002046] text-white text-xs py-8 border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <p className="font-bold text-sm">{SCHOOL_INFO.name}</p>
            <p className="text-slate-400 mt-1">{SCHOOL_INFO.district} — {SCHOOL_INFO.drena}</p>
          </div>
          <div className="sm:text-right space-y-1 text-slate-300">
            <p>Contacts : {SCHOOL_INFO.phone1} / {SCHOOL_INFO.phone2}</p>
            <p>© 2026 Tous droits réservés.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}