import "../styles/loader.css";
import logo from "../assets/logo.png";

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="logo-loader">
        <img src={logo} alt="loading" />
      </div>
    </div>
  );
}

export default Loader;