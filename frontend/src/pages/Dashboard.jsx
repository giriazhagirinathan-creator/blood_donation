import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Droplet, Users, Trash2, Search, Info, Building2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeRequests, setActiveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const q = query.toLowerCase().trim();
    const upperQuery = query.toUpperCase().trim();
    
    // 1. Compatibility Check (if searching a blood type)
    if (compatibilityMap[upperQuery]) {
      setCompatibleGroups(compatibilityMap[upperQuery]);
    } else {
      setCompatibleGroups([]);
    }

    // 2. Hospital & Request Search
    if (q === '') {
      setFilteredRequests(activeRequests);
    } else {
      const matches = activeRequests.filter(req => 
        req.hospitalName.toLowerCase().includes(q) ||
        req.patientName.toLowerCase().includes(q) ||
        req.bloodGroup.toLowerCase().includes(q)
      );
      setFilteredRequests(matches);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const reqRes = await fetch(`${API_URL}/api/requests`);
      const reqData = await reqRes.json();
      const validReqs = Array.isArray(reqData) ? reqData : [];
      setActiveRequests(validReqs);
      setFilteredRequests(validReqs);

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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Emergency Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg">Find blood, donors, and hospitals in real-time.</p>
        </div>
        <div className="glass-effect bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-red-200">
          <Droplet className="w-6 h-6 animate-bounce" />
          <span className="text-xl">Network Status: Online</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Section: Search & Requests */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Smart Search Card */}
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Building2 className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-400" /> Global Finder
              </h2>
              <p className="text-blue-200 mb-6">Search for <strong>Hospitals</strong>, <strong>Blood Groups</strong>, or <strong>Patient Names</strong>.</p>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search 'City Hospital', 'A+', 'John Doe'..." 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-14 py-5 text-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-4 focus:ring-blue-500/30 backdrop-blur-xl transition-all"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
              </div>

              {/* Compatibility Results (Only if blood type searched) */}
              {compatibleGroups.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <p className="text-xs font-black text-blue-400 mb-4 uppercase tracking-[0.2em]">Compatible Donors</p>
                      <div className="flex flex-wrap gap-2">
                        {compatibleGroups.map(group => (
                          <span key={group} className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl font-black text-lg backdrop-blur-sm shadow-inner">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-[2]">
                      <p className="text-xs font-black text-blue-400 mb-4 uppercase tracking-[0.2em]">Available Donors ({searchQuery})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {donors.filter(d => compatibleGroups.includes(d.blood_type)).slice(0, 4).map(donor => (
                          <div key={donor.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all">
                            <div>
                              <p className="font-bold text-white leading-tight">{donor.name}</p>
                              <p className="text-[10px] text-blue-300 mt-1 uppercase tracking-wider">{donor.contact}</p>
                            </div>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-[10px] uppercase">
                              {donor.blood_type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Requests List */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-8 py-6 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Active Emergencies
              </h2>
              {searchQuery && (
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
                  Found {filteredRequests.length} results
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-medium italic">Scanning network...</div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try searching for a different hospital or blood type.</p>
                </div>
              ) : (
                filteredRequests.map(req => (
                  <div key={req.id} className={`p-8 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${req.status === 'Fulfilled' ? 'bg-green-50/50' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{req.patientName}</h3>
                        <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-[0.1em] rounded-full ${req.status === 'Fulfilled' ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600'}`}>
                          {req.status === 'Fulfilled' ? 'Safe' : req.urgency}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-5 h-5 text-blue-500" /> {req.hospitalName}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-400" /> {req.address}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Type</span>
                        <span className="text-3xl font-black text-red-600 bg-red-50 px-4 py-2 rounded-2xl border-2 border-red-100 block min-w-[70px]">
                          {req.bloodGroup}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-3 min-w-[150px]">
                        {req.status === 'Fulfilled' ? (
                          <div className="bg-green-500 text-white font-black py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-100">
                            FULFILLED ✓
                          </div>
                        ) : (
                          <button 
                            onClick={() => navigate(`/patient/${req.id}`)}
                            className="bg-gray-900 text-white py-4 px-8 rounded-2xl font-black hover:bg-red-600 transition-all shadow-xl hover:shadow-red-100 active:scale-95"
                          >
                            HELP NOW
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete('request', req.id)}
                          className="text-xs font-black text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Donors */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600" />
                Network Donors
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {donors.map(donor => (
                <div key={donor.id} className="p-6 hover:bg-indigo-50/30 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{donor.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{donor.contact}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-black text-xs ml-4">
                      {donor.blood_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
