import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Heart, Sparkles, Bot } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#20B2AA]/15 bg-[#0D1614] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex items-center justify-center shadow-md shadow-[#20B2AA]/15">
                <BrainCircuit className="w-4 h-4 text-[#0D1614]" />
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">PrepMate</span>
            </Link>
            <p className="text-xs sm:text-sm text-charcoal-400 max-w-sm leading-relaxed">
              Empowering students and software engineers to master technical interviews through realistic mock sessions, AI voice mentorship, and personalized progress metrics.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#20B2AA]">
              <Bot className="w-3.5 h-3.5" />
              <span>Interactive AI Voice Mentor Enabled</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-50 mb-4 font-display">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-400">
              <li>
                <Link to="/ai-mentor" className="hover:text-[#3FD1C7] transition-colors flex items-center gap-1.5">
                  <span>AI Voice Mentor</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#20B2AA]/20 text-[#3FD1C7]">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/questions" className="hover:text-[#3FD1C7] transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link to="/mock-interview" className="hover:text-[#3FD1C7] transition-colors">
                  Mock Interview Simulator
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-[#3FD1C7] transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#3FD1C7] transition-colors">
                  Progress Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-50 mb-4 font-display">
              Curated Domains
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-400">
              <li>
                <Link to="/questions?category=Data+Structures+%26+Algorithms" className="hover:text-[#3FD1C7] transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/questions?category=System+Design" className="hover:text-[#3FD1C7] transition-colors">
                  System Design & Scale
                </Link>
              </li>
              <li>
                <Link to="/questions?category=Frontend+Engineering" className="hover:text-[#3FD1C7] transition-colors">
                  Frontend Engineering
                </Link>
              </li>
              <li>
                <Link to="/questions?category=Backend+%26+Databases" className="hover:text-[#3FD1C7] transition-colors">
                  Backend & Databases
                </Link>
              </li>
              <li>
                <Link to="/questions?category=Behavioral+%26+Leadership" className="hover:text-[#3FD1C7] transition-colors">
                  Behavioral & STAR Leadership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#20B2AA]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© {new Date().getFullYear()} PrepMate. Built for high-performance job interview preparation.</p>
          <div className="flex items-center gap-1 text-[#20B2AA]">
            <span>Designed for ambitious engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
