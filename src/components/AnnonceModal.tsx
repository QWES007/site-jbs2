'use client';

import { useEffect, useState } from 'react';
// ✅ Import avec le bon chemin vers le dossier lib à la racine
import { supabase } from '../../lib/supabaseClient';

interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  type: string;
  actif: boolean;
}

export default function AnnonceModal() {
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchAnnonce() {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('actif', true)
        .eq('type', 'popup')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setAnnonce(data);
        setIsOpen(true);
      }
    }

    fetchAnnonce();
  }, []);

  if (!isOpen || !annonce) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-slate-800 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors cursor-pointer font-bold"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* En-tête Pop-up */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-amber-100 text-[#f59e0b] rounded-2xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">campaign</span>
          </div>
          <div>
            <span className="bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
              INFORMATION OFFICIELLE
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-[#0a2540] mt-1">
              {annonce.titre}
            </h3>
          </div>
        </div>

        {/* Contenu de l'annonce */}
        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="whitespace-pre-line">{annonce.contenu}</p>
        </div>

        {/* Bouton de validation */}
        <button 
          onClick={() => setIsOpen(false)}
          className="w-full py-3.5 bg-[#0a2540] hover:bg-[#061726] text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
}