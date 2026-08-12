import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kwbdawzllmgfsfqpafyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YmRhd3psbG1nZnNmcXBhZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDYyNTksImV4cCI6MjEwMjAyMjI1OX0.HR8WHmAP2QOFN70AEBPN1NGNAw5BqDuuMDYpkqe3rCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ParentAuthProps {
  onLoginSuccess: (studentData: any) => void;
}

export const ParentAuth: React.FC<ParentAuthProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CONNEXION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanMatricule = matricule.trim().toUpperCase();

      // 1. Vérifier si le compte existe
      const { data: account, error: accError } = await supabase
        .from('comptes_parents')
        .select('*')
        .eq('matricule', cleanMatricule)
        .single();

      if (accError || !account) {
        throw new Error("Aucun compte trouvé pour ce matricule. Veuillez d'abord vous inscrire.");
      }

      // 2. Vérifier le mot de passe
      if (account.password_hash !== password) {
        throw new Error("Mot de passe incorrect.");
      }

      // 3. Charger les données du bulletin
      const res = await fetch('/notes.json');
      const data = await res.json();
      const student = data.find((s: any) => s.matricule.toUpperCase() === cleanMatricule);

      if (!student) throw new Error("Données du bulletin introuvables.");

      onLoginSuccess(student);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CRÉATION DE COMPTE (PREMIÈRE FOIS)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanMatricule = matricule.trim().toUpperCase();

      // 1. Vérifier si l'élève existe bien dans notes.json
      const res = await fetch('/notes.json');
      const data = await res.json();
      const student = data.find((s: any) => s.matricule.toUpperCase() === cleanMatricule);

      if (!student) {
        throw new Error("Matricule inconnu dans le système de l'école.");
      }

      // 2. Vérifier le code d'activation fourni par l'école (ex: champ code dans notes.json)
      if (student.code && String(student.code).trim() !== activationCode.trim()) {
        throw new Error("Code de première connexion invalide.");
      }

      // 3. Créer le compte parent dans Supabase
      const { error: insertError } = await supabase
        .from('comptes_parents')
        .insert([{ matricule: cleanMatricule, password_hash: password }]);

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error("Un compte existe déjà pour ce matricule. Connectez-vous directement.");
        }
        throw insertError;
      }

      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setIsRegistering(false);
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a2540] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-white/10 max-w-xl mx-auto text-white">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 bg-[#f59e0b] text-[#0a2540] rounded-xl flex items-center justify-center font-bold">
          <span className="material-symbols-outlined">lock</span>
        </div>
        <div>
          <span className="bg-[#047857] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
            ESPACE PARENT SÉCURISÉ
          </span>
          <h3 className="font-extrabold text-base sm:text-lg text-white">
            {isRegistering ? "Première Connexion / Inscription" : "Connexion au Bulletin Numérique"}
          </h3>
        </div>
      </div>

      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-300 mb-1 uppercase">Matricule de l'Élève *</label>
          <input
            type="text"
            placeholder="Ex: 25170040G"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:border-[#f59e0b] font-mono"
            required
          />
        </div>

        {isRegistering && (
          <div>
            <label className="block font-bold text-slate-300 mb-1 uppercase">Code de Première Connexion (Fourni par l'école) *</label>
            <input
              type="text"
              placeholder="Ex: 1234"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:border-[#f59e0b] font-mono"
              required
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-300 mb-1 uppercase">
            {isRegistering ? "Choisissez votre Mot de Passe *" : "Mot de Passe *"}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:border-[#f59e0b]"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-200 rounded-xl border border-red-500/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-base">sync</span>
          ) : (
            <span className="material-symbols-outlined text-base">key</span>
          )}
          {isRegistering ? "Créer Mon Compte Parent" : "Se Connecter"}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-white/10">
        <button
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="text-xs text-[#f59e0b] font-bold hover:underline cursor-pointer"
        >
          {isRegistering ? "Déjà un compte ? Connectez-vous ici" : "Première visite ? Créez votre compte parent ici"}
        </button>
      </div>
    </div>
  );
};