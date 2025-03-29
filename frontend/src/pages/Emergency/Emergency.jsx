import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaCamera, FaExclamationTriangle, FaPaperPlane, FaSpinner, FaHeartbeat, FaShieldAlt, FaInfoCircle, FaTrash } from 'react-icons/fa';

const Emergency = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('emergency');
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');

  const emergencyContacts = [
    { name: 'National Emergency Number', number: '112', icon: <FaHeartbeat className="text-red-600" /> },
    { name: 'Police', number: '100', icon: <FaShieldAlt className="text-blue-600" /> },
    { name: 'Fire', number: '101', icon: <FaExclamationTriangle className="text-orange-600" /> },
    { name: 'Ambulance', number: '102', icon: <FaHeartbeat className="text-red-600" /> },
    { name: 'Disaster Management', number: '108', icon: <FaInfoCircle className="text-teal-600" /> },
  ];

  const emergencyTypes = [
    'Medical Emergency',
    'Fire',
    'Flood',
    'Earthquake',
    'Cyclone',
    'Other'
  ];

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
          setMessage('Location successfully captured');
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Unable to get your location. Please try again.');
          setLoading(false);
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setMessage('Please share your location first');
      return;
    }
    
    if (!emergencyType) {
      setMessage('Please select emergency type');
      return;
    }
    
    setLoading(true);
    setMessage('Sending emergency alert...');
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Emergency alert sent successfully! Help is on the way.');
      setLoading(false);
      
      // Reset form fields after successful submission
      setDescription('');
      setEmergencyType('');
      setPhotos([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Emergency Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="px-6 sm:px-10 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-6 sm:mb-0">
                <div className="relative mr-4">
                  <FaExclamationTriangle className="text-white text-4xl sm:text-5xl" />
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                    Emergency Alert Center
                  </h1>
                  <p className="text-red-100 text-lg mt-1 max-w-2xl">
                    Quick access to emergency services and immediate assistance
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('emergency')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'emergency' 
                      ? 'bg-white text-red-700'
                      : 'bg-red-800 text-white hover:bg-red-900'
                  }`}
                >
                  Report Emergency
                </button>
                <button 
                  onClick={() => setActiveTab('contacts')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'contacts' 
                      ? 'bg-white text-red-700'
                      : 'bg-red-800 text-white hover:bg-red-900'
                  }`}
                >
                  Emergency Contacts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {activeTab === 'emergency' ? (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Emergency Type Selection */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <FaExclamationTriangle className="text-blue-700 text-2xl" />
                  <h2 className="text-xl font-bold text-blue-900">Emergency Type</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmergencyType(type)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        emergencyType === type
                          ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-red-700 text-2xl" />
                    <h2 className="text-xl font-bold text-red-900">Your Location</h2>
                  </div>
                  <button
                    type="button"
                    onClick={getLocation}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg disabled:bg-red-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="text-white animate-spin" />
                        <span className="font-medium">Getting Location...</span>
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt className="text-white" />
                        <span className="font-medium">Share Location</span>
                      </>
                    )}
                  </button>
                </div>
                
                {location && (
                  <div className="mt-4 bg-white p-4 rounded-lg border border-red-200 relative">
                    <h3 className="font-medium text-gray-700 mb-2">Your Current Coordinates:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 mr-2">Latitude:</span>
                        <span className="text-red-700 font-mono bg-red-50 px-2 py-1 rounded">{location.latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 mr-2">Longitude:</span>
                        <span className="text-red-700 font-mono bg-red-50 px-2 py-1 rounded">{location.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <FaInfoCircle className="text-gray-700 text-2xl" />
                  <h2 className="text-xl font-bold text-gray-900">Emergency Description</h2>
                </div>
                
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the emergency situation in detail..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                ></textarea>
              </div>

              {/* Photo Upload Section */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <FaCamera className="text-purple-700 text-2xl" />
                  <h2 className="text-xl font-bold text-purple-900">Upload Photos (Optional)</h2>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <label className="block mb-2 font-medium text-gray-700">Select Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  {photos.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-700">Uploaded Photos ({photos.length})</h3>
                        <button
                          type="button"
                          onClick={() => setPhotos([])}
                          className="text-red-600 text-sm hover:text-red-700 flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          <span>Remove All</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo.preview}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-bold text-lg shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-900 hover:scale-[1.01] flex items-center justify-center"
                disabled={loading || !location}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>Sending Alert...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaPaperPlane className="mr-2" />
                    Send Emergency Alert
                  </span>
                )}
              </button>

              {/* Message Display */}
              {message && (
                <div 
                  className={`p-4 rounded-xl ${
                    message.includes('success') 
                      ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                      : 'bg-red-100 text-red-800 border-2 border-red-300'
                  } text-center font-bold shadow-sm animate-fadeIn`}
                >
                  {message}
                </div>
              )}
            </form>
          ) : (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaPhone className="text-red-600 mr-2" />
                  Emergency Contact Numbers
                </h2>
                <p className="text-gray-600">
                  Call these numbers in case of emergency. Available 24/7 for immediate assistance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200 hover:border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                          {contact.icon}
                        </div>
                        <span className="font-bold text-gray-800">{contact.name}</span>
                      </div>
                      <a
                        href={`tel:${contact.number}`}
                        className="text-red-600 hover:text-red-800 text-xl font-bold flex items-center space-x-2 hover:scale-105 transition-transform duration-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg"
                      >
                        <FaPhone className="text-sm" />
                        <span>{contact.number}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800">Important Information</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Please provide your location and clear details about the emergency when calling these numbers. 
                      Stay calm and follow the instructions provided by emergency responders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emergency; 