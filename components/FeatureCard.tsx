import React from 'react';
import { CheckCircleIcon } from './IconComponents';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
    <div className="flex items-start gap-3">
      <div className="text-pink-500 mt-1 flex-shrink-0">
        {icon || <CheckCircleIcon className="h-5 w-5" />}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1 group-hover:text-pink-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);
