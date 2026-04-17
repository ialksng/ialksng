import React, { useState, useEffect, useMemo } from 'react';
import { FaCertificate, FaTimes, FaAward } from 'react-icons/fa';
import { SiUdemy, SiCoursera, SiPostman } from 'react-icons/si';

import Pagination from '../../../../../../core/components/Pagination'; 

import './Certifications.css';

export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null);

  const [issuerFilter, setIssuerFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; 

  useEffect(() => {
    if (activeCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeCert]);

  useEffect(() => {
    setCurrentPage(1);
  }, [issuerFilter, typeFilter]);

  const certificationsData = [
    {
      title: "Advanced Data Structures and Algorithms",
      issuer: "Coursera / NPTEL",
      type: "Algorithms",
      date: "Issued: Jan 2025",
      icon: <SiCoursera />,
      driveId: "YOUR_DRIVE_FILE_ID_1" 
    },
    {
      title: "Full-Stack MERN Development Masterclass",
      issuer: "Udemy",
      type: "Web Development",
      date: "Issued: Nov 2024",
      icon: <SiUdemy />,
      driveId: "YOUR_DRIVE_FILE_ID_2"
    },
    {
      title: "Postman API Fundamentals Student Expert",
      issuer: "Postman",
      type: "API",
      date: "Issued: Aug 2024",
      icon: <SiPostman />,
      driveId: "YOUR_DRIVE_FILE_ID_3"
    },
    {
      title: "Java & Spring Boot Backend Development",
      issuer: "Tech Institute",
      type: "Backend",
      date: "Issued: May 2024",
      icon: <FaAward />,
      driveId: "YOUR_DRIVE_FILE_ID_4"
    }
  ];

  const issuers = ["All", ...new Set(certificationsData.map(item => item.issuer))];
  const types = ["All", ...new Set(certificationsData.map(item => item.type))];
  const filteredCerts = useMemo(() => {
    return certificationsData.filter(cert => {
      const matchIssuer = issuerFilter === "All" || cert.issuer === issuerFilter;
      const matchType = typeFilter === "All" || cert.type === typeFilter;
      return matchIssuer && matchType;
    });
  }, [issuerFilter, typeFilter, certificationsData]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCerts.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCerts.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="about__section">
      <div className="container">
        
        <div className="section__header">
          <h2>Licenses & Certifications</h2>
          <p>Professional credentials and continuous learning milestones.</p>
        </div>

        <div className="cert__controls">
          <div className="filter__group">
            <span className="filter__label">Company/Issuer:</span>
            <select 
              className="filter__select" 
              value={issuerFilter} 
              onChange={(e) => setIssuerFilter(e.target.value)}
            >
              {issuers.map((issuer, idx) => (
                <option key={idx} value={issuer}>{issuer}</option>
              ))}
            </select>
          </div>

          <div className="filter__group">
            <span className="filter__label">Category/Type:</span>
            <select 
              className="filter__select" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {currentCards.length > 0 ? (
          <div className="cert__container">
            {currentCards.map((cert, index) => (
              <div className="cert__card" key={index}>
                
                <div className="cert__header">
                  <div className="cert__icon">{cert.icon}</div>
                  <div className="cert__info">
                    <h3>{cert.title}</h3>
                    <p>{cert.issuer} • {cert.type}</p>
                  </div>
                </div>
                
                <div className="cert__date">{cert.date}</div>
                
                <button 
                  className="cert__btn" 
                  onClick={() => setActiveCert(cert)}
                >
                  View Credential
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            <p>No certificates found matching these filters.</p>
          </div>
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={paginate} 
        />

      </div>

      {activeCert && (
        <div className="cert__modal-overlay" onClick={() => setActiveCert(null)}>
          <div className="cert__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cert__modal-header">
              <h3>{activeCert.title}</h3>
              <button className="cert__modal-close" onClick={() => setActiveCert(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="cert__modal-body">
              <iframe 
                src={`https://drive.google.com/file/d/${activeCert.driveId}/preview`} 
                title={activeCert.title}
                className="cert__iframe"
                allow="autoplay"
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}