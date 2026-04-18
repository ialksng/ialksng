import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaClock 
} from "react-icons/fa";

import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    const emailPromise = emailjs.send(
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

    toast.promise(emailPromise, {
      loading: 'Sending message...',
      success: () => {
        setFormData({ name: "", email: "", message: "" });
        return "Message sent! I will get back to you shortly.";
      },
      error: "Oops! Something went wrong. Please try again.",
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <section className="contact-page" id="contact">
      <div className="container contact__container">
        <div className="contact__info-wrapper">
          <div className="contact__header">
            <h2>Get In Touch</h2>
            <p>
              Have a project, idea, or opportunity? Let’s connect and build something amazing together.
            </p>
          </div>

          <div className="contact__details">
            
            <a href="mailto:ialksng@gmail.com" target="_blank" rel="noreferrer" className="contact__item">
              <div className="contact__icon"><FaEnvelope /></div>
              <div className="contact__text">
                <h4>Email</h4>
                <p>ialksng@gmail.com</p>
              </div>
            </a>

            <a href="tel:+919319574689" className="contact__item">
              <div className="contact__icon"><FaPhoneAlt /></div>
              <div className="contact__text">
                <h4>Phone</h4>
                <p>+91 93195 74689</p>
              </div>
            </a>

            <div className="contact__item">
              <div className="contact__icon"><FaClock /></div>
              <div className="contact__text">
                <h4>Response Time</h4>
                <p>I typically respond within 24 hours.</p>
              </div>
            </div>

            <div className="contact__item">
              <div className="contact__icon"><FaMapMarkerAlt /></div>
              <div className="contact__text">
                <h4>Registered Business Address</h4>
                <p>D-635, Main Market, Nathupura<br />Delhi, 110084, India</p>
              </div>
            </div>

          </div>
        </div>

        <div className="contact__form-card">
          <form onSubmit={handleSubmit} className="contact__form">
            
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
              rows="6"
              placeholder="How can I help you?"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Sending Message..."
              ) : (
                <>Send Message <FaPaperPlane /></>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

export default Contact;