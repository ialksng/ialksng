import "../styles/socials.css"
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa";

function Socials() {
  return (
    <div className="socials">

      <a href="https://github.com/ialksng" target="_blank">
        <FaGithub />
      </a>

      <a href="https://linkedin.com/in/ialksng" target="_blank">
        <FaLinkedin />
      </a>

      <a href="https://instagram.com/ialksng" target="_blank">
        <FaInstagram />
      </a>

      <a href="https://x.com/ialksng" target="_blank">
        <FaXTwitter />
      </a>

      <a href="https://www.youtube.com/@ialksng" target="_blank">
        <FaYoutube />
      </a>

    </div>
  );
}

export default Socials;