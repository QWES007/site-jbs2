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

interface GroupedActivity {
  key: string;
  title: string;
  category: string;
  date_label: string;
  description: string;
  images: { id: number; url: string }[];
}

export const Activities: React.FC<ActivitiesProps> = ({ isAdmin, setIsAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedGroup, setSelectedGroup] = useState<GroupedActivity | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'pedagogie',
    date_label: 'Septembre 2026',
    description: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

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
    if (!newActivity.title || !selectedFiles || selectedFiles.length === 0) {
      alert("Veuillez renseigner le titre et sélectionner au moins une photo ou un document PDF.");
      return;
    }

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('activites-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('activites-photos')
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        const { error: insertError } = await supabase.from('activites').insert([
          {
            title: newActivity.title.trim(),
            category: newActivity.category,
            date_label: newActivity.date_label,
            description: newActivity.description,
            image_url: imageUrl,
          }
        ]);

        if (insertError) throw insertError;
      }

      alert(`${selectedFiles.length} fichier(s) publié(s) avec succès !`);
      setNewActivity({ title: '', category: 'pedagogie', date_label: 'Septembre 2026', description: '' });
      setSelectedFiles(null);
      fetchActivities();
    } catch (err: any) {
      alert("Erreur lors de l'ajout: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGroup = async (group: GroupedActivity) => {
    if (!window.confirm(`Voulez-vous supprimer l'événement "${group.title}" et toutes ses photos (${group.images.length}) ?`)) return;

    try {
      const idsToDelete = group.images.map(img => img.id);
      const { error } = await supabase.from('activites').delete().in('id', idsToDelete);
      if (error) throw error;
      fetchActivities();
    } catch (err: any) {
      alert("Erreur lors de la suppression: " + err.message);
    }
  };

  const isPdfFile = (url: string) => {
    return url?.toLowerCase().endsWith('.pdf') || url?.includes('.pdf?');
  };

  // Regroupement automatique par Titre + Nettoyage des suffixes (1/3)
  const groupedActivities: GroupedActivity[] = React.useMemo(() => {
    const map = new Map<string, GroupedActivity>();

    activities.forEach(item => {
      // Nettoie les anciens titres du type "Titre (1/3)" pour regrouper sous un seul événement
      const cleanTitle = item.title.replace(/\s*\(\d+\/\d+\)$/, '').trim();
      const key = `${cleanTitle}_${item.category}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          title: cleanTitle,
          category: item.category,
          date_label: item.date_label,
          description: item.description,
          images: [{ id: item.id, url: item.image_url }]
        });
      } else {
        const group = map.get(key)!;
        group.images.push({ id: item.id, url: item.image_url });
      }
    });

    return Array.from(map.values());
  }, [activities]);

  const filteredGroups = selectedCategory === 'tous' 
    ? groupedActivities 
    : groupedActivities.filter(g => g.category === selectedCategory);

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
            Découverte des Activités & Documents de l'École
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explorez les moments forts, arrêtés officiels, calendriers pédagogiques, sorties et événements au Collège J.B. de La Salle 2.
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
              Ajout Multiple d'images pour une Activité
            </h3>
            <button onClick={() => setIsAdmin(false)} className="text-xs text-slate-500 font-bold hover:underline cursor-pointer">Déconnexion Admin</button>
          </div>

          <form onSubmit={handleAddActivity} className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Titre de l'activité / Événement *</label>
              <input 
                type="text" 
                placeholder="Ex: Participation de nos élèves à l'Africa space expo" 
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
                <option value="pedagogie">📚 Pédagogie & Calendrier (Dates, Congés, Examens, Arrêtés)</option>
                <option value="sorties">🚌 Sorties & Visites d'Entreprises</option>
                <option value="fetes">🎉 Fêtes & Culture</option>
                <option value="sports">🏆 Sports & Compétitions</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date (Mois / Année) *</label>
              <input 
                type="text" 
                placeholder="Ex: Septembre 2026" 
                value={newActivity.date_label} 
                onChange={e => setNewActivity(prev => ({ ...prev, date_label: e.target.value }))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Photos ou PDF (Sélectionnez plusieurs photos) *</label>
              <input 
                type="file" 
                multiple
                accept="image/*,.pdf,application/pdf"
                onChange={e => setSelectedFiles(e.target.files ? Array.from(e.target.files) : null)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0a2540] file:text-white hover:file:bg-[#061726] cursor-pointer" 
                required 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Description / Précisions</label>
              <textarea 
                placeholder="Écrivez des précisions sur cet événement..." 
                value={newActivity.description} 
                onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none h-20"
              />
            </div>

            <button 
              type="submit" 
              disabled={uploading} 
              className="sm:col-span-2 py-3 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {uploading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">publish</span>}
              {uploading ? 'Téléversement en cours...' : 'Publier cet événement'}
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
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Aucun élément disponible dans cette rubrique pour le moment.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => {
            const firstMedia = group.images[0].url;
            const isPdf = isPdfFile(firstMedia);
            const totalImages = group.images.length;

            return (
              <div 
                key={group.key} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between relative"
              >
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteGroup(group)}
                    className="absolute top-3 right-3 z-20 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    title="Supprimer cet événement complet"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}

                <div>
                  {/* Photo principale */}
                  <div className="relative h-40 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {isPdf ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center border-b border-red-100">
                        <span className="material-symbols-outlined text-4xl text-red-600 mb-1 drop-shadow-sm">picture_as_pdf</span>
                        <span className="text-[9px] font-extrabold text-red-700 uppercase tracking-wider bg-white/90 px-2.5 py-0.5 rounded-full shadow-sm">
                          Document Officiel PDF
                        </span>
                      </div>
                    ) : (
                      <img 
                        src={firstMedia} 
                        alt={group.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => { setSelectedGroup(group); setActiveImageIndex(0); }}
                      />
                    )}

                    <span className="absolute top-2.5 left-2.5 z-10 bg-[#0a2540]/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-1 rounded uppercase shadow">
                      {group.date_label}
                    </span>

                    {/* Badge indiquant le nombre de photos */}
                    {!isPdf && totalImages > 1 && (
                      <span className="absolute bottom-2.5 right-2.5 z-10 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-xs">photo_library</span>
                        {totalImages} photos
                      </span>
                    )}
                  </div>

                  {/* Galerie de miniatures si plus d'une photo */}
                  {!isPdf && totalImages > 1 && (
                    <div className="flex gap-1.5 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto">
                      {group.images.slice(0, 4).map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => { setSelectedGroup(group); setActiveImageIndex(idx); }}
                          className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 hover:opacity-80 transition-opacity"
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          {idx === 3 && totalImages > 4 && (
                            <div className="absolute inset-0 bg-black/60 text-white font-extrabold text-[10px] flex items-center justify-center">
                              +{totalImages - 4}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base text-[#0a2540] leading-snug group-hover:text-[#047857] transition-colors">
                      {group.title}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {isPdf ? (
                    <a 
                      href={firstMedia} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Ouvrir / Télécharger le PDF</span>
                    </a>
                  ) : (
                    <button 
                      onClick={() => { setSelectedGroup(group); setActiveImageIndex(0); }}
                      className="w-full py-2 bg-slate-100 hover:bg-[#0a2540] hover:text-white text-[#0a2540] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">collections</span>
                      <span>{totalImages > 1 ? `Voir l'album (${totalImages} photos)` : "Agrandir l'image"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL AGRANDISSEMENT ET CARROUSEL DES PHOTOS DE L'ÉVÉNEMENT */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden flex flex-col">
            <button 
              onClick={() => setSelectedGroup(null)} 
              className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black cursor-pointer z-20"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Visionneuse Image principale avec navigation */}
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-[400px] bg-slate-900 flex items-center justify-center">
              {isPdfFile(selectedGroup.images[activeImageIndex].url) ? (
                <div className="text-center p-6 space-y-4 text-white">
                  <span className="material-symbols-outlined text-6xl text-red-500">picture_as_pdf</span>
                  <div>
                    <h4 className="font-bold text-base">{selectedGroup.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">Ce document est un fichier PDF consultable directement.</p>
                  </div>
                  <a 
                    href={selectedGroup.images[activeImageIndex].url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    Ouvrir le document PDF complet
                  </a>
                </div>
              ) : (
                <img 
                  src={selectedGroup.images[activeImageIndex].url} 
                  alt={selectedGroup.title} 
                  className="w-full h-full object-contain" 
                />
              )}

              {/* Boutons Suivant / Précédent s'il y a plusieurs photos */}
              {selectedGroup.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedGroup.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev < selectedGroup.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </>
              )}
            </div>

            {/* Bande de miniatures dans la modale */}
            {selectedGroup.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {selectedGroup.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#047857] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                  {selectedGroup.date_label}
                </span>
                {selectedGroup.images.length > 1 && (
                  <span className="text-xs text-slate-500 font-bold">
                    Photo {activeImageIndex + 1} sur {selectedGroup.images.length}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-lg text-[#0a2540]">{selectedGroup.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedGroup.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};