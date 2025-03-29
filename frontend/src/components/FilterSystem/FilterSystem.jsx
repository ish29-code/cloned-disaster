import React from 'react';

const FilterSystem = ({ onFilterChange, selectedFilters }) => {
  const disasterTypes = [
    { id: 'Flood', name: 'Flood' },
    { id: 'Tropical Cyclone', name: 'Tropical Cyclone' },
    { id: 'Earthquake', name: 'Earthquake' },
    { id: 'Drought', name: 'Drought' },
    { id: 'Epidemic', name: 'Epidemic' },
    { id: 'Landslide', name: 'Landslide' },
    { id: 'Tsunami', name: 'Tsunami' },
    { id: 'Volcano', name: 'Volcano' },
    { id: 'Cold Wave', name: 'Cold Wave' },
    { id: 'Heat Wave', name: 'Heat Wave' },
    { id: 'Wild Fire', name: 'Wild Fire' }
  ];

  const severityLevels = [
    { id: 'alert', name: 'Alert' },
    { id: 'ongoing', name: 'Ongoing' },
    { id: 'past', name: 'Past' }
  ];

  const timeFrames = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: 'all', name: 'All Time' }
  ];

  const handleFilterClick = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: selectedFilters[filterType] === value ? '' : value
    };
    console.log('Applying filter:', filterType, value);
    onFilterChange(newFilters);
  };

  const getButtonClass = (filterType, value) => {
    const isSelected = selectedFilters[filterType] === value;
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isSelected
        ? 'bg-yellow-500 text-white'
        : 'bg-white text-gray-700 hover:bg-yellow-100'
    } border border-yellow-300`;
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Disaster Types */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Disaster Type</h3>
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

      {/* Severity Levels */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Status</h3>
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

      {/* Time Frames */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Time Frame</h3>
        <div className="flex flex-wrap gap-2">
          {timeFrames.map((time) => (
            <button
              key={time.id}
              onClick={() => handleFilterClick('timeFrame', time.id)}
              className={getButtonClass('timeFrame', time.id)}
            >
              {time.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSystem; 