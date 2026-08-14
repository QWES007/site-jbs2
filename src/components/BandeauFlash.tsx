import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function BandeauFlash() {
  // On initialise à null pour ne rien afficher par défaut
  const [texte, setTexte] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBandeau() {
      try {
        if (!supabase) return;

        const { data, error } = await supabase
          .from('annonces')
          .select('contenu')
          .eq('actif', true)
          .eq('type', 'bandeau')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (error) {
          console.error("Erreur Supabase Bandeau :", error.message);
          setTexte(null);
          return;
        }

        // Si une annonce active existe, on met à jour le texte, sinon on repasse à null
        if (data?.contenu) {
          setTexte(data.contenu);
        } else {
          setTexte(null);
        }
      } catch (err) {
        console.error('Erreur inattendue Bandeau :', err);
        setTexte(null);
      }
    }

    fetchBandeau();
  }, []);

  // Si aucun texte actif n'est trouvé dans Supabase, le composant ne rend RIEN (disparition totale)
  if (!texte) return null;

  return (
    <div className="bg-[#f59e0b] text-[#0a2540] py-2 px-4 overflow-hidden whitespace-nowrap shadow-inner border-b border-amber-600/20 print:hidden flex items-center">
      <div className="flex items-center gap-2 bg-[#0a2540] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase shrink-0 z-10 shadow-sm mr-3">
        <span className="material-symbols-outlined text-xs text-[#f59e0b] animate-pulse">campaign</span>
        Flash Info
      </div>
      <div className="inline-block animate-marquee text-xs font-bold tracking-wide">
        <span className="mx-4">{texte}</span>
        <span className="mx-4">{texte}</span>
      </div>
    </div>
  );
}