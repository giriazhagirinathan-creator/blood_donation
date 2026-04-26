import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight">BloodConnect</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-red-700 px-3 py-2 rounded-md transition-colors">Home</Link>
            <Link to="/request" className="hover:bg-red-700 px-3 py-2 rounded-md transition-colors">Request Blood</Link>
            <Link to="/dashboard" className="bg-white text-red-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
