import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=6&sort[]=date:desc&page=${page}`
      );
      const data = await response.json();

      if (!data.data.length) {
        setHasMore(false);
        return;
      }

      const uniqueReports = [
        ...new Map(data.data.map((report) => [report.id, report])).values()
      ];

      setReports((prevReports) => [...prevReports, ...uniqueReports]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white p-6">
      <h2 className="text-4xl font-extrabold text-yellow-700 text-center mb-6">Disaster Reports</h2>

      <InfiniteScroll
        dataLength={reports.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={<p className="text-center text-blue-500">Loading more reports...</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => {
            const imageUrl = report.fields?.file?.[0]?.preview?.url;

            return (
              <div 
                key={`${report.id}-${index}`} 
                className="p-4 bg-white border border-yellow-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={imageUrl}
                  alt={report.fields?.title || "Disaster Image"}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; 
                  }}
                />

                <h3 className="text-xl font-bold text-blue-800 mt-3">
                  {report.fields?.title || "No Title"}
                </h3>

                <p className="text-gray-600 mt-1">
                  <strong>Date & Time:</strong> {formatDateTime(report.fields?.date?.created)}
                </p>

                <Link
                  to={`/report/${report.id}`}
                  className="mt-3 inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                >
                  Read more
                </Link>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
