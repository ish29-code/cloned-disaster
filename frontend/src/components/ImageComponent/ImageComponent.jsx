import React from "react";

const ImageComponent = ({ src, alt }) => {
  const placeholderImage = "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <img
      src={src || placeholderImage}
      alt={alt || "Disaster Report"}
      className="w-full h-48 object-cover rounded"
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = placeholderImage;
      }}
    />
  );
};

export default ImageComponent;
