import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaInstagram, FaYoutube } from 'react-icons/fa';

import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__col footer__brand">
          <Link to="/" className="footer__logo">
            Alok<span>Singh</span>.
          </Link>

          <p>
            Full-Stack MERN Developer specializing in scalable web applications,
            AI integrations, and high-performance digital solutions.
          </p>

          <div className="footer__socials">
            <a
              href="https://github.com/ialksng"
              target="_blank"
              rel="noreferrer"
              className="social__icon"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/ialksng"
              target="_blank"
              rel="noreferrer"
              className="social__icon"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://twitter.com/ialksng"
              target="_blank"
              rel="noreferrer"
              className="social__icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://instagram.com/ialksng"
              target="_blank"
              rel="noreferrer"
              className="social__icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://youtube.com/@ialksng"
              target="_blank"
              rel="noreferrer"
              className="social__icon"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>

          </div>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Explore</h3>
          <div className="footer__links">
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/about" className="footer__link">About</Link>
            <Link to="/projects" className="footer__link">Work</Link>
            <Link to="/blog" className="footer__link">Blog</Link>
            <Link to="/store" className="footer__link">Store</Link>
            <Link to="/more" className="footer__link">More</Link>
          </div>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Legal</h3>
          <div className="footer__links">
            <Link to="/legal/privacy-policy" className="footer__link">Privacy Policy</Link>
            <Link to="/legal/terms-conditions" className="footer__link">Terms of Service</Link>
            <Link to="/legal/refund-policy" className="footer__link">Refund Policy</Link>
            <Link to="/contact" className="footer__link">Contact Support</Link>
          </div>
        </div>

        <div className="footer__col footer__cta">
          <h3 className="footer__title">Let's Connect</h3>
          <p>
            Currently open for freelance opportunities and full-time roles.
          </p>

          <Link to="/contact" className="footer__btn">
            Hire Me
          </Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {currentYear} Alok Singh. All rights reserved.</p>
        <p>Made with &#9829; by ialksng</p>
      </div>
    </footer>
  );
};

export default Footer;