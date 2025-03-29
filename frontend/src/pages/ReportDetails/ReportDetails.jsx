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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-yellow-50 to-white p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
          {report.fields?.title || "No Title"}
        </h2>

        <img
          src={imageUrl}
          alt="Disaster"
          className="w-full max-h-[500px] object-cover rounded-lg shadow-md mb-4"
        />

        <p className="text-gray-700 mb-3 text-lg">
          <strong>Date & Time:</strong> {formatDateTime(report.fields?.date?.created)}
        </p>

        <p className="text-gray-600 text-lg leading-relaxed">
          {report.fields?.body || "No additional details available."}
        </p>

        {/* Back to Dashboard Button */}
        <Link
          to="/dashboard"
          className="mt-6 inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-medium 
          hover:bg-yellow-600 transition duration-300"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ReportDetails;
