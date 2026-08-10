const xlsx = require('xlsx');
const fs = require('fs');

const EXCEL_FILE = 'COLLECTE_MOYENNES_COLLEGE JEAN BAPTISTE DE LA SALLE 2 YOPOUGON MOSSIKRO_3è Trimestre_2025-2026.xlsx';
const JSON_OUTPUT = 'public/notes.json';

function convertExcelToJson() {
    try {
        console.log(`Lecture du fichier ${EXCEL_FILE}...`);
        
        const workbook = xlsx.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
        
        console.log(`${rawData.length} lignes lues.`);

        const processedData = rawData.map((row, index) => {
            // Récupère le nom et le prénom selon la structure réelle du fichier Excel
            const nomFamille = row['Nom & Prénoms'] || row['Nom'] || '';
            const prenomEleve = row['Unnamed: 2'] || row['Prénoms'] || row['Prenoms'] || '';
            
            return {
                id: index + 1,
                matricule: String(row['Matricule'] || '').trim(),
                nom: String(nomFamille).trim(),
                prenom: String(prenomEleve).trim(),
                classe: String(row['Classe'] || '').trim(),
                niveau: String(row['Niveau'] || '').trim(),
                moyenne: row['Moy Trim'] !== undefined ? String(row['Moy Trim']) : 'N/A',
                rang: row['Rang'] !== undefined ? String(row['Rang']) : 'N/A',
                francais: {
                    globale: row['Français'] !== undefined ? String(row['Français']) : null,
                    comp: row['Composition Française'] !== undefined ? String(row['Composition Française']) : null,
                    ortho: row['Orthographe-Grammaire'] !== undefined ? String(row['Orthographe-Grammaire']) : null,
                    oral: row['Expression Orale'] !== undefined ? String(row['Expression Orale']) : null
                },
                notes: {
                    Anglais: row['Anglais'] !== undefined ? String(row['Anglais']) : null,
                    Maths: row['Maths'] !== undefined ? String(row['Maths']) : null,
                    Physique: row['Physique'] !== undefined ? String(row['Physique']) : null,
                    SVT: row['SVT'] !== undefined ? String(row['SVT']) : null,
                    HG: row['HG'] !== undefined ? String(row['HG']) : null,
                    Philosophie: row['Philosophie'] !== undefined ? String(row['Philosophie']) : null,
                    All: row['All'] !== undefined ? String(row['All']) : null,
                    Esp: row['Esp'] !== undefined ? String(row['Esp']) : null,
                    EDHC: row['EDHC'] !== undefined ? String(row['EDHC']) : null,
                    Tic: row['Tic'] !== undefined ? String(row['Tic']) : null,
                    Conduite: row['Conduite'] !== undefined ? String(row['Conduite']) : null,
                    EPS: row['EPS'] !== undefined ? String(row['EPS']) : null
                }
            };
        });

        fs.writeFileSync(JSON_OUTPUT, JSON.stringify(processedData, null, 2), 'utf-8');
        console.log(`Conversion réussie ! ${processedData.length} élèves exportés vers ${JSON_OUTPUT}`);
    } catch (error) {
        console.error('Erreur lors de la conversion :', error.message);
    }
}

convertExcelToJson();