import React from "react";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";

function About() {

  const navigate = useNavigate();


  return (
    <div>
      <Navbar/>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="bg-black text-white py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About VESTRA </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Connecting fans with their favorite football clubs through premium jerseys.
          </p>
        </div>

        {/* Key Highlights */}
        <div className="py-12 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-700">
              Deliver authentic football jerseys that fans love, at prices everyone can afford.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Our Passion</h2>
            <p className="text-gray-700">
              Football is more than a game – it’s identity, culture, and community. We live that passion.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Why Choose Us</h2>
            <p className="text-gray-700">
              High-quality kits, top-notch designs, and a seamless shopping experience for every fan.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 bg-gray-100">
          <h2 className="text-3xl font-bold mb-4">Join the VESTRA Family!</h2>
          <p className="text-gray-700 mb-6">Grab your favorite kit and show your support for your club today!</p>
          {/* <a
          href="/shop"
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Shop Now 🛒
        </a> */}
          <Button variant="secondary" onClick={() => navigate("/shop")}>Shop Now 🛒</Button>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default About;
