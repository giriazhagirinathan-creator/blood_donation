import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Droplet, Users, Trash2, Search, Info } from 'lucide-react';

const Dashboard = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [compatibleGroups, setCompatibleGroups] = useState([]);

  // Blood Compatibility Map
  const compatibilityMap = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };

  const handleCompatibilitySearch = (query) => {
    const bloodType = query.toUpperCase().trim();
    setSearchQuery(bloodType);
    if (compatibilityMap[bloodType]) {
      setCompatibleGroups(compatibilityMap[bloodType]);
    } else {
      setCompatibleGroups([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      // Fetch requests (MySQL)
      const reqRes = await fetch(`${API_URL}/api/requests`);
      const reqData = await reqRes.json();
      setActiveRequests(Array.isArray(reqData) ? reqData : []);

      // Fetch donors (MySQL)
      const donorRes = await fetch(`${API_URL}/api/donors`);
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
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/${type === 'request' ? 'requests' : 'donors'}/${id}`, {
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/requests/${id}`, {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Donor Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg">Real-time emergency monitoring and donor management.</p>
        </div>
        <div className="glass-effect bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-red-200">
          <Droplet className="w-6 h-6 animate-bounce" />
          <span className="text-xl">Your Status: Ready</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Section: Active Requests */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Compatibility Search Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Search className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Search className="w-6 h-6" /> Compatibility Search
              </h2>
              <p className="text-blue-100 mb-6">Enter a blood group to find who can donate to them.</p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search e.g., A+, AB-, O+..." 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
                    value={searchQuery}
                    onChange={(e) => handleCompatibilitySearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" />
                </div>
              </div>

              {compatibleGroups.length > 0 && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Compatibility Logic Info */}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <Info className="w-4 h-4" /> Compatible Groups:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {compatibleGroups.map(group => (
                          <span key={group} className="bg-white/20 border border-white/30 px-4 py-2 rounded-xl font-black text-lg backdrop-blur-sm shadow-inner">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Matching Real Donors */}
                    <div className="flex-[2]">
                      <p className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <Users className="w-4 h-4" /> Matching Donors Nearby:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {donors.filter(d => compatibleGroups.includes(d.blood_type)).length > 0 ? (
                          donors.filter(d => compatibleGroups.includes(d.blood_type)).map(donor => (
                            <div key={donor.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/20 transition-all cursor-default">
                              <div>
                                <p className="font-bold text-white">{donor.name}</p>
                                <p className="text-xs text-blue-200">{donor.contact}</p>
                              </div>
                              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg font-black text-xs shadow-lg">
                                {donor.blood_type}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-4 px-6 border-2 border-dashed border-white/20 rounded-2xl text-blue-100 text-sm font-medium">
                            No matching donors found in the database for this type.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Requests List */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-8 py-6 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                Emergency Requests
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500 font-medium">Fetching real-time data...</p>
                </div>
              ) : activeRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">All quiet on the donor front.</p>
                </div>
              ) : (
                activeRequests.map(req => (
                  <div key={req.id} className={`p-8 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${req.status === 'Fulfilled' ? 'bg-green-50/50 grayscale-[0.5]' : 'hover:bg-gray-50/80'}`}>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-gray-900">{req.patientName}</h3>
                        <span className={`px-4 py-1 text-xs font-black uppercase tracking-wider rounded-full ${req.status === 'Fulfilled' ? 'bg-green-200 text-green-800' : req.urgency === 'Immediate' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-amber-100 text-amber-700'}`}>
                          {req.status === 'Fulfilled' ? 'Saved' : req.urgency}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium">
                        <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-400" /> {req.hospitalName}</span>
                        <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /> {new Date(req.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center bg-white border-2 border-red-100 p-4 rounded-2xl w-24 shadow-sm">
                        <span className="block text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-1">Required</span>
                        <span className="block text-3xl font-black text-red-600">{req.bloodGroup}</span>
                      </div>
                      
                      <div className="flex flex-col gap-3 min-w-[140px]">
                        {req.status === 'Fulfilled' ? (
                          <div className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-100">
                            Done ✓
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAccept(req.id)}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200"
                          >
                            Help Now
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete('request', req.id)}
                          className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-bold text-sm"
                        >
                          <Trash2 className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Donor Stats & List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                Live Donors
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : donors.length === 0 ? (
                <div className="p-8 text-center text-gray-400">None nearby.</div>
              ) : (
                donors.map(donor => (
                  <div key={donor.id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{donor.name}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">{donor.contact}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-black text-sm">
                          {donor.blood_type}
                        </div>
                        <button 
                          onClick={() => handleDelete('donor', donor.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Quick Tip Card */}
          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
            <div className="flex gap-4">
              <div className="bg-amber-100 p-2 rounded-xl h-fit">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Did you know?</h3>
                <p className="text-sm text-amber-700 mt-2 leading-relaxed">
                  <strong>O-</strong> is the universal donor. People with O- blood can donate to anyone in an emergency!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
