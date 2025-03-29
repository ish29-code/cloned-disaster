import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterSystem from "../../components/FilterSystem/FilterSystem";
import { FaFilter, FaExclamationTriangle, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaExclamationCircle } from "react-icons/fa";

const Dashboard = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    disasterType: '',
    severity: '',
    timeFrame: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const buildApiUrl = () => {
    const baseUrl = 'https://api.reliefweb.int/v1/reports';
    const offset = (currentPage - 1) * itemsPerPage;
    
    // Build filter conditions array
    const conditions = [];
    
    if (selectedFilters.disasterType) {
      conditions.push({
        field: 'primary_country.name',
        value: selectedFilters.disasterType
      });
    }
    
    if (selectedFilters.severity) {
      conditions.push({
        field: 'status',
        value: selectedFilters.severity
      });
    }
    
    if (selectedFilters.timeFrame && selectedFilters.timeFrame !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedFilters.timeFrame) {
        case '24h':
          startDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          break;
      }
      
      conditions.push({
        field: 'date.created',
        value: {
          from: startDate.toISOString()
        }
      });
    }

    // Construct the filter query
    let filterQuery = '';
    if (conditions.length > 0) {
      const filter = {
        operator: 'AND',
        conditions: conditions
      };
      filterQuery = `&filter=${encodeURIComponent(JSON.stringify(filter))}`;
    }

    // Fields to retrieve
    const fields = [
      'id',
      'title',
      'date.created',
      'primary_country.name',
      'primary_type.name',
      'status',
      'source.name',
      'body-html'
    ].join(',');

    const url = `${baseUrl}?appname=disasterwatch&limit=${itemsPerPage}&offset=${offset}&fields=${fields}${filterQuery}&preset=latest`;
    console.log('Generated URL:', url);
    return url;
  };

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      // First fetch without filters to get initial data
      const initialUrl = `https://api.reliefweb.int/v1/reports?appname=disasterwatch&limit=${itemsPerPage}&offset=0&preset=latest`;
      const response = await fetch(selectedFilters.disasterType ? buildApiUrl() : initialUrl);
      const data = await response.json();
      
      console.log('API Response:', data);

      if (!data || !data.data) {
        console.error('Invalid API response:', data);
        setLoading(false);
        setHasMore(false);
        return;
      }

      // Update the disasters based on current page
      setDisasters(prev => currentPage === 1 ? data.data : [...prev, ...data.data]);
      setHasMore(data.data.length === itemsPerPage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching disasters:", error);
      setLoading(false);
      setHasMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setDisasters([]);
    setHasMore(true);
    fetchDisasters();
  }, [selectedFilters]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchDisasters();
    }
  }, [currentPage]);

  const handleFilterChange = (newFilters) => {
    console.log('New filters:', newFilters);
    setSelectedFilters(newFilters);
  };

  const getImageUrl = (disasterType) => {
    const imageMap = {
      'Flood': '/images/flood.jpg',
      'Flash Flood': '/images/flood.jpg',
      'Tropical Cyclone': '/images/cyclone.jpg',
      'Storm': '/images/cyclone.jpg',
      'Earthquake': '/images/earthquake.jpg',
      'Drought': '/images/drought.jpg',
      'Epidemic': '/images/epidemic.jpg',
      'Landslide': '/images/landslide.jpg',
      'Tsunami': '/images/tsunami.jpg',
      'Volcano': '/images/volcano.jpg',
      'Cold Wave': '/images/cold-wave.jpg',
      'Heat Wave': '/images/heat-wave.jpg',
      'Wild Fire': '/images/wildfire.jpg'
    };
    return imageMap[disasterType] || '/images/default-disaster.jpg';
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getDisasterType = (disaster) => {
    if (disaster.fields.primary_type && disaster.fields.primary_type.name) {
      return disaster.fields.primary_type.name;
    }
    return "Unknown Type";
  };

  // Filter disasters by search term
  const filteredDisasters = disasters.filter(disaster => {
    if (!searchTerm) return true;
    
    const title = disaster.fields.title || '';
    const country = disaster.fields.primary_country?.name || '';
    const type = getDisasterType(disaster);
    
    const searchLower = searchTerm.toLowerCase();
    return (
      title.toLowerCase().includes(searchLower) ||
      country.toLowerCase().includes(searchLower) ||
      type.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 inline-block">
            Active Disasters
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time monitoring and tracking of global disasters and humanitarian crises
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search disasters by title, country, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            
            {/* Filter Label */}
            <div className="flex items-center">
              <FaFilter className="text-blue-600 mr-2" />
              <span className="font-medium text-gray-700">Filter Disasters:</span>
            </div>
          </div>
          
          {/* Filter System Component */}
          <div className="mt-4">
            <FilterSystem 
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </div>
        </div>

        {/* Status Messages and Loaders */}
        {loading && disasters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-blue-600 font-medium">Loading disasters...</p>
          </div>
        ) : filteredDisasters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FaExclamationCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700 font-medium mb-4">No disasters found with the current filters or search term.</p>
            <button 
              onClick={() => {
                setSelectedFilters({
                  disasterType: '',
                  severity: '',
                  timeFrame: ''
                });
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
            >
              Reset Filters & Search
            </button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={filteredDisasters.length}
            next={() => setCurrentPage(prev => prev + 1)}
            hasMore={hasMore && !searchTerm} // Disable infinite scroll when searching
            loader={
              <div className="text-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-blue-600">Loading more disasters...</p>
              </div>
            }
            endMessage={
              <div className="text-center py-6 text-gray-500 font-medium">
                No more disasters to load
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDisasters.map((disaster) => {
                const disasterType = getDisasterType(disaster);
                return (
                  <div 
                    key={disaster.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(disasterType)}
                        alt={disaster.fields.title || "Disaster Report"}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-white shadow-md text-gray-700">
                          {disasterType}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="text-lg font-bold text-white line-clamp-2">
                          {disaster.fields.title || "Untitled Report"}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${disaster.fields.status?.[0]?.name?.includes('alert') ? 'bg-red-100 text-red-800' : 
                            disaster.fields.status?.[0]?.name?.includes('warning') ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}
                        `}>
                          {disaster.fields.status?.[0]?.name || "Unknown Status"}
                        </span>
                        
                        {disaster.fields.source?.name && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            {disaster.fields.source.name}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-blue-500 mr-2 flex-shrink-0" />
                          <span>{disaster.fields.primary_country?.name || "Unknown Location"}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2 flex-shrink-0" />
                          <span>{formatDateTime(disaster.fields.date?.created || disaster.fields.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 mt-auto">
                      <Link
                        to={`/report/${disaster.id}`}
                        className="block w-full py-2 px-4 text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:shadow-md transition-all hover:from-blue-600 hover:to-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
