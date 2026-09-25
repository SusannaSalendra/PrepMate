import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mic, PlayCircle, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import InterviewVisualization from './InterviewVisualization';

export const HeroSection = () => {
  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Cyan Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#20C7C2]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[#0e8581]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & 3 CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 sm:space-y-7 text-left"
          >
            {/* 1. Small Rounded Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#061A16] border border-[#20C7C2]/40 text-[#20C7C2] text-xs font-semibold shadow-sm shadow-[#20C7C2]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#20C7C2]" />
                <span>Your AI-Powered Interview Companion</span>
              </div>
            </motion.div>

            {/* 2. Large Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-serif font-normal text-[#F9FBFB] tracking-tight leading-[1.12]"
            >
              Practice Smarter.<br />
              Speak Confidently.<br />
              <span className="italic font-normal text-[#20C7C2] drop-shadow-[0_0_25px_rgba(32,199,194,0.45)]">
                Get Placed.
              </span>
            </motion.h1>

            {/* 3. Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-[#8FA6A3] max-w-xl leading-relaxed font-sans"
            >
              PrepMate helps you build real interview confidence through interactive voice simulations, curated questions from top tech giants, progressive AI hints, and personalized skill analytics.
            </motion.p>

            {/* 4. 3 Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Button */}
              <Link
                to="/ai-mentor"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#20C7C2] hover:bg-[#32E4DF] text-[#031310] font-bold text-xs sm:text-sm shadow-xl shadow-[#20C7C2]/25 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(32,199,194,0.45)] active:scale-95 transition-all duration-200"
              >
                <Mic className="w-4 h-4 text-[#031310]" />
                <span>Launch AI Voice Mentor</span>
                <ArrowRight className="w-4 h-4 text-[#031310]" />
              </Link>

              {/* Secondary Button: Mock Interview */}
              <Link
                to="/mock-interview"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#061A16] hover:bg-[#20C7C2]/10 text-[#F9FBFB] border border-[#20C7C2]/30 hover:border-[#20C7C2]/70 font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all duration-200"
              >
                <PlayCircle className="w-4 h-4 text-[#20C7C2]" />
                <span>Mock Interview</span>
              </Link>

              {/* Secondary Button: Question Bank */}
              <Link
                to="/questions"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#061A16] hover:bg-[#20C7C2]/10 text-[#8FA6A3] hover:text-[#F9FBFB] border border-[#20C7C2]/20 hover:border-[#20C7C2]/60 font-medium text-xs sm:text-sm active:scale-95 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 text-[#20C7C2]" />
                <span>Question Bank</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: AI Interview Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full"
          >
            <InterviewVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
