import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Heart, ArrowLeft, Hospital, Calendar, AlertCircle } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${API_URL}/api/requests`);
        const data = await response.json();
        const found = data.find(p => p.id.toString() === id);
        setPatient(found);
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-900 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Patient Not Found</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-6 text-red-600 font-bold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-red-700 font-bold hover:text-red-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-200/50 overflow-hidden border border-red-100">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Heart className="w-32 h-32 fill-current" />
            </div>
            
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block border border-white/20">
                Critical Need
              </span>
              <h1 className="text-5xl font-black tracking-tight mb-2">{patient.patientName}</h1>
              <p className="text-red-100 text-lg flex items-center gap-2 font-medium">
                <Calendar className="w-5 h-5" /> Age: {patient.age} years old
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-10 space-y-10">
            {/* Blood Type Badge */}
            <div className="flex items-center justify-between p-8 bg-red-50 rounded-3xl border border-red-100">
              <div>
                <p className="text-red-900/40 text-xs font-black uppercase tracking-widest mb-1">Required Blood Type</p>
                <p className="text-6xl font-black text-red-600 tracking-tighter">{patient.bloodGroup}</p>
              </div>
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Droplet className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <Hospital className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Hospital Name</p>
                    <p className="text-xl font-bold text-gray-900 leading-tight">{patient.hospitalName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Full Address</p>
                    <p className="text-gray-900 font-medium leading-relaxed">{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Contact Phone</p>
                    <p className="text-2xl font-black text-gray-900">{patient.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Urgency Level</p>
                    <p className={`text-xl font-black ${patient.urgency === 'Immediate' ? 'text-red-600' : 'text-amber-600'}`}>
                      {patient.urgency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${patient.phoneNumber}`}
                className="flex-1 bg-red-600 text-white py-5 px-8 rounded-2xl font-black text-center shadow-xl shadow-red-200 hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-95"
              >
                CALL IMMEDIATELY
              </a>
              <button 
                onClick={() => alert('Location shared! Navigation starting...')}
                className="flex-1 bg-gray-900 text-white py-5 px-8 rounded-2xl font-black text-center shadow-xl shadow-gray-200 hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
              >
                NAVIGATE TO HOSPITAL
              </button>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 text-center">
            <p className="text-red-900/60 text-sm font-bold">
              Your help can save {patient.patientName.split(' ')[0]}'s life today. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
