import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Student, FeeStructure } from '../types';
import { SCHOOL_INFO } from '../config/school';

const SUPABASE_URL = "https://kwbdawzllmgfsfqpafyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YmRhd3psbG1nZnNmcXBhZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDYyNTksImV4cCI6MjEwMjAyMjI1OX0.HR8WHmAP2QOFN70AEBPN1NGNAw5BqDuuMDYpkqe3rCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface InscriptionModalProps {
  formData: Student;
  setFormData: React.Dispatch<React.SetStateAction<Student>>;
  currentFees: FeeStructure;
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

export const InscriptionModal: React.FC<InscriptionModalProps> = ({
  formData,
  setFormData,
  currentFees,
  onClose,
  onSuccess,
}) => {
  const [inscriptionStep, setInscriptionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNum, setReferenceNum] = useState('');

  const handleReservationSubmit = async () => {
    setIsSubmitting(true);
    const generatedRef = `JBS2-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNum(generatedRef);
    onSuccess(generatedRef);

    try {
      const { error } = await supabase.from('preinscriptions').insert([
        {
          matricule: formData.matricule || null,
          nom: formData.nom,
          prenom: formData.prenom,
          classe: formData.classe,
          statut: formData.statut,
          etablissement_origine: formData.etablissementOrigine,
          mga: formData.mga || null,
          filiere: formData.filiere,
          frais_inscription: currentFees.inscription,
          frais_scolarite: currentFees.scolarite,
          frais_total: currentFees.total,
        }
      ]);

      if (error) throw error;
      setInscriptionStep(3);
    } catch (err: any) {
      alert("Erreur lors de l'enregistrement de la préinscription: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a2540] text-white rounded-xl flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>
            <div>
              <span className="bg-emerald-100 text-[#047857] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">PRÉINSCRIPTION 2026-2027</span>
              <h3 className="font-extrabold text-lg text-[#0a2540]">Formulaire de Préinscription</h3>
              <p className="text-xs text-slate-500">{SCHOOL_INFO.fullNamePart1} {SCHOOL_INFO.fullNamePart2}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#0a2540]">
            <span>
              {inscriptionStep === 1 && "Étape 1 : Informations de l'élève"}
              {inscriptionStep === 2 && "Étape 2 : Frais d'Inscription & Scolarité"}
              {inscriptionStep === 3 && "Confirmation & Impression"}
            </span>
            <span>{inscriptionStep === 1 ? '50%' : '100%'}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#047857] transition-all duration-300" style={{ width: inscriptionStep === 1 ? '50%' : '100%' }} />
          </div>
        </div>

        {inscriptionStep === 1 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#047857]">badge</span>
              Informations de l'Élève Candidate :
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Matricule de l'élève (si attribué)</label>
              <input 
                type="text" 
                placeholder="Ex: 25170040G (Optionnel)" 
                value={formData.matricule} 
                onChange={e => setFormData(prev => ({ ...prev, matricule: e.target.value }))} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom de l'Élève *</label>
                <input 
                  type="text" 
                  placeholder="Ex: KOUASSI" 
                  value={formData.nom} 
                  onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prénom(s) de l'Élève *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Jean-Marc Emmanuel" 
                  value={formData.prenom} 
                  onChange={e => setFormData(prev => ({ ...prev, prenom: e.target.value }))} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-medium" 
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Classe Sollicitée *</label>
              <select 
                value={formData.classe} 
                onChange={e => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-[#0a2540]"
              >
                <optgroup label="Enseignement Général">
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nd A">2nd A</option>
                  <option value="2nd C">2nd C</option>
                  <option value="1ère A2">1ère A2</option>
                  <option value="1ère D">1ère D</option>
                  <option value="Tle A2">Tle A2</option>
                  <option value="Tle D">Tle D</option>
                </optgroup>
                <optgroup label="Technique Tertiaire">
                  <option value="2nd AB">2nd AB</option>
                  <option value="2nd G1">2nd G1</option>
                  <option value="2nd G2">2nd G2</option>
                  <option value="1ère B">1ère B</option>
                  <option value="1ère G1">1ère G1</option>
                  <option value="1ère G2">1ère G2</option>
                  <option value="Tle B">Tle B</option>
                  <option value="Tle G1">Tle G1</option>
                  <option value="Tle G2">Tle G2</option>
                </optgroup>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
              <span className="font-bold text-slate-700">Statut de l'Élève :</span>
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <label className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition-all ${formData.statut === 'affecte' ? 'border-[#047857] bg-emerald-50/60 font-bold text-[#047857]' : 'border-slate-200'}`}>
                  <input 
                    type="radio" 
                    name="statut" 
                    checked={formData.statut === 'affecte'} 
                    onChange={() => setFormData(prev => ({ ...prev, statut: 'affecte' }))} 
                  />
                  <span>Affecté de l'État (DRENA 3)</span>
                </label>

                <label className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition-all ${formData.statut === 'non_affecte' ? 'border-[#0a2540] bg-slate-100 font-bold text-[#0a2540]' : 'border-slate-200'}`}>
                  <input 
                    type="radio" 
                    name="statut" 
                    checked={formData.statut === 'non_affecte'} 
                    onChange={() => setFormData(prev => ({ ...prev, statut: 'non_affecte' }))} 
                  />
                  <span>Non-affecté / Inscription Libre</span>
                </label>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Établissement d'Origine *</label>
                <input 
                  type="text" 
                  placeholder="Ex: EPP Attécoubé 1 ou Collège X" 
                  value={formData.etablissementOrigine} 
                  onChange={e => setFormData(prev => ({ ...prev, etablissementOrigine: e.target.value }))} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540]" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Moyenne de Fin d'Année (MGA) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  placeholder="Ex: 14.25 / 20" 
                  value={formData.mga} 
                  onChange={e => setFormData(prev => ({ ...prev, mga: e.target.value }))} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0a2540] font-bold text-[#047857]" 
                />
              </div>
            </div>

          </div>
        )}

        {inscriptionStep === 2 && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-sm text-[#0a2540] border-b pb-2">Récapitulatif de la Préinscription</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p>Candidate : <strong className="text-slate-800">{formData.nom || '—'} {formData.prenom}</strong></p>
                <p>Classe : <strong className="text-[#047857]">{formData.classe}</strong></p>
                <p>Statut : <strong>{formData.statut === 'affecte' ? "Affecté de l'État" : "Non-affecté / Inscription Libre"}</strong></p>
                <p>MGA : <strong className="text-[#047857]">{formData.mga ? `${formData.mga} / 20` : '—'}</strong></p>
                <p className="col-span-2">Établissement d'Origine : <strong>{formData.etablissementOrigine || '—'}</strong></p>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#047857] font-extrabold text-sm">
                <span className="material-symbols-outlined">payments</span>
                <span>Détail des Frais d'Inscription & Scolarité</span>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-slate-600">Frais d'Inscription & Dossier :</span>
                  <span className="font-bold text-slate-800">{currentFees.inscription.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between items-center border-b pb-2 pt-1">
                  <span className="font-semibold text-slate-600">Frais de Scolarité Annuelle :</span>
                  <span className="font-bold text-slate-800">{currentFees.scolarite.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between items-center pt-2 text-sm font-black text-[#0a2540]">
                  <span>MONTANT TOTAL À PAYER :</span>
                  <span className="text-base text-[#047857] bg-emerald-100 px-3 py-1 rounded-lg">
                    {currentFees.total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-white/50 p-2.5 rounded-lg border border-emerald-100">
                💡 {currentFees.note}
              </p>
            </div>

          </div>
        )}

        {inscriptionStep === 3 && (
          <div className="space-y-4 text-xs text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#047857] rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-[#0a2540]">Préinscription Enregistrée !</h4>
              <p className="text-slate-500 max-w-md mx-auto">
                La préinscription de <strong>{formData.nom} {formData.prenom}</strong> a été validée dans le système.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2 max-w-md mx-auto">
              <p className="font-bold text-[#0a2540] border-b pb-1">Récapitulatif Fiche Officielle :</p>
              <p className="flex justify-between"><span>Réf. Dossier :</span> <strong className="text-[#0a2540] font-mono">{referenceNum}</strong></p>
              <p className="flex justify-between"><span>Frais Totaux :</span> <strong className="text-[#047857]">{currentFees.total.toLocaleString()} FCFA</strong></p>
              <p className="flex justify-between"><span>Dépôt Physique :</span> <strong>Secrétariat J.B. de La Salle 2</strong></p>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full py-3.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              <span>Imprimer le Bordereau Officiel A4</span>
            </button>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {inscriptionStep === 2 && (
            <button 
              onClick={() => setInscriptionStep(1)} 
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Retour
            </button>
          )}

          {inscriptionStep === 1 && (
            <button 
              onClick={() => setInscriptionStep(2)} 
              disabled={!formData.nom || !formData.prenom || !formData.etablissementOrigine}
              className="px-6 py-3 bg-[#0a2540] hover:bg-[#061726] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto disabled:opacity-50 shadow-md cursor-pointer"
            >
              <span>Étape Suivante (Calcul des Frais)</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          )}

          {inscriptionStep === 2 && (
            <button 
              onClick={handleReservationSubmit} 
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-bold flex items-center gap-2 ml-auto shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                  <span>Valider & Générer la Fiche</span>
                </>
              )}
            </button>
          )}

          {inscriptionStep === 3 && (
            <button 
              onClick={onClose} 
              className="px-6 py-3 bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-xl text-xs font-bold ml-auto cursor-pointer"
            >
              Fermer
            </button>
          )}
        </div>

      </div>
    </div>
  );
};