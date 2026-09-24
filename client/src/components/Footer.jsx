import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Heart, Shield, Code, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PrepMate</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering developers and engineers to master technical interviews through realistic mock sessions, curated question banks, and actionable feedback.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack MERN Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/questions" className="hover:text-indigo-400 transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link to="/mock-interview" className="hover:text-indigo-400 transition-colors">
                  Mock Interview Session
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-indigo-400 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
                  Progress Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/questions?category=Data+Structures+%26+Algorithms" className="hover:text-indigo-400 transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/questions?category=System+Design" className="hover:text-indigo-400 transition-colors">
                  System Design
                </Link>
              </li>
              <li>
                <Link to="/questions?category=Frontend+Engineering" className="hover:text-indigo-400 transition-colors">
                  Frontend Engineering
                </Link>
              </li>
              <li>
                <Link to="/questions?category=Behavioral+%26+Leadership" className="hover:text-indigo-400 transition-colors">
                  Behavioral & Leadership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PrepMate. Built for high-performance job interview preparation.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for developers with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
