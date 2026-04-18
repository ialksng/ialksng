import React from 'react';

import './Updates.css';

export default function Updates() {
  const updatesData = [
    {
      date: "Mar 2026",
      title: "Deep Dive into Advanced Data Structures",
      desc: "Intensifying preparation for the GATE CS/IT exam, focusing heavily on Theory of Computation and advanced graph algorithms.",
      tag: "GATE Prep"
    },
    {
      date: "Feb 2026",
      title: "Smartsphaere Architecture Upgrades",
      desc: "Refactored the core dashboard to improve cloud resource aggregation speed by 40% using optimized MongoDB indexing.",
      tag: "Project Update"
    },
    {
      date: "Jan 2026",
      title: "Open Source & GSoC Prep",
      desc: "Actively contributing to open-source MERN boilerplate repositories and preparing proposals for Google Summer of Code.",
      tag: "Open Source"
    }
  ];

  return (
    <section className="home__section">
      <div className="container">
        <div className="section__header text-center">
          <h2>Dev Log & Updates</h2>
          <p>What I am currently learning, building, and focusing on.</p>
        </div>

        <div className="updates__container">
          {updatesData.map((update, index) => (
            <div className="update__item" key={index}>
              <div className="update__date">{update.date}</div>
              <div className="update__content">
                <h3>{update.title}</h3>
                <p>{update.desc}</p>
                <span className="update__tag">{update.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}