import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    { label: "Années d'Excellence", value: "15+", icon: "school" },
    { label: "Élèves Accompagnés", value: "1 200+", icon: "groups" },
    { label: "Taux de Réussite BEPC", value: "92%", icon: "workspace_premium" },
    { label: "Enseignants Qualifiés", value: "45+", icon: "person_check" },
  ];

  return (
    <div className="bg-[#0a2540] py-8 px-4 sm:px-6 my-6 rounded-3xl text-white shadow-xl">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f59e0b] transition-all">
            <span className="material-symbols-outlined text-3xl text-[#f59e0b] mb-2">{stat.icon}</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};