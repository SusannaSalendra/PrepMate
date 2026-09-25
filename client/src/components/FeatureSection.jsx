import React from 'react';
import { Mic, Brain, TrendingUp, UserCheck } from 'lucide-react';

export const FeatureSection = () => {
  const features = [
    {
      icon: Mic,
      title: 'Realistic Voice Simulations',
      desc: "Practice like it's the real interview",
    },
    {
      icon: Brain,
      title: 'Curated Questions',
      desc: 'From top tech giants',
    },
    {
      icon: TrendingUp,
      title: 'Progressive AI Hints',
      desc: 'Learn, improve, grow',
    },
    {
      icon: UserCheck,
      title: 'Personalized Analytics',
      desc: 'Track your strengths & focus areas',
    },
  ];

  return (
    <section className="w-full border-t border-[#20C7C2]/15 bg-[#031310]/95 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#061A16]/50 border border-[#20C7C2]/10 hover:border-[#20C7C2]/30 hover:bg-[#061A16]/80 transition-all duration-300 group"
              >
                {/* Turquoise Circular Icon Container */}
                <div className="w-12 h-12 rounded-full bg-[#031310] border border-[#20C7C2]/50 flex items-center justify-center shrink-0 text-[#20C7C2] shadow-[0_0_15px_rgba(32,199,194,0.2)] group-hover:scale-105 group-hover:border-[#20C7C2] transition-all">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-[#F9FBFB] group-hover:text-[#20C7C2] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8FA6A3] mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
