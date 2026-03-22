import { useState } from "react";
import emailjs from "@emailjs/browser";
import Socials from "../components/Socials";
import "../styles/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        "service_booqm6l",
        "template_ygibhi8",
        {
          from_name: formData.name,
          to_name: "Alok Singh",
          from_email: formData.email,
          to_email: "ialksng@gmail.com",
          message: formData.message,
        },
        "51CHuyg4aofMDN1e7"
      );

      setFormData({ name: "", email: "", message: "" });
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }

    setIsLoading(false);
  };

  return (
    <section className="contact-page" id="contact">

      {/* HEADER */}
      <div className="contact-page__header">
        <h2>Get In Touch</h2>
        <p>
          Have a project, idea, or opportunity? Let’s connect and build something amazing.<br />
          {/* ✅ Added Response Time for Razorpay Compliance */}
          <span style={{ display: "block", marginTop: "8px", color: "#38bdf8", fontWeight: "500" }}>
            ⏱️ We respond within 24 hours.
          </span>
        </p>
      </div>

      {/* FORM CARD */}
      <div className="contact-page__card">

        <form onSubmit={handleSubmit} className="contact-page__form">

          <div className="form__row">
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isLoading ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="form__message success">
              Message sent successfully 🚀
            </p>
          )}

          {status === "error" && (
            <p className="form__message error">
              Something went wrong ❌
            </p>
          )}

        </form>
        
        {/* OR Divider */}
        <div className="contact__divider">
          <span>OR</span>
        </div>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/9319574689"
          target="_blank"
          rel="noreferrer"
          className="contact__whatsapp"
        >
          WhatsApp
        </a>

        {/* OR Divider */}
        <div className="contact__divider small">
          <span>OR</span>
        </div>

        {/* EMAIL + PHONE + ADDRESS */}
        <div className="contact__alt">
          
          <div className="contact__alt-buttons">
            <a href="mailto:ialksng@gmail.com" target="_blank" rel="noreferrer">
              📧 Email
            </a>

            <a href="tel:+919319574689">
              📞 Call
            </a>
          </div>

          {/* REGISTERED ADDRESS FOR RAZORPAY COMPLIANCE */}
          <div className="contact__address">
            <p>📍 Registered Business Address</p>
            <p>[Your House/Flat Number], [Sector/Locality]</p>
            <p>Greater Noida, Uttar Pradesh, [Pincode]</p>
            <p>India</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;