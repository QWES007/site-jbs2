import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Ajusté selon la position de votre dossier lib à la racine

export default function Galerie() {
  // 1. Vos images statiques (directement dans le dossier public)
  const imagesStatiques = [
    { id: 'stat-1', type: 'image', title: 'Vue de la façade', url: '/facade.jpg' },
    { id: 'stat-2', type: 'image', title: 'Enseignement général', url: '/enseignement-general.jpg' },
  ];

  // 2. État pour stocker les éléments dynamiques (PDFs ou autres depuis Supabase)
  const [elementsDynamiques, setElementsDynamiques] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Récupération des documents/PDFs depuis votre table Supabase
      const { data, error } = await supabase.from('documents').select('*');
      if (!error && data) {
        setElementsDynamiques(data);
      }
    }
    fetchData();
  }, []);

  // On combine les deux listes pour les afficher ensemble
  const tousLesElements = [...imagesStatiques, ...elementsDynamiques];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Galerie & Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tousLesElements.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

            {item.type === 'image' ? (
              // Affichage de l'image statique du dossier public
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              // Affichage pour les fichiers PDF de la base de données
              <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-md border border-dashed">
                <span className="text-sm text-gray-500 mb-3">Document Officiel (PDF)</span>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Télécharger le PDF
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}