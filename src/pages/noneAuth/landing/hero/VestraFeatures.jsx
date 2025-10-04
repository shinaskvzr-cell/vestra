import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

export function VestraFeatures() {
  const features = [
    {
      icon: <Truck className="w-10 h-10 text-green-500" />,
      title: "Fast Delivery",
      desc: "Get your jerseys delivered quickly to your doorstep.",
    },
    {
      icon: <RotateCcw className="w-10 h-10 text-green-500" />,
      title: "Easy Returns",
      desc: "Hassle-free returns within 7 days of purchase.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
      title: "Secure Payments",
      desc: "Your payments are safe with end-to-end encryption.",
    },
    {
      icon: <Star className="w-10 h-10 text-green-500" />,
      title: "Premium Quality",
      desc: "Authentic jerseys with top-notch quality guaranteed.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 m-30">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose <span className="text-green-600">VESTRA</span>?</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default VestraFeatures