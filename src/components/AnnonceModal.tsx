'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ajustez le chemin selon votre projet

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
      // Récupérer la dernière annonce active de type 'popup'
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

      {/* Fond sombre */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        {/* Boîte de la pop-up */}
        <div 
          className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>

          {/* Contenu dynamique venu de Supabase */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{annonce.titre}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">{annonce.contenu}</p>

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Fermer
          </button>
        </div>
      </div>
  );
}