import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] pt-[60px] md:pt-[80px] pb-[24px] md:pb-[30px] px-5 border-t border-slate-400/10 text-slate-400">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 pb-10 border-b border-slate-400/10 text-center md:text-left">

        <div className="flex flex-col gap-[18px] items-center md:items-start">
          <Link to="/" className="text-[28px] font-bold text-white tracking-[0.4px] no-underline">
            Alok<span className="text-sky-400">Singh</span>.
          </Link>

          <p className="text-[14px] leading-[1.8] text-slate-400 max-w-full md:max-w-[320px] m-0">
            Full-Stack MERN Developer specializing in scalable web applications,
            AI integrations, and high-performance digital solutions.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
            <a href="https://github.com/ialksng" target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 text-[18px] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400/15 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/ialksng" target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 text-[18px] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400/15 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/ialksng" target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 text-[18px] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400/15 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/ialksng" target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 text-[18px] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400/15 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com/@ialksng" target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full bg-sky-400/10 border border-sky-400/25 flex items-center justify-center text-sky-400 text-[18px] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400/15 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-slate-200 text-[15px] font-semibold mb-[18px] uppercase tracking-[1.3px]">Explore</h3>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <Link to="/" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Home</Link>
            <Link to="/about" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">About</Link>
            <Link to="/work" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Work</Link>
            <Link to="/blog" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Blog</Link>
            <Link to="/store" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Store</Link>
            <Link to="/more" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">More</Link>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-slate-200 text-[15px] font-semibold mb-[18px] uppercase tracking-[1.3px]">Legal</h3>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <Link to="/privacy-policy" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Cookie Policy</Link>
            <Link to="/refund-policy" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Refund Policy</Link>
            <Link to="/contact" className="text-slate-400 text-[14px] no-underline transition-all duration-300 hover:text-sky-400 hover:translate-x-[3px]">Contact Support</Link>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-slate-200 text-[15px] font-semibold mb-[18px] uppercase tracking-[1.3px]">Let's Connect</h3>
          <p className="text-[14px] leading-[1.8] text-slate-400 mb-5 max-w-full md:max-w-[260px] m-0">
            Currently open for freelance opportunities and full-time roles.
          </p>

          <Link to="/contact" className="inline-block w-fit px-[22px] py-[12px] rounded-[10px] bg-gradient-to-br from-sky-400 to-sky-500 text-[#03111f] font-semibold transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(56,189,248,0.25)] mx-auto md:mx-0 no-underline">
            Hire Me
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-[25px] flex flex-col md:flex-row justify-between items-center gap-2 flex-wrap text-center md:text-left">
        <p className="text-[14px] text-slate-500 m-0">&copy; {currentYear} Alok Singh. All rights reserved.</p>
        <p className="text-[14px] text-slate-500 m-0">Made with &#9829; by ialksng</p>
      </div>
    </footer>
  );
};

export default Footer;