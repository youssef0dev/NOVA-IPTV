
import React from 'react';

interface CategoriesViewProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, activeCategory, onCategorySelect }) => {
  // Map categories to distinct visual styles or icons
  const getIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('sport')) return 'sports_soccer';
    if (c.includes('movie') || c.includes('cinema')) return 'movie';
    if (c.includes('news')) return 'newspaper';
    if (c.includes('kids') || c.includes('child')) return 'child_care';
    if (c.includes('music')) return 'music_note';
    if (c.includes('document')) return 'visibility';
    return 'grid_view';
  };

  const getGradient = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('sport')) return 'from-red-500 to-orange-600';
    if (c.includes('movie')) return 'from-blue-600 to-indigo-800';
    if (c.includes('news')) return 'from-emerald-500 to-teal-700';
    if (c.includes('kids')) return 'from-pink-500 to-rose-600';
    return 'from-gray-700 to-gray-900';
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-6 md:p-12 pb-32">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-3 h-12 bg-primary rounded-full shadow-glow"></div>
        <div>
           <h2 className="text-4xl font-black tracking-tighter uppercase italic">Broadcasting Nodes</h2>
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mt-1">AI-Powered Categorization Active</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        {categories.map((cat, idx) => (
          <div 
            key={cat}
            onClick={() => onCategorySelect(cat)}
            className={`group relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 border border-white/5 hover:border-primary/50 shadow-premium animate-fade-in`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(cat)} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all">
                <span className="material-symbols-outlined text-3xl md:text-5xl text-white group-hover:text-black">
                  {getIcon(cat)}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter leading-tight">{cat}</h3>
              <div className="mt-4 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700"></div>
            </div>
            
            {/* Background floating icon for texture */}
            <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-white/5 text-[120px] rotate-12 pointer-events-none group-hover:text-white/10 transition-colors">
              {getIcon(cat)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-20 p-12 glass-panel rounded-[3rem] text-center border-dashed border-white/10">
         <p className="text-white/20 text-xs font-black uppercase tracking-[0.8em]">End of Transmission</p>
      </div>
    </div>
  );
};

export default CategoriesView;
