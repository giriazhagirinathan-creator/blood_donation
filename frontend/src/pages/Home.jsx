import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, ShieldAlert } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Save a Life in <span className="text-red-600">Real-Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect directly with local blood banks and hospitals during emergencies. Your quick response can make the difference between life and death.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/request" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl">
              Request Blood Now
            </Link>
            <Link to="/dashboard" className="bg-white text-red-600 border border-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition shadow-sm">
              I Want to Donate
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4 text-red-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Emergency Alerts</h3>
            <p className="text-gray-600">Get instant notifications when someone in your area needs your specific blood type.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4 text-red-600">
              <Droplet className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct Connection</h3>
            <p className="text-gray-600">Cut out the middleman. Hospitals directly broadcast requirements to registered nearby donors.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4 text-red-600">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Save Lives</h3>
            <p className="text-gray-600">Every donation can save up to 3 lives. Join our network of heroes today.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
