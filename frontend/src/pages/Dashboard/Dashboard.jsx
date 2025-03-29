import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterSystem from "../../components/FilterSystem/FilterSystem";

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
  const itemsPerPage = 10;

  const buildApiUrl = () => {
    const baseUrl = 'https://api.reliefweb.int/v1/reports';
    const offset = (currentPage - 1) * itemsPerPage;
    
    // Build filter conditions array
    const conditions = [];
    
    if (selectedFilters.disasterType) {
      conditions.push({
        field: 'theme.name',
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
      'theme.name',
      'status',
      'source.name',
      'body-html',
      'url_alias'
    ].join(',');

    const url = `${baseUrl}?appname=disasterwatch&limit=${itemsPerPage}&offset=${offset}&fields=${fields}${filterQuery}&preset=latest`;
    console.log('Generated URL:', url);
    return url;
  };

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const url = buildApiUrl();
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
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
    if (disaster.fields.theme && disaster.fields.theme.length > 0) {
      return disaster.fields.theme[0].name;
    }
    return "Unknown Type";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white p-6">
      <div className="h-20"></div>
      <h2 className="text-4xl font-extrabold text-yellow-700 text-center mb-6">Active Disasters</h2>
      
      <FilterSystem 
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
      />

      {loading && disasters.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-blue-500">Loading disasters...</p>
        </div>
      ) : disasters.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No disasters found. Try adjusting your filters or check back later.</p>
          <button 
            onClick={() => {
              setSelectedFilters({
                disasterType: '',
                severity: '',
                timeFrame: ''
              });
              setCurrentPage(1);
              fetchDisasters();
            }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={disasters.length}
          next={() => setCurrentPage(prev => prev + 1)}
          hasMore={hasMore}
          loader={<p className="text-center text-blue-500">Loading more disasters...</p>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {disasters.map((disaster) => {
              const disasterType = getDisasterType(disaster);
              return (
                <div 
                  key={disaster.id}
                  className="p-4 bg-white border border-yellow-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={getImageUrl(disasterType)}
                    alt={disaster.fields.title || "Disaster Report"}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h3 className="text-xl font-bold text-blue-800 mt-3">
                    {disaster.fields.title || "Untitled Report"}
                  </h3>

                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {disasterType}
                    </span>
                    <span className="inline-block ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      {disaster.fields.status?.[0]?.name || "Unknown Status"}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2">
                    <strong>Location:</strong> {disaster.fields.primary_country?.name || "Unknown Location"}
                  </p>

                  <p className="text-gray-600 mt-1">
                    <strong>Date:</strong> {formatDateTime(disaster.fields.date?.created || disaster.fields.date)}
                  </p>

                  <Link
                    to={`/report/${disaster.id}`}
                    className="mt-3 inline-block w-full text-center bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Dashboard;
