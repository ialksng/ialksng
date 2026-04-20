import "./Loader.css";

function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fullscreen-loader-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="loader-wrapper">
      <div className="spinner"></div>
    </div>
  );
}

export default Loader;