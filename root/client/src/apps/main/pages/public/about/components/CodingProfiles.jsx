import React from 'react';
import { SiLeetcode, SiCodechef, SiGeeksforgeeks, SiKaggle } from 'react-icons/si';

import './CodingProfiles.css';

export default function CodingProfiles() {
  const profiles = [
    {
      platform: "LeetCode",
      username: "ialksng",
      stat: "1700+ Rating",
      icon: <SiLeetcode />,
      color: "#fb923c",
      link: "https://leetcode.com/ialksng"
    },
    {
      platform: "CodeChef",
      username: "ialksng",
      stat: "2-Star Coder",
      icon: <SiCodechef />,
      color: "#5b4638", 
      link: "https://codechef.com/users/ialksng"
    },
    {
      platform: "GeeksforGeeks",
      username: "ialksng",
      stat: "DSA Practice",
      icon: <SiGeeksforgeeks />,
      color: "#2f8d46", 
      link: "https://www.geeksforgeeks.org/profile/ialksng"
    },
    {
      platform: "Kaggle",
      username: "ialksng",
      stat: "ML & Data Science",
      icon: <SiKaggle />,
      color: "#20beff", 
      link: "https://www.kaggle.com/ialksng"
    }
  ];

  return (
    <section className="about__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header">
          <h2>Coding Profiles & Online Presence</h2>
          <p>My competitive programming journey and machine learning contributions.</p>
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