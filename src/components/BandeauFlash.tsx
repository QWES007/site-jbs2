import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SCHOOL_INFO } from '../config/school';

export function BandeauFlash() {
  const [texte, setTexte] = useState<string>(SCHOOL_INFO.announcementText);

  useEffect(() => {
    async function fetchBandeau() {
      try {
        if (!supabase) return;

        // Requête nettoyée sans conflit entre limit() et maybeSingle()
        const { data, error } = await supabase
          .from('annonces')
          .select('contenu')
          .eq('actif', true)
          .eq('type', 'bandeau')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (error) {
          console.error("Erreur Supabase Bandeau :", error.message);
          return;
        }

        if (data?.contenu) {
          setTexte(data.contenu);
        }
      } catch (err) {
        console.error('Erreur inattendue Bandeau :', err);
      }
    }

    fetchBandeau();
  }, []);

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