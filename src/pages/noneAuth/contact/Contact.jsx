import React, { useState } from "react";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";
import { toast } from "react-toastify";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.warning(`Thanks for reaching out, ${formData.name}! We’ll get back to you soon.`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8 md:p-12">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Contact <span className="text-green-600">Us</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            ></textarea>

            {/* <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Send Message
            </button> */}
            <Button type="submit" variant="success" className="w-full">Send Message</Button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="text-gray-600">
              Have questions? We’d love to hear from you!  
              Reach out to us through the form or directly using the details below:
            </p>
            <p className="font-semibold">📍 Location: </p>
            <p className="text-gray-600">123 Jersey Street, Football City, India</p>
            <p className="font-semibold">📞 Phone: </p>
            <p className="text-gray-600">+91 98765 43210</p>
            <p className="font-semibold">✉️ Email: </p>
            <p className="text-gray-600">support@vestra.com</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default Contact;
