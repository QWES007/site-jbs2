const xlsx = require('xlsx');
const fs = require('fs');

const EXCEL_FILE = 'donnees_eleves.xlsx'; // Remplacez par le nom exact de votre fichier Excel si besoin
const JSON_OUTPUT = 'public/notes.json';

function convertExcelToJson() {
    try {
        console.log(`Lecture du fichier ${EXCEL_FILE}...`);
        
        const workbook = xlsx.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
        
        console.log(`${rawData.length} lignes lues.`);

        // Traitement pour fusionner proprement le nom et le prénom
        const processedData = rawData.map((row, index) => {
            // Récupère dynamiquement les colonnes peu importe leur casse (Nom/NOM/nom, etc.)
            const nom = row.Nom || row.NOM || row.nom || '';
            const prenom = row.Prenoms || row.Prénoms || row.PRENOMS || row.prenoms || row.Prénom || row.PRENOM || '';
            const matricule = row.Matricule || row.MATRICULE || row.matricule || '';

            return {
                id: index + 1,
                ...row,
                // Crée ou met à jour la clé lue par votre site web
                NOM_PRENOMS: `${nom} ${prenom}`.trim(),
                nom: nom,
                prenoms: prenom,
                matricule: String(matricule).trim()
            };
        });

        fs.writeFileSync(JSON_OUTPUT, JSON.stringify(processedData, null, 2), 'utf-8');
        console.log(`Conversion réussie ! Fichier mis à jour : ${JSON_OUTPUT}`);
    } catch (error) {
        console.error('Erreur lors de la conversion :', error.message);
    }
}

convertExcelToJson();