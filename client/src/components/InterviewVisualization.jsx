import React from 'react';
import { Mic, Sparkles, Check, Code2, BarChart2 } from 'lucide-react';

export const InterviewVisualization = () => {
  return (
    <div className="relative w-full max-w-[620px] lg:max-w-[680px] mx-auto flex items-center justify-center select-none py-6">
      {/* Background Teal Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#20C7C2]/15 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Main Student & Laptop Frame Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-[#20C7C2]/20 bg-[#031310]">
        {/* Student Image with Smooth Vignette & Gradient Overlays */}
        <img
          src="/student-interview-scene.jpg"
          alt="Student practicing virtual AI interview on laptop with headphones"
          className="w-full h-full object-cover object-center transform scale-105"
        />

        {/* Seamless dark blend overlays around all edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031310] via-transparent to-[#031310]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031310]/80 via-transparent to-[#031310]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,transparent_35%,rgba(3,19,16,0.85)_100%)] pointer-events-none" />

        {/* Subtle Glowing Cyan Connection Circuit Orbits (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left to Center curve */}
          <path
            d="M 120 70 Q 230 40 330 90"
            fill="none"
            stroke="#20C7C2"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          {/* Top-Right to Center curve */}
          <path
            d="M 520 80 Q 420 120 360 210"
            fill="none"
            stroke="#20C7C2"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          {/* Left-center to bottom */}
          <path
            d="M 150 200 Q 260 250 340 240"
            fill="none"
            stroke="#20C7C2"
            strokeWidth="1.2"
          />
          {/* Connecting glowing dots */}
          <circle cx="330" cy="90" r="3" fill="#20C7C2" className="animate-ping" />
          <circle cx="330" cy="90" r="2.5" fill="#20C7C2" />
          <circle cx="360" cy="210" r="2.5" fill="#20C7C2" />
          <circle cx="150" cy="200" r="2.5" fill="#20C7C2" />
          <circle cx="520" cy="80" r="2.5" fill="#20C7C2" />
        </svg>

        {/* Floating Glassmorphism Card 1: Voice Interview Dialogue & Waveform */}
        <div className="absolute top-4 sm:top-6 left-3 sm:left-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-[#061A16]/85 backdrop-blur-md border border-[#20C7C2]/30 shadow-xl shadow-black/60 max-w-[210px] sm:max-w-[230px] animate-in fade-in zoom-in duration-500 hover:border-[#20C7C2]/60 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#031310] border border-[#20C7C2]/60 flex items-center justify-center text-[#20C7C2] shadow-[0_0_12px_rgba(32,199,194,0.35)]">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#F9FBFB] leading-tight">
                "Tell me about yourself."
              </p>
            </div>
          </div>
          {/* Animated audio waveform bars */}
          <div className="flex items-center justify-center gap-1 h-5 px-1 py-0.5 bg-[#031310]/80 rounded-lg border border-[#20C7C2]/15">
            {[4, 12, 18, 8, 16, 20, 10, 14, 18, 8, 15, 6, 12, 4].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-[#20C7C2] rounded-full animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: '1.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Glassmorphism Card 2: AI Feedback Checklist */}
        <div className="absolute top-[38%] sm:top-[36%] left-2 sm:left-4 z-20 p-3 sm:p-3.5 rounded-2xl bg-[#061A16]/85 backdrop-blur-md border border-[#20C7C2]/30 shadow-xl shadow-black/60 max-w-[190px] sm:max-w-[210px] hover:border-[#20C7C2]/60 transition-all">
          <div className="flex items-center gap-1.5 mb-2 text-[#20C7C2] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Feedback</span>
          </div>
          <ul className="space-y-1.5 text-[10px] sm:text-[11px] text-[#C8D8D5]">
            <li className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#20C7C2]/20 text-[#20C7C2] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Good structure</span>
            </li>
            <li className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#20C7C2]/20 text-[#20C7C2] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>More technical depth</span>
            </li>
            <li className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#20C7C2]/20 text-[#20C7C2] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Try to be concise</span>
            </li>
          </ul>
        </div>

        {/* Floating Glassmorphism Card 3: Problem Analysis Breakdown */}
        <div className="absolute top-4 sm:top-6 right-3 sm:right-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-[#061A16]/85 backdrop-blur-md border border-[#20C7C2]/30 shadow-xl shadow-black/60 w-[170px] sm:w-[190px] hover:border-[#20C7C2]/60 transition-all">
          <div className="flex items-center gap-1.5 mb-2.5 text-[#20C7C2] text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">&lt;/&gt; Analysis</span>
          </div>
          <div className="space-y-1.5 text-[9px] sm:text-[10px]">
            <div>
              <div className="flex justify-between text-[#C8D8D5] mb-0.5">
                <span>Problem</span>
                <span className="text-[#20C7C2]">80%</span>
              </div>
              <div className="w-full h-1 bg-[#031310] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C7C2] rounded-full w-[80%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#C8D8D5] mb-0.5">
                <span>Reason</span>
                <span className="text-[#20C7C2]">95%</span>
              </div>
              <div className="w-full h-1 bg-[#031310] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C7C2] rounded-full w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#C8D8D5] mb-0.5">
                <span>Solution</span>
                <span className="text-[#20C7C2]">65%</span>
              </div>
              <div className="w-full h-1 bg-[#031310] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C7C2] rounded-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#C8D8D5] mb-0.5">
                <span>Learning</span>
                <span className="text-[#20C7C2]">85%</span>
              </div>
              <div className="w-full h-1 bg-[#031310] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C7C2] rounded-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Glassmorphism Card 4: Progress Analytics Card */}
        <div className="absolute bottom-4 sm:bottom-6 right-3 sm:right-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-[#061A16]/85 backdrop-blur-md border border-[#20C7C2]/30 shadow-xl shadow-black/60 w-[170px] sm:w-[185px] hover:border-[#20C7C2]/60 transition-all">
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#8FA6A3] uppercase tracking-wider mb-2">
            Your Progress
          </p>
          <div className="flex items-end justify-between">
            {/* Ascending Teal Bar Chart Graphic */}
            <div className="flex items-end gap-1 h-8 pb-1">
              <span className="w-1.5 h-3 bg-[#20C7C2]/40 rounded-t" />
              <span className="w-1.5 h-4 bg-[#20C7C2]/60 rounded-t" />
              <span className="w-1.5 h-6 bg-[#20C7C2]/80 rounded-t" />
              <span className="w-1.5 h-7 bg-[#20C7C2] rounded-t shadow-[0_0_8px_#20C7C2]" />
              <span className="w-1.5 h-8 bg-[#32E4DF] rounded-t shadow-[0_0_10px_#32E4DF]" />
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold font-display text-[#F9FBFB] leading-none text-[#20C7C2] drop-shadow-[0_0_10px_rgba(32,199,194,0.4)]">
                85%
              </p>
              <p className="text-[9px] text-[#8FA6A3] mt-0.5">Skills Improved</p>
            </div>
          </div>
        </div>

        {/* Decorative Stack of Tech Books on Desk (Bottom Right Overlay) */}
        <div className="absolute bottom-2 right-24 hidden lg:flex flex-col items-center z-10 opacity-75 pointer-events-none">
          <div className="px-2 py-0.5 rounded-t bg-[#0A2620] border-t border-x border-[#20C7C2]/30 text-[8px] font-mono text-[#20C7C2] tracking-widest shadow">
            DSA
          </div>
          <div className="px-3 py-0.5 bg-[#061A16] border border-[#20C7C2]/20 text-[8px] font-mono text-[#8FA6A3] tracking-wider shadow">
            SYSTEM DESIGN
          </div>
          <div className="px-3.5 py-0.5 bg-[#041512] border border-[#20B2AA]/20 text-[8px] font-mono text-[#8FA6A3] tracking-wider shadow">
            PLACEMENTS
          </div>
          <div className="px-4 py-0.5 rounded-b bg-[#031310] border-b border-x border-[#20C7C2]/15 text-[8px] font-mono text-[#20C7C2]/80 tracking-widest shadow">
            DREAMS
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewVisualization;
