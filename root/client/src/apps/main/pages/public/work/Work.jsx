import Projects from "./components/Projects"
import Services from "./components/Services"

import "./Work.module.css"

function Work() {
    return (
        <section className="work" id="work">
            <Projects />
            <Services />
        </section>
  )
}

export default Work