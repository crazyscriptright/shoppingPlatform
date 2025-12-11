import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-3",
  };

  return (
    <div className={`flex justify-center items-center py-20 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-soft-teal`}
      ></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default LoadingSpinner;
