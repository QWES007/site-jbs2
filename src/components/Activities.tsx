import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ActivityItem } from '../types';

const SUPABASE_URL = "https://kwbdawzllmgfsfqpafyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YmRhd3psbG1nZnNmcXBhZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDYyNTksImV4cCI6MjEwMjAyMjI1OX0.HR8WHmAP2QOFN70AEBPN1NGNAw5BqDuuMDYpkqe3rCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ActivitiesProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const Activities: React.FC<ActivitiesProps> = ({ isAdmin, setIsAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityItem | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'pedagogie',
    date_label: 'Août 2026',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const { data, error } = await supabase
        .from('activites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setActivities(data as ActivityItem[]);
    } catch (err) {
      console.error("Erreur chargement activités:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !selectedFile) {
      alert("Veuillez renseigner le titre et sélectionner une photo/document.");
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

      alert("Nouvelle publication enregistrée avec succès !");
      setNewActivity({ title: '', category: 'pedagogie', date_label: 'Août 2026', description: '' });
      setSelectedFile(null);
      fetchActivities();
    } catch (err: any) {
      alert("Erreur lors de l'ajout: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

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
    <section id="activites" className="max-w-7xl mx-auto px-4 lg:px-10 py-12 space-y-8 print:hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#f59e0b] text-[#0a2540] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              VIE SCOLAIRE & ACTIVITÉS
            </span>
            {isAdmin && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Mode Administration Actif
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] mt-1">
            Découverte des Activités de l'École
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explorez les moments forts, calendriers pédagogiques, sorties et événements récents au Collège J.B. de La Salle 2.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
          <button onClick={() => setSelectedCategory('tous')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'tous' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Toutes</button>
          <button onClick={() => setSelectedCategory('pedagogie')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'pedagogie' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Pédagogie & Calendrier</button>
          <button onClick={() => setSelectedCategory('sorties')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'sorties' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Sorties & Visites</button>
          <button onClick={() => setSelectedCategory('fetes')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'fetes' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Fêtes & Culture</button>
          <button onClick={() => setSelectedCategory('sports')} className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'sports' ? 'bg-[#0a2540] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Sports</button>
        </div>
      </div>

      {/* PANNEAU ADMIN */}
      {isAdmin && (
        <div className="bg-amber-50/80 border-2 border-[#f59e0b] p-6 rounded-3xl space-y-4 shadow-md">
          <div className="flex justify-between items-center border-b border-amber-200 pb-3">
            <h3 className="font-extrabold text-sm text-[#0a2540] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f59e0b]">add_a_photo</span>
              Ajouter un élément (Photo, Calendrier, Avis)
            </h3>
            <button onClick={() => setIsAdmin(false)} className="text-xs text-slate-500 font-bold hover:underline cursor-pointer">Déconnexion Admin</button>
          </div>

          <form onSubmit={handleAddActivity} className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Titre de l'élément *</label>
              <input 
                type="text" 
                placeholder="Ex: Calendrier Officiel du 1er Trimestre" 
                value={newActivity.title} 
                onChange={e => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rubrique / Catégorie *</label>
              <select 
                value={newActivity.category} 
                onChange={e => setNewActivity(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-[#0a2540]"
              >
                <option value="pedagogie">📚 Pédagogie & Calendrier (Dates, Congés, Examens)</option>
                <option value="sorties">🚌 Sorties & Visites d'Entreprises</option>
                <option value="fetes">🎉 Fêtes & Culture</option>
                <option value="sports">🏆 Sports & Compétitions</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date (Mois / Année) *</label>
              <input 
                type="text" 
                placeholder="Ex: Année 2026-2027 ou Septembre 2026" 
                value={newActivity.date_label} 
                onChange={e => setNewActivity(prev => ({ ...prev, date_label: e.target.value }))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Image / Affiche à importer *</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs" 
                required 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Description / Précisions</label>
              <textarea 
                placeholder="Écrivez des précisions (ex: dates de début et de fin des congés de Toussaint...)" 
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

      {/* GALERIE */}
      {loadingActivities ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
          <p>Chargement des activités de l'école...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Aucun élément disponible dans cette rubrique pour le moment.
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
                  title="Supprimer cet élément"
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
                  <span>Agrandir l'image</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AGRANDISSEMENT */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:hidden">
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
    </section>
  );
};