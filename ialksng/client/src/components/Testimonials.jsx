import "../styles/testimonials.css"
import { motion } from "framer-motion"

function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Startup Founder",
      text: "Alok built an amazing web app for us. Clean UI and fast performance!",
    },
    {
      name: "Priya Verma",
      role: "Student",
      text: "His notes and projects helped me a lot in learning development.",
    },
    {
      name: "Amit Patel",
      role: "Freelance Client",
      text: "Delivered the project on time with great quality. Highly recommended!",
    }
  ]

  return (
    <section className="testimonials">

      <h2 className="testimonials__title">Testimonials</h2>
      <p className="testimonials__subtitle">What people say about me</p>

      <div className="testimonials__grid">

        {testimonials.map((item, index) => (

          <motion.div
            key={index}
            className="testimonial__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >

            <p className="testimonial__text">“{item.text}”</p>

            <div className="testimonial__user">
              <h4>{item.name}</h4>
              <span>{item.role}</span>
            </div>

          </motion.div>

        ))}

      </div>

    </section>
  )
}

export default Testimonials