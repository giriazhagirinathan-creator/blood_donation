import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Droplet, Users, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch requests (MySQL)
      const reqRes = await fetch('http://localhost:5000/api/requests');
      const reqData = await reqRes.json();
      setActiveRequests(Array.isArray(reqData) ? reqData : []);

      // Fetch donors (MySQL)
      const donorRes = await fetch('http://localhost:5000/api/donors');
      const donorData = await donorRes.json();
      setDonors(Array.isArray(donorData) ? donorData : []);

    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/${type === 'request' ? 'requests' : 'donors'}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh data
        fetchData();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Could not connect to server');
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Fulfilled' })
      });
      
      if (response.ok) {
        fetchData();
      } else {
        alert('Failed to accept request');
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back. Here are the active emergencies and donors near you.</p>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
          <Droplet className="w-5 h-5 fill-current" />
          Your Blood Type: A+
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blood Requests Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Active Local Requests
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading requests...</div>
              ) : activeRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No active requests in your area right now.
                </div>
              ) : (
                activeRequests.map(req => (
                  <div key={req.id} className={`p-6 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${req.status === 'Fulfilled' ? 'bg-green-50 opacity-75' : 'hover:bg-gray-50'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{req.patientName}</h3>
                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${req.status === 'Fulfilled' ? 'bg-green-100 text-green-700' : req.urgency === 'Immediate' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {req.status === 'Fulfilled' ? 'Fulfilled' : req.urgency}
                        </span>
                      </div>
                      <div className="text-gray-600 flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" /> {req.hospitalName}</span>
                        <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> {new Date(req.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="block text-xs text-gray-500 font-medium uppercase">Needed</span>
                        <span className="block text-xl font-bold text-red-600">{req.bloodGroup}</span>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {req.status === 'Fulfilled' ? (
                          <div className="text-green-600 font-bold text-center py-2 border border-green-200 rounded-lg bg-green-50 text-sm">
                            Accepted ✓
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAccept(req.id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm text-sm"
                          >
                            Accept
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete('request', req.id)}
                          className="flex items-center justify-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Nearby Donors Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Available Donors
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading donors...</div>
              ) : donors.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No donors found.</div>
              ) : (
                donors.map(donor => (
                  <div key={donor.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{donor.name}</h4>
                      <p className="text-xs text-gray-500">{donor.contact}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                        {donor.blood_type}
                      </div>
                      <button 
                        onClick={() => handleDelete('donor', donor.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
