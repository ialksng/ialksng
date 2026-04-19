import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";

import "./Hero.css";

function Hero() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 3,
    users: 0,
  });

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/public/stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats({
          projects: data.projects || 0,
          clients: data.clients || 0,
          users: data.users || 0,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load hero statistics.");
      });
  }, [API]);

  return (
    <section className="hero" id="home">
      <div className="hero__bg"></div>

      <div className="hero__content">
        <p className="hero__tag">🚀 Available for Freelance</p>

        <h1>
          Hi, I'm <span className="gradient-text">Alok Singh</span>
        </h1>

        <h2>
          <Typewriter
            words={[
              "Full Stack Developer",
              "MERN Developer",
              "Freelancer",
              "Problem Solver",
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h2>

        <p className="hero__desc">
          I build modern web apps, create developer resources, and help people
          learn through code, notes, and projects.
        </p>

        <div className="hero__stats">
          <span>
            <b>{stats.projects}+</b> Projects
          </span>
          <span>
            <b>3+</b> Clients
          </span>
          <span>
            <b>{stats.users}+</b> Users
          </span>
        </div>

        <div className="hero__buttons">
          <a href="#work" className="btn primary">
            View Work
          </a>
          <a href="#contact" className="btn secondary">
            Hire Me
          </a>
        </div>

        <div className="hero__scroll">Scroll to explore</div>
      </div>
    </section>
  );
}

export default Hero;