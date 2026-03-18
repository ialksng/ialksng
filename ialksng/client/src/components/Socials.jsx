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

      <a href="https://github.com/your-username" target="_blank">
        <FaGithub />
      </a>

      <a href="https://linkedin.com/in/your-username" target="_blank">
        <FaLinkedin />
      </a>

      <a href="https://instagram.com/your-username" target="_blank">
        <FaInstagram />
      </a>

      <a href="https://twitter.com/your-username" target="_blank">
        <FaTwitter />
      </a>

    </div>
  );
}

export default Socials;