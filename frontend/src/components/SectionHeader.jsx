import PropTypes from "prop-types";

const SectionHeader = ({
  title,
  subtitle,
  action,
  alignment = "left",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 lg:mb-12 gap-4 ${className}`}
    >
      <div className={alignment === "center" ? "text-center w-full" : ""}>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-normal text-dark-grey leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-dark-grey/60 mt-1 text-sm lg:text-base font-light">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  alignment: PropTypes.oneOf(["left", "center"]),
  className: PropTypes.string,
};

export default SectionHeader;
