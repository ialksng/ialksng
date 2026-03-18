import Profiles from "./Profiles";
import "../styles/about.css";
import defaultProfile from "../assets/Alok Singh.png"; // Used as fallback if no DB image
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../utils/axios"; // UPDATED: Importing your configured axios instance
import { iconMap } from "../utils/iconMap"; 

function About() {
  const [active, setActive] = useState("All");
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend when component mounts
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // UPDATED: Using a relative URL so it automatically uses your Render backend
        // Make sure VITE_API_BASE_URL is set in your Render/Vercel environment variables
        const { data } = await axios.get("/api/about"); 
        setAboutData(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="about" id="about">
        <h2 className="section__title">Loading About Me...</h2>
      </section>
    );
  }

  // Fallback in case there's an error or no data in the database yet
  if (!aboutData) {
    return (
      <section className="about" id="about">
        <h2 className="section__title">About Data Not Found</h2>
      </section>
    );
  }

  // Filter skills dynamically based on DB data
  const filteredSkills =
    active === "All"
      ? aboutData.skills || []
      : (aboutData.skills || []).filter((skill) => skill.category === active);

  return (
    <section className="about" id="about">
      <h2 className="section__title">About Me</h2>

      {/* TOP SECTION */}
      <div className="about__top">
        {/* IMAGE */}
        <div className="about__image">
          {/* Use DB image if available, else fallback to the local asset */}
          <img src={aboutData.imageUrl || defaultProfile} alt={aboutData.name} />
        </div>

        {/* CONTENT */}
        <div className="about__content card">
          <h3 className="about__role">{aboutData.role}</h3>
          
          {/* Dynamically render paragraphs from the database */}
          {aboutData.paragraphs && aboutData.paragraphs.length > 0 ? (
            aboutData.paragraphs.map((para, index) => (
              <p key={index} style={{ marginBottom: "1rem" }}>
                {para}
              </p>
            ))
          ) : (
            <p>I am a passionate developer.</p> // Fallback text
          )}

          <div className="resume__wrapper">
            <a
              href="https://drive.google.com/file/d/1RncZCzY-fZBqLkT_UtHpZw1RdW2ajCEv/view"
              target="_blank"
              rel="noopener noreferrer"
              className="btn primary"
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="about__skills">
        <h2 className="section__title">Skills</h2>

        {/* FILTER TABS */}
        <div className="skills__tabs">
          {["All", "Frontend", "Backend", "Languages", "Tools", "Databases"].map(
            (tab) => (
              <button
                key={tab}
                className={active === tab ? "active" : ""}
                onClick={() => setActive(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* ANIMATED GRID */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="skills__cards"
        >
          {filteredSkills.map((skill, index) => (
            <div className="skill__card" key={index}>
              {/* Translate the string 'iconName' from DB into the actual React Icon */}
              <div className="icon">
                {iconMap[skill.iconName] || <span>❖</span>}
              </div>
              <p>{skill.name}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* PROFILES */}
      <Profiles />

      {/* TIMELINE */}
      <div className="timeline">
        <h2 className="section__title">Experience</h2>

        <div className="timeline__wrapper">
          {aboutData.experiences && aboutData.experiences.length > 0 ? (
            aboutData.experiences.map((exp, index) => (
              <div className="timeline__item" key={index}>
                <div className="timeline__dot"></div>
                <div className="timeline__card">
                  <h4>{exp.title}</h4>
                  <span>{exp.duration}</span>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No experience data added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;