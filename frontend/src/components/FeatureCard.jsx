import PropTypes from "prop-types";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-4 lg:p-6">
      <div className="bg-soft-teal text-off-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
        {icon}
      </div>
      <h3
        className="text-lg lg:text-xl font-normal text-dark-grey mb-1 lg:mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="text-sm lg:text-base text-dark-grey/60 font-light">
        {description}
      </p>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
