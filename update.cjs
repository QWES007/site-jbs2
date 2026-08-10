const { execSync } = require('child_process');

try {
    console.log("1. Lancement de la conversion...");
    execSync('node convert.cjs', { stdio: 'inherit' });

    console.log("2. Ajout des fichiers à Git...");
    execSync('git add .', { stdio: 'inherit' });

    console.log("3. Création du commit...");
    execSync('git commit -m "Mise a jour du fichier notes.json avec les noms et prenoms corrects"', { stdio: 'inherit' });

    console.log("4. Envoi sur le dépôt distant (push)...");
    execSync('git push origin main --force', { stdio: 'inherit' });

    console.log("✨ Opération terminée avec succès !");
} catch (error) {
    console.error("❌ Une erreur est survenue lors de l'exécution :", error.message);
}