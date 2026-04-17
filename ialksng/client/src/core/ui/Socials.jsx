import "./Socials.module.css";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

function Socials() {
  return (
    <div className="socials">

      <a href="https://github.com/ialksng" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>

      <a href="https://linkedin.com/in/ialksng" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>

      <a href="https://instagram.com/ialksng" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>

      <a href="https://x.com/ialksng" target="_blank" rel="noopener noreferrer">
        <FaTwitter />
      </a>

      <a href="https://www.youtube.com/@ialksng" target="_blank" rel="noopener noreferrer">
        <FaYoutube />
      </a>

    </div>
  );
}

export default Socials;