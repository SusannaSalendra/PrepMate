import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';

export const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data.slice(0, 6));
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#031310] min-h-screen">
      {/* Hero Section (Two-Column with Visualization) */}
      <HeroSection />

      {/* Horizontal Bottom Feature Strip */}
      <FeatureSection />

      {/* Category Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#20C7C2]/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#20C7C2] uppercase mb-2 font-mono">
              Curated Curriculum
            </h2>
            <p className="text-3xl font-display font-medium text-[#F9FBFB]">
              Explore Interview Domains
            </p>
          </div>
          <Link
            to="/questions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20C7C2] hover:text-[#32E4DF] transition-colors"
          >
            <span>View all questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/questions?category=${encodeURIComponent(cat.name)}`}
                className="rounded-2xl p-6 bg-[#061A16]/70 border border-[#20C7C2]/15 hover:border-[#20C7C2]/35 hover:bg-[#061A16] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-display font-semibold text-[#F9FBFB] group-hover:text-[#20C7C2] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#20C7C2]/15 text-[#20C7C2] border border-[#20C7C2]/30">
                      {cat.questionCount || 0} questions
                    </span>
                  </div>
                  <p className="text-xs text-[#8FA6A3] line-clamp-2 leading-relaxed mb-4 font-sans">
                    {cat.description || 'Comprehensive questions covering practical scenarios, principles, and edge cases.'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#20C7C2] group-hover:translate-x-1 transition-transform">
                  <span>Explore domain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center p-12 rounded-2xl bg-[#061A16]/50 border border-[#20C7C2]/15">
              <BookOpen className="w-10 h-10 text-[#20C7C2] mx-auto mb-3" />
              <p className="text-[#F9FBFB] font-semibold text-sm">Explore our curated question bank</p>
              <p className="text-xs text-[#8FA6A3] mt-1">Hundreds of curated technical problems ready to practice.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-[#061A16] via-[#041512] to-[#020B09] border border-[#20C7C2]/25 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
              Ready to accelerate your technical interview readiness?
            </h2>
            <p className="text-[#8FA6A3] text-xs sm:text-sm leading-relaxed">
              Start practicing with our interactive mock interview sessions and AI voice mentor today. Join engineers preparing for top tech roles.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#20C7C2] hover:bg-[#32E4DF] text-[#031310] font-bold text-xs sm:text-sm shadow-xl shadow-[#20C7C2]/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
