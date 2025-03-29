import React from 'react';
import { FaFilter, FaExclamationTriangle, FaClock, FaTags } from 'react-icons/fa';

const FilterSystem = ({ onFilterChange, selectedFilters }) => {
  const disasterTypes = [
    { id: 'Flood', name: 'Flood' },
    { id: 'Tropical Cyclone', name: 'Cyclone' },
    { id: 'Earthquake', name: 'Earthquake' },
    { id: 'Drought', name: 'Drought' },
    { id: 'Epidemic', name: 'Epidemic' },
    { id: 'Landslide', name: 'Landslide' },
    { id: 'Tsunami', name: 'Tsunami' },
    { id: 'Volcano', name: 'Volcano' }
  ];

  const severityLevels = [
    { id: 'alert', name: 'Alert' },
    { id: 'warning', name: 'Warning' },
    { id: 'ongoing', name: 'Ongoing' }
  ];

  const timeFrames = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: 'all', name: 'All Time' }
  ];

  const handleFilterClick = (filterType, filterId) => {
    const newFilters = { ...selectedFilters };
    
    // If clicking on the same filter, toggle it off
    if (newFilters[filterType] === filterId) {
      newFilters[filterType] = '';
    } else {
      newFilters[filterType] = filterId;
    }
    
    onFilterChange(newFilters);
  };

  const getButtonClass = (filterType, filterId) => {
    const isSelected = selectedFilters[filterType] === filterId;
    
    return `px-3 py-2 text-sm md:text-base rounded-lg transition-all duration-200 ${
      isSelected
        ? 'bg-blue-600 text-white shadow-md transform scale-105 font-medium'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
    }`;
  };

  return (
    <div className="space-y-4">
      {/* Filter Section Headers */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaFilter className="text-blue-600 mr-2" />
          Disaster Filters
        </h3>
        
        {Object.values(selectedFilters).some(value => value !== '') && (
          <button
            onClick={() => onFilterChange({ disasterType: '', severity: '', timeFrame: '' })}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Filter Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Disaster Type Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center text-sm">
            <FaTags className="text-blue-500 mr-2" />
            Disaster Type
          </h4>
          <div className="flex flex-wrap gap-2">
            {disasterTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleFilterClick('disasterType', type.id)}
                className={getButtonClass('disasterType', type.id)}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center text-sm">
            <FaExclamationTriangle className="text-orange-500 mr-2" />
            Severity Level
          </h4>
          <div className="flex flex-wrap gap-2">
            {severityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleFilterClick('severity', level.id)}
                className={getButtonClass('severity', level.id)}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Frame Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center text-sm">
            <FaClock className="text-green-500 mr-2" />
            Time Frame
          </h4>
          <div className="flex flex-wrap gap-2">
            {timeFrames.map((timeFrame) => (
              <button
                key={timeFrame.id}
                onClick={() => handleFilterClick('timeFrame', timeFrame.id)}
                className={getButtonClass('timeFrame', timeFrame.id)}
              >
                {timeFrame.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.values(selectedFilters).some(value => value !== '') && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-800 font-medium flex flex-wrap items-center gap-2">
            <span>Active Filters:</span>
            {selectedFilters.disasterType && (
              <span className="px-2 py-1 bg-blue-100 rounded-md text-blue-700 flex items-center">
                Type: {selectedFilters.disasterType}
              </span>
            )}
            {selectedFilters.severity && (
              <span className="px-2 py-1 bg-orange-100 rounded-md text-orange-700 flex items-center">
                Severity: {selectedFilters.severity}
              </span>
            )}
            {selectedFilters.timeFrame && (
              <span className="px-2 py-1 bg-green-100 rounded-md text-green-700 flex items-center">
                Time: {timeFrames.find(t => t.id === selectedFilters.timeFrame)?.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSystem; 