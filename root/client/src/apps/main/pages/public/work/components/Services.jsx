import { motion } from "framer-motion"
import { FaCode, FaPaintBrush, FaServer } from "react-icons/fa"

import "./Services.module.css"

function Services() {
  const services = [
    {
      icon: <FaCode />,
      title: "Web Development",
      desc: "Build modern, scalable full-stack web applications using MERN stack."
    },
    {
      icon: <FaPaintBrush />,
      title: "UI/UX Design",
      desc: "Design clean, aesthetic and user-friendly interfaces."
    },
    {
      icon: <FaServer />,
      title: "Backend Development",
      desc: "Create secure APIs, databases and server-side logic."
    }
  ]

  return (
    <section className="services" id="services">

      <h2 className="services__title">Services</h2>
      <p className="services__subtitle">What I can do for you</p>

      <div className="services__grid">

        {services.map((service, index) => (

          <motion.div
            key={index}
            className="service__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >

            <div className="service__icon">{service.icon}</div>

            <h3>{service.title}</h3>

            <p>{service.desc}</p>

            <button className="hire-btn">Hire Me</button>

          </motion.div>

        ))}

      </div>

    </section>
  )
}

export default Services