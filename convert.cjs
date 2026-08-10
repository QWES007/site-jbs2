const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('COLLECTE_MOYENNES_COLLEGE JEAN BAPTISTE DE LA SALLE 2 YOPOUGON MOSSIKRO_3è Trimestre_2025-2026.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

const students = data.map((row, index) => {
    return {
        id: index + 1,
        matricule: String(row['Matricule'] || ''),
        nom: String(row['nom et prenoms'] || ''),
        prenom: '',
        classe: String(row['Classe'] || ''),
        niveau: String(row['Niveau'] || ''),
        moyenne: String(row['Moy Trim'] || '0'),
        rang: String(row['Rang'] || 'N/A'),
        francais: {
            globale: row['Français'] !== undefined ? String(row['Français']) : null,
            comp: row['Composition Française'] !== undefined ? String(row['Composition Française']) : null,
            ortho: row['Orthographe-Grammaire'] !== undefined ? String(row['Orthographe-Grammaire']) : null,
            oral: row['Expression Orale'] !== undefined ? String(row['Expression Orale']) : null
        },
        notes: {
            Philosophie: row['Philosophie'] !== undefined ? String(row['Philosophie']) : undefined,
            Anglais: row['Anglais'] !== undefined ? String(row['Anglais']) : undefined,
            Maths: row['Maths'] !== undefined ? String(row['Maths']) : undefined,
            Physique: row['Physique'] !== undefined ? String(row['Physique']) : undefined,
            SVT: row['SVT'] !== undefined ? String(row['SVT']) : undefined,
            HG: row['HG'] !== undefined ? String(row['HG']) : undefined,
            All: row['All'] !== undefined ? String(row['All']) : undefined,
            Esp: row['Esp'] !== undefined ? String(row['Esp']) : undefined,
            EDHC: row['EDHC'] !== undefined ? String(row['EDHC']) : undefined,
            AP: row['AP'] !== undefined ? String(row['AP']) : undefined,
            Mus: row['Mus'] !== undefined ? String(row['Mus']) : undefined,
            Tic: row['Tic'] !== undefined ? String(row['Tic']) : undefined,
            Conduite: row['Conduite'] !== undefined ? String(row['Conduite']) : undefined,
            EPS: row['EPS'] !== undefined ? String(row['EPS']) : undefined
        }
    };
});

// Nettoyage des notes non définies
students.forEach(s => {
    Object.keys(s.notes).forEach(key => {
        if (s.notes[key] === undefined) {
            delete s.notes[key];
        }
    });
});

fs.writeFileSync('./public/notes.json', JSON.stringify(students, null, 2), 'utf-8');
console.log('Conversion réussie : ' + students.length + ' élèves exportés.');