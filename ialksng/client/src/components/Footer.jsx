import Socials from "./Socials";
import "../styles/footer.css"
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer__container">

        {/* LEFT */}
        <div className="footer__brand">
          <h3>Alok Singh</h3>
          <p>Building modern web experiences.</p>
        </div>

        {/* CENTER (NAV LINKS) */}
        <div className="footer__links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#shop">Shop</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>

        {/* Add the mandatory legal links below */}
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/refund-policy">Refund & Cancellation Policy</Link>
        </div>
        {/* RIGHT (SOCIALS) */}
        <div className="footer__socials">
          <Socials />
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Alok Singh. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;