export interface Student {
    matricule: string;
    nom: string;
    prenom: string;
    classe: string;
    statut: string;
    etablissementOrigine: string;
    mga: string;
    filiere: 'general' | 'technique';
  }
  
  export interface FeeStructure {
    inscription: number;
    scolarite: number;
    total: number;
    note: string;
  }
  
  export interface ActivityItem {
    id: number;
    title: string;
    category: string;
    date_label: string;
    description: string;
    image_url: string;
  }