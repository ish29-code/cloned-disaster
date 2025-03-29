/*import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(
          `https://api.reliefweb.int/v1/reports/${id}?appname=disasterapp`
        );
        const data = await response.json();

        if (data.data.length) {
          setReport(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report details:", error);
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) return <p>Loading report details...</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div className="p-4">
      
      <h2 className="text-3xl font-bold mb-4">{report.fields?.title || "No Title"}</h2>

      
      <img
        src={report.fields?.file?.[0]?.preview?.url || "https://via.placeholder.com/600"}
        alt="Disaster"
        className="w-full max-h-[1500px] object-cover rounded mb-4"
      />

      
      <p className="text-gray-600 mb-2">
        <strong>Date & Time:</strong> {formatDateTime(report.fields?.date?.created)}
      </p>

     
      <p className="text-lg">
        {report.fields?.body || "No additional details available."}
      </p>
    </div>
  );
};

export default ReportDetails;*/

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(
          `https://api.reliefweb.int/v1/reports/${id}?appname=disasterapp`
        );
        const data = await response.json();

        if (data.data.length) {
          setReport(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report details:", error);
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) return <p className="text-center text-gray-600">Loading report details...</p>;
  if (!report) return <p className="text-center text-red-500">Report not found.</p>;

  const imageUrl =
    report.fields?.file?.[0]?.preview?.url || "https://via.placeholder.com/600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Fixed height spacer for navbar */}
      <div className="h-20"></div>
      <div className="p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Dashboard Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white/80 hover:text-white 
              bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 transition-all duration-300
              hover:bg-white/20 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            {/* Image Container */}
            <div className="relative w-full h-[400px] overflow-hidden">
              <img
                src={imageUrl}
                alt="Disaster"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {report.fields?.title || "No Title"}
                </h2>
                <p className="text-white/80 flex items-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDateTime(report.fields?.date?.created)}
                </p>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-8">
              {/* Source if available */}
              {report.fields?.source?.[0]?.name && (
                <div className="mb-6 flex items-center gap-2 text-white/80">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                  <span>Source: {report.fields.source[0].name}</span>
                </div>
              )}

              {/* Country if available */}
              {report.fields?.primary_country?.name && (
                <div className="mb-6 flex items-center gap-2 text-white/80">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  <span>Location: {report.fields.primary_country.name}</span>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                <div 
                  className="text-white/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: report.fields?.body || "No additional details available." 
                  }}
                />
              </div>

              {/* Tags/Categories if available */}
              {report.fields?.theme?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {report.fields.theme.map((theme, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
