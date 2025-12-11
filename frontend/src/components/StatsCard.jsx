import PropTypes from "prop-types";

const StatsCard = ({
  icon,
  title,
  value,
  trend,
  bgColor = "bg-warm-grey/20",
}) => {
  return (
    <div className={`${bgColor} p-5 rounded-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-grey/70 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-dark-grey">{value}</p>
          {trend && (
            <p className="text-xs text-soft-teal mt-2 flex items-center gap-1">
              {trend}
            </p>
          )}
        </div>
        <div className="text-soft-teal p-3 bg-soft-teal/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.node,
  bgColor: PropTypes.string,
};

export default StatsCard;
