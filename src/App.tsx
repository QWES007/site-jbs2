import React, { useState } from 'react';

// --- DONNÉES STATIQUES DU COLLÈGE ---
const SCHOOL_INFO = {
  name: "Collège Privé Technique Jean Baptiste de La Salle 2",
  shortName: "J.B. de La Salle 2",
  city: "Abidjan",
  district: "Attécoubé Santé 3",
  drena: "DRENA 3 Abidjan",
  bepcPassRate: "94.8%",
  bacPassRate: "91.2%",
  totalStudents: "1,450+",
  phone1: "+225 07 00 00 00 01",
  phone2: "+225 05 00 00 00 02",
  email: "contact@lasalle2-attecoube.ci",
  logoUrl: "/logo.png", // <--- Fichier logo placé dans public/
  heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
  generalImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000",
  technicalImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
};

const FORMATIONS_DATA = {
  general: {
    title: "Enseignement Général",
    badge: "Premier & Second Cycle",
    subtitle: "Collège & Lycée Général (6ème à la Terminale A & D)",
    heroImage: SCHOOL_INFO.generalImage,
    description: "Une formation académique rigoureuse axée sur la maîtrise des sciences, des lettres et des langues pour préparer sereinement le BEPC et les BAC A & D.",
  },
  technique: {
    title: "Technique Tertiaire",
    badge: "Pôle Professionnel G1 & G2",
    subtitle: "Secrétariat & Comptabilité (2nde à la Terminale G1 & G2)",
    heroImage: SCHOOL_INFO.technicalImage,
    description: "Formation professionnelle d'excellence préparant aux métiers de la gestion d'entreprise, du secrétariat de direction et de la comptabilité générale (SYSCOHADA).",
  }
};

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'assistant', text: 'Bonjour ! Je suis l\'Assistant Virtuel Officiel de Jean Baptiste de La Salle 2. Posez-moi vos questions sur nos séries, nos tarifs ou les inscriptions !' }
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
        text: 'Merci pour votre message ! Pour toute information complémentaire, le secrétariat à Attécoubé Santé 3 reste joignable au +225 07 00 00 00 01.'
      }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] font-sans">
      {/* Header avec Logo */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src={SCHOOL_INFO.logoUrl} 
            alt="Logo Collège JBS2" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <span className="font-extrabold text-lg text-[#002046] block leading-tight">{SCHOOL_INFO.shortName}</span>
            <p className="text-xs text-gray-500">{SCHOOL_INFO.district} • {SCHOOL_INFO.drena}</p>
          </div>
        </div>

        <button 
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffe088] text-[#4e3d00] hover:bg-[#cba72f] hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base">smart_toy</span>
          <span>Assistant IA</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center bg-[#002046] text-white px-4 sm:px-12 py-12">
        <div className="max-w-3xl space-y-4 z-10">
          <span className="px-3 py-1 bg-[#cba72f] text-[#241a00] text-xs font-extrabold rounded-full uppercase tracking-wider">
            Établissement d'Excellence • DRENA 3
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            L'Excellence Éducative et Technique au Cœur d'Attécoubé
          </h1>
          <p className="text-gray-200 text-sm sm:text-base font-serif leading-relaxed">
            Le Collège Privé Technique Jean Baptiste de La Salle 2 forme les leaders de demain à travers un enseignement général rigoureux et un pôle technique tertiaire de haut niveau.
          </p>
        </div>
      </section>

      {/* Formations */}
      <section className="py-12 px-4 sm:px-12 max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#002046]">Nos Formations</h2>
          <div className="h-1 w-16 bg-[#cba72f] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(FORMATIONS_DATA).map(([key, data]) => (
            <div key={key} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={data.heroImage} alt={data.title} className="w-full h-48 object-cover" />
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold text-[#046c50] uppercase">{data.badge}</span>
                <h3 className="text-xl font-bold text-[#002046]">{data.title}</h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal IA */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full h-[500px] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#002046] text-white flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#ffe088]">smart_toy</span>
                Assistant IA Lasallien
              </span>
              <button onClick={() => setAiOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa] text-xs">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-[#002046] text-white' : 'bg-white border text-gray-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t flex gap-2">
              <input 
                type="text" 
                placeholder="Posez votre question..." 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs outline-none" 
              />
              <button onClick={handleSend} className="p-2 bg-[#002046] text-white rounded-xl">
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#002046] text-white text-center py-6 text-xs border-t border-white/10">
        © 2026 {SCHOOL_INFO.name} — {SCHOOL_INFO.drena}. Tous droits réservés.
      </footer>
    </div>
  );
}