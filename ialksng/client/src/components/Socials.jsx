import "../styles/socials.css"
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
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

      <a href="https://twitter.com/ialksng" target="_blank">
        <FaTwitter />
      </a>

    </div>
  );
}

export default Socials;