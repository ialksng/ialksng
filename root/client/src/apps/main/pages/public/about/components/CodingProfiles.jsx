import React from 'react';
import { SiLeetcode, SiCodechef, SiGithub, SiHackerrank } from 'react-icons/si';

import './CodingProfiles.css';

export default function CodingProfiles() {
  const profiles = [
    {
      platform: "LeetCode",
      username: "aloksingh",
      stat: "1800+ Rating",
      icon: <SiLeetcode />,
      color: "#fb923c",
      link: "https://leetcode.com/ialksng"
    },
    {
      platform: "CodeChef",
      username: "aloksingh",
      stat: "2-Star Coder",
      icon: <SiCodechef />,
      color: "#5b4638", 
      link: "https://codechef.com/users/ialksng"
    },
    {
      platform: "GitHub",
      username: "aloksingh",
      stat: "Open Source LLMs & DevOps",
      icon: <SiGithub />,
      color: "var(--text-primary)",
      link: "https://github.com/ialksng"
    },
    {
      platform: "HackerRank",
      username: "aloksingh",
      stat: "Problem Solving",
      icon: <SiHackerrank />,
      color: "#22c55e", 
      link: "https://hackerrank.com/ialksng"
    }
  ];

  return (
    <section className="about__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header">
          <h2>Coding Profiles & Online Presence</h2>
          <p>My competitive programming journey and open-source contributions.</p>
        </div>

        <div className="profiles__grid">
          {profiles.map((profile, index) => (
            <a 
              href={profile.link} 
              target="_blank" 
              rel="noreferrer" 
              key={index} 
              className="profile__card"
            >
              <div className="profile__icon" style={{ color: profile.color }}>
                {profile.icon}
              </div>
              <h3>{profile.platform}</h3>
              <p>{profile.stat}</p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}