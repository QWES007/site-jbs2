const xlsx = require('xlsx');
const fs = require('fs');

// Assurez-vous que ce nom correspond à 100% à celui dans votre dossier
const FILE_NAME = 'COLLECTE_MOYENNES_COLLEGE JEAN BAPTISTE DE LA SALLE 2 YOPOUGON MOSSIKRO_3è Trimestre_2025-2026.xlsx';

console.log('Lecture du fichier Excel en cours...');

try {
  const workbook = xlsx.readFile(FILE_NAME);
  const sheetName = workbook.SheetNames[0]; // Onglet 'A'
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });

  // Fonction pour éviter les erreurs "NaN" (Not a Number) si une case est vide
  const safeFloat = (val) => {
    if (val === null || val === undefined || String(val).trim() === '') return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed.toFixed(2);
  };

  const students = data.map(row => {
    const nom = row['Nom & Prénoms'] ? String(row['Nom & Prénoms']).trim() : '';
    const prenom = row['Unnamed: 2'] ? String(row['Unnamed: 2']).trim() : '';
    
    // Matières standards
    const subjects = ['Anglais', 'Maths', 'Physique', 'SVT', 'HG', 'All', 'Esp', 'EDHC', 'Philosophie', 'Tic', 'Conduite', 'EPS'];
    const notes = {};
    
    subjects.forEach(sub => {
      if (row[sub] !== null && row[sub] !== undefined && String(row[sub]).trim() !== '') {
        const val = parseFloat(row[sub]);
        // Si c'est un nombre, on garde 2 chiffres après la virgule, sinon on garde le texte (ex: "Abs")
        notes[sub] = !isNaN(val) ? val.toFixed(2) : String(row[sub]).trim();
      }
    });

    return {
      matricule: row['Matricule'] ? String(row['Matricule']).trim() : '',
      nom: `${nom} ${prenom}`.trim(),
      classe: row['Classe'] ? String(row['Classe']).trim() : '',
      niveau: row['Niveau'] ? String(row['Niveau']).trim() : '',
      moyenne: safeFloat(row['Moy Trim']) || 'N/A',
      rang: row['Rang'] ? String(row['Rang']).trim() : 'N/A',
      francais: {
        globale: safeFloat(row['Français']),
        comp: safeFloat(row['Composition Française']),
        ortho: safeFloat(row['Orthographe-Grammaire']),
        oral: safeFloat(row['Expression Orale']),
      },
      notes: notes
    };
  }).filter(s => s.matricule && s.nom && s.matricule.toLowerCase() !== 'matricule'); // Ignorer les lignes vides ou les en-têtes répétés

  fs.writeFileSync('./public/notes.json', JSON.stringify(students, null, 2));
  console.log(`✅ Succès ! ${students.length} élèves exportés dans public/notes.json`);
  
} catch (error) {
  console.error("❌ ERREUR :", error.message);
  console.error("Vérifiez que le nom du fichier Excel dans le code est EXACTEMENT le même que celui dans votre dossier.");
}