import React, { useState } from 'react';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

import Pagination from '../../../../../../core/components/Pagination'; 

import './Achievements.css';

export default function Achievements() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const achievementsData = [
    {
      title: "LeetCode 1800+ Rating",
      platform: "Competitive Programming",
      icon: <FaTrophy />,
      description: "Achieved a contest rating of 1800+ by consistently solving complex algorithmic and data structure challenges globally."
    },
    {
      title: "CodeChef 2-Star Coder",
      platform: "Competitive Programming",
      icon: <FaStar />,
      description: "Attained a 2-Star rating, participating in numerous timed contests and optimizing solutions for time/space complexity."
    },
    {
      title: "Academic Excellence (9.0 CGPA)",
      platform: "B.Tech Computer Science",
      icon: <FaMedal />,
      description: "Maintained a top-tier 9.0 CGPA over 3 years while balancing freelance client work and open-source project development."
    },
    {
      title: "Smart India Hackathon (Example)",
      platform: "National Level Hackathon",
      icon: <FaTrophy />,
      description: "Led a team to build a scalable MERN application under 36 hours, integrating real-time databases and API gateways."
    },
    {
      title: "Open Source Contributor",
      platform: "GitHub / GSoC Prep",
      icon: <FaStar />,
      description: "Actively contributing to open-source repositories and building full-stack boilerplates used by other developers."
    }
  ];

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = achievementsData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(achievementsData.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="about__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header">
          <h2>Achievements & Milestones</h2>
          <p>Highlights from hackathons, competitive programming, and academic excellence.</p>
        </div>

        <div className="achievements__container">
          {currentCards.map((achieve, index) => (
            <div className="achievement__card" key={index}>
              <div className="achievement__header">
                <div className="achievement__icon">
                  {achieve.icon}
                </div>
                <div className="achievement__info">
                  <h3>{achieve.title}</h3>
                  <p>{achieve.platform}</p>
                </div>
              </div>
              <p className="achievement__desc">
                {achieve.description}
              </p>
            </div>
          ))}
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={paginate} 
        />

      </div>
    </section>
  );
}