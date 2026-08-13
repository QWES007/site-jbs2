import { FeeStructure } from '../types';

export const MEDIA_CONFIG = {
  logo: "/logo.png",
  heroBackground: "/facade.jpg",
  facadeCard: "/facade.jpg",
  generalImage: "/enseignement-general.jpg",
  techniqueImage: "/technique.jpg",
};

export const SCHOOL_INFO = {
  fullNamePart1: "Collège privé technique Jean Baptiste",
  fullNamePart2: "de la Salle 2",
  shortName: "J.B. de La Salle 2",
  address: "Attécoubé Santé 3, 23 BP 519 Abidjan 23",
  phone: "07 48 627 869",
  phoneFormatted: "+2250748627869",
  whatsappUrl: "https://wa.me/2250748627869?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20le%20Coll%C3%A8ge%20JBS2",
  email: "college.jbs2@gmail.com",
  mapsUrl: "https://www.google.com/maps?q=5.340777,-4.052753",
  facebookUrl: "https://facebook.com",
  drenaUrl: "https://drenaabidjan3.ci/",

  // 📢 TEXTE DE LA BANDE DÉROULANTE (Modifiable à tout moment)
  announcementText: "📢 Rentrée Scolaire 2026-2027 : Les préinscriptions en ligne sont ouvertes ! • Consultation des bulletins du 3ème trimestre disponible dans l'Espace Parent • Pour tout renseignement, contactez le secrétariat au 07 48 627 869.",

  // 🪟 CONFIGURATION DE LA POP-UP D'INFORMATION (Modifiable à tout moment)
  popup: {
    enabled: true, // Mettre à 'false' pour masquer la fenêtre, ou 'true' pour l'afficher
    title: "Information Importante - Rentrée Scolaire",
    badge: "AVIS AUX PARENTS",
    content: "Les préinscriptions et réinscriptions pour l'année scolaire 2026-2027 sont officiellement ouvertes. Veuillez vous rendre au secrétariat muni du dossier complet.",
    buttonText: "Compris, fermer",
  }
};

export const calculateSchoolFees = (classe: string, statut: string): FeeStructure => {
  const isAffecte = statut === 'affecte';
  const isCollege = ['6ème', '5ème', '4ème', '3ème'].some(c => classe.includes(c));
  const isLyceeGeneral = ['2nd A', '2nd C', '1ère A2', '1ère D', 'Tle A2', 'Tle D'].some(c => classe.includes(c));

  if (isAffecte) {
    return {
      inscription: 10000,
      scolarite: 15000,
      total: 25000,
      note: "Prise en charge par l'État de Côte d'Ivoire (Seuls les frais annexes d'inscription s'appliquent)."
    };
  } else {
    if (isCollege) {
      return {
        inscription: 25000,
        scolarite: 95000,
        total: 120000,
        note: "Tarif Inscription Libre - Premier Cycle Général."
      };
    } else if (isLyceeGeneral) {
      return {
        inscription: 30000,
        scolarite: 110000,
        total: 140000,
        note: "Tarif Inscription Libre - Second Cycle Général (A2 / C / D)."
      };
    } else {
      return {
        inscription: 35000,
        scolarite: 125000,
        total: 160000,
        note: "Tarif Inscription Libre - Pôle Technique Tertiaire (AB / B / G1 / G2)."
      };
    }
  }
};