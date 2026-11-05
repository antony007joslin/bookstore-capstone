import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, BookOpen, TrendingUp, Compass, Smile, ArrowRight } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  BookOpen: BookOpen,
  TrendingUp: TrendingUp,
  Compass: Compass,
  Smile: Smile,
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || BookOpen;

  return (
    <Link
      to={`/catalogue?categoryId=${category.id}`}
      className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-sky-100/50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div>
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-xs font-semibold text-sky-600 group-hover:text-sky-700">
        <span>Explore Titles</span>
        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default CategoryCard;
