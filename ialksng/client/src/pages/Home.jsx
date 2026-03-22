import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import About from "../components/About"
import Work from "../components/Work"
import Testimonials from "../components/Testimonials"
import Shop from "../components/Shop.jsx"
import Blog from "../components/Blog.jsx"
import Contact from "../components/Contact"
import Updates from "../components/Updates"

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Testimonials />
      <Shop />
      <Blog />
      <Contact />
      <Updates />
    </>
  )
}

export default Home