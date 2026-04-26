import React, { useState } from 'react';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    bloodGroup: 'A+',
    hospitalName: '',
    address: '',
    phoneNumber: '',
    urgency: 'Immediate',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Emergency request broadcasted successfully!');
        setFormData({
          patientName: '',
          age: '',
          bloodGroup: 'A+',
          hospitalName: '',
          address: '',
          phoneNumber: '',
          urgency: 'Immediate',
        });
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to send request. Is MongoDB running?'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Could not connect to the server. Please check if the backend is running.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-red-600 py-6 px-8 text-white">
          <h2 className="text-2xl font-bold">Emergency Blood Request</h2>
          <p className="text-red-100 mt-1">Broadcast an urgent request to nearby donors.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="45" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group Needed</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white">
                <option value="Immediate">Immediate (Within 2 hrs)</option>
                <option value="24 Hours">Next 24 Hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic Name</label>
            <input type="text" name="hospitalName" required value={formData.hospitalName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="City General Hospital" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
            <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="123 Health Ave, Medical District"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone Number</label>
            <input type="tel" name="phoneNumber" required pattern="[0-9]{10}" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="1234567890" />
            <p className="text-xs text-gray-500 mt-1">10-digit mobile number</p>
          </div>

          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition shadow-md">
            Broadcast Emergency Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
