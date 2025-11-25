import React, { useState } from 'react';
import { ChevronDownIcon } from './IconComponents';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg transition-all duration-300 hover:border-slate-700 hover:shadow-pink-500/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors rounded-t-2xl"
      >
        <h2 className="text-lg font-bold text-white flex items-center">
          {icon && <span className="mr-2 text-pink-500">{icon}</span>}
          {title}
        </h2>
        <ChevronDownIcon 
          className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-fade-in">
          {children}
        </div>
      )}
    </section>
  );
};
