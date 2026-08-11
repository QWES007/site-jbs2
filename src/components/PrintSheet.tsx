import React from 'react';
import { Student, FeeStructure } from '../types';
import { SCHOOL_INFO, MEDIA_CONFIG } from '../config/school';

interface PrintSheetProps {
  formData: Student;
  currentFees: FeeStructure;
  referenceNum: string;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({
  formData,
  currentFees,
  referenceNum,
}) => {
  return (
    <div className="hidden print:block p-10 bg-white text-slate-900 font-sans max-w-4xl mx-auto space-y-6 min-h-[297mm]">
      {/* Entête Institutionnel */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
        <div className="flex items-center gap-5">
          <img
            src={MEDIA_CONFIG.logo}
            alt="Logo JBS2"
            className="h-20 w-auto object-contain"
          />
          <div className="space-y-0.5">
            <h1 className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-snug">
              MINISTÈRE DE L'ÉDUCATION NATIONALE, DE L'ALPHABÉTISATION ET DE L'ENSEIGNEMENT TECHNIQUE (MENAET)
            </h1>
            <h2 className="text-base font-black text-[#0a2540] uppercase tracking-tight pt-1">
              {SCHOOL_INFO.fullNamePart1}
            </h2>
            <h3 className="text-sm font-black text-[#047857] uppercase">
              {SCHOOL_INFO.fullNamePart2}
            </h3>
            <p className="text-xs text-slate-600 font-medium pt-0.5">
              {SCHOOL_INFO.address} • Tél: {SCHOOL_INFO.phone}
            </p>
          </div>
        </div>
        <div className="text-right text-xs font-bold text-slate-700 space-y-1 shrink-0">
          <p className="uppercase tracking-wider">RÉPUBLIQUE DE CÔTE D'IVOIRE</p>
          <p className="text-slate-500 font-medium">Union - Discipline - Travail</p>
          <p className="text-[#047857] font-black text-sm pt-1">DRENA ABIDJAN 3</p>
        </div>
      </div>

      {/* Titre Officiel */}
      <div className="text-center space-y-1.5 py-3 bg-slate-100 rounded-xl border-2 border-slate-800">
        <h2 className="text-lg font-black text-[#0a2540] uppercase tracking-widest">
          BORDEREAU OFFICIEL DE PRÉINSCRIPTION
        </h2>
        <p className="text-sm font-extrabold text-[#047857]">ANNÉE SCOLAIRE 2026 - 2027</p>
        <p className="text-xs text-slate-700 font-mono">
          Fiche Réf: <strong className="text-slate-900 text-sm">{referenceNum || 'JBS2-2026-0000'}</strong> • Date: {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      {/* 1. Identification Élève */}
      <div className="space-y-2">
        <h3 className="text-sm font-black text-[#0a2540] uppercase border-b-2 border-slate-800 pb-1 flex items-center justify-between">
          <span>1. IDENTITÉ DE L'ÉLÈVE CANDIDAT(E)</span>
          <span className="text-xs font-bold text-slate-500 normal-case">Dossier Académique</span>
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm bg-slate-50 p-5 rounded-xl border border-slate-300">
          <p className="text-slate-700">
            Nom & Prénoms : <strong className="text-[#0a2540] uppercase font-black text-base">{formData.nom} {formData.prenom}</strong>
          </p>
          <p className="text-slate-700">
            Matricule Éducation : <strong className="text-slate-900 font-bold">{formData.matricule || 'Non attribué'}</strong>
          </p>
          <p className="text-slate-700">
            Classe Demandée : <strong className="text-[#047857] font-extrabold text-base">{formData.classe}</strong>
          </p>
          <p className="text-slate-700">
            Statut Réseau : <strong className="text-slate-900 font-bold">{formData.statut === 'affecte' ? "Affecté(e) de l'État (DRENA 3)" : "Non-Affecté / Inscription Libre"}</strong>
          </p>
          <p className="text-slate-700">
            Établissement d'Origine : <strong className="text-slate-900 font-bold">{formData.etablissementOrigine}</strong>
          </p>
          <p className="text-slate-700">
            Moyenne Annuelle (MGA) : <strong className="text-[#047857] font-extrabold">{formData.mga ? `${formData.mga} / 20` : 'Non renseignée'}</strong>
          </p>
        </div>
      </div>

      {/* 2. Détail Financier */}
      <div className="space-y-2">
        <h3 className="text-sm font-black text-[#0a2540] uppercase border-b-2 border-slate-800 pb-1">
          2. DÉTAIL DES FRAIS D'INSCRIPTION & SCOLARITÉ
        </h3>
        <table className="w-full text-sm text-left border-2 border-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-[#0a2540] text-white">
            <tr>
              <th className="p-3 font-bold text-xs uppercase tracking-wider">Rubrique Financière</th>
              <th className="p-3 font-bold text-right text-xs uppercase tracking-wider">Montant FCFA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            <tr>
              <td className="p-3 font-semibold text-slate-800">Frais Dépôt de Dossier & Inscription Annexes</td>
              <td className="p-3 text-right font-extrabold text-slate-900">{currentFees.inscription.toLocaleString()} FCFA</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-800">Frais de Scolarité Annuelle</td>
              <td className="p-3 text-right font-extrabold text-slate-900">{currentFees.scolarite.toLocaleString()} FCFA</td>
            </tr>
            <tr className="bg-emerald-50/80">
              <td className="p-3 font-black text-[#0a2540] uppercase text-base">MONTANT TOTAL À RÉGLER AU SECRÉTARIAT</td>
              <td className="p-3 text-right font-black text-[#047857] text-lg">{currentFees.total.toLocaleString()} FCFA</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-slate-600 italic font-medium pt-1">* {currentFees.note}</p>
      </div>

      {/* 3. Pièces Requises */}
      <div className="p-4 bg-amber-50/60 rounded-xl border-2 border-amber-300 space-y-2">
        <p className="font-black uppercase tracking-wide text-amber-950 text-xs flex items-center justify-between border-b border-amber-200 pb-1">
          <span>📋 PIÈCES À FOURNIR OBLIGATOIREMENT LORS DU DÉPÔT PHYSIQUE DU DOSSIER :</span>
          <span>Contrôle Secrétariat</span>
        </p>
        <div className="grid grid-cols-3 gap-3 text-xs font-bold text-slate-800 pt-1">
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
            <span className="w-4 h-4 border-2 border-slate-800 inline-block rounded-sm"></span>
            <span>Dernier bulletin année précédente</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
            <span className="w-4 h-4 border-2 border-slate-800 inline-block rounded-sm"></span>
            <span>Reçu d'inscription en ligne</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
            <span className="w-4 h-4 border-2 border-slate-800 inline-block rounded-sm"></span>
            <span>Extrait original (Nouveaux)</span>
          </div>
        </div>
      </div>

      {/* Signatures & Emplacements de Validation */}
      <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
        <div className="border-2 border-slate-800 rounded-xl p-5 h-36 flex flex-col justify-between bg-slate-50">
          <p className="font-extrabold text-[#0a2540] uppercase">Signature du Parent / Tuteur Légal</p>
          <p className="text-[10px] text-slate-500 italic">Mention obligatoire « Lu et approuvé »</p>
        </div>
        <div className="border-2 border-slate-800 rounded-xl p-5 h-36 flex flex-col justify-between bg-slate-50">
          <p className="font-extrabold text-[#0a2540] uppercase">Cachet & Validation Secrétariat JBS2</p>
          <p className="text-[10px] text-slate-500 italic">Date, Nom et signature du vérificateur</p>
        </div>
      </div>
    </div>
  );
};