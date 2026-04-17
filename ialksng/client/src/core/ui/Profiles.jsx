import { FaCode } from "react-icons/fa"
import { SiLeetcode, SiCodechef, SiKaggle } from "react-icons/si"

import "./Profiles.module.css"

function Profiles() {
  const profiles = [
    {
      name: "LeetCode",
      icon: <SiLeetcode />,
      desc: "DSA & Problem Solving",
      stats: "300+ Problems",
      link: "https://leetcode.com/ialksng"
    },
    {
      name: "CodeChef",
      icon: <SiCodechef />,
      desc: "Competitive Programming",
      stats: "3★ Rating",
      link: "https://www.codechef.com/users/ialksng"
    },
    {
      name: "Kaggle",
      icon: <SiKaggle />,
      desc: "Data Science",
      stats: "Top 30%",
      link: "https://www.kaggle.com/ialksng"
    }
  ]

  return (
    <section className="profiles">

      <h2 className="profiles__title">Coding Profiles</h2>

      <div className="profiles__grid">
        {profiles.map((item, index) => (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="profile__card"
            key={index}
          >
            <div className="profile__icon">{item.icon}</div>

            <h3>{item.name}</h3>

            <p className="profile__desc">{item.desc}</p>

            <span className="profile__stats">{item.stats}</span>
          </a>
        ))}
      </div>

    </section>
  )
}

export default Profiles