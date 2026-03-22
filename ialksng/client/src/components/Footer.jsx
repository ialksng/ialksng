import Socials from "./Socials";
import "../styles/footer.css"
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer__container">

        {/* LEFT: Branding */}
        <div className="footer__brand">
          <h3>Alok Singh</h3>
          <p>Building modern web experiences.</p>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "15px", maxWidth: "250px", lineHeight: "1.5" }}>
            This website is operated by Alok Singh, offering digital services and products through ialksng.me.
          </p>
        </div>

        {/* CENTER: Grouped Links */}
        <div className="footer__nav-groups">
          
          {/* Column 1: Main Navigation */}
          <div className="footer__link-group">
            <h4>Explore</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#shop">Shop</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Column 2: Legal Navigation */}
          <div className="footer__link-group">
            <h4>Legal</h4>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/refund-policy">Refund & Cancellation Policy</Link>
          </div>

        </div>
        
        {/* RIGHT: Socials */}
        <div className="footer__socials">
          <Socials />
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer__bottom" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <p>© {new Date().getFullYear()} Alok Singh. All rights reserved.</p>
        <p style={{ fontSize: "12px", color: "#38bdf8", display: "flex", alignItems: "center", gap: "5px" }}>
        </p>
      </div>

    </footer>
  );
}

export default Footer;