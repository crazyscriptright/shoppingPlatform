import { ArrowRight } from "lucide-react";
import PropTypes from "prop-types";

const CategoryCard = ({ image, title, showArrow = false }) => {
  return (
    <div className="bg-off-white border border-warm-grey/30 rounded-lg p-4 text-center hover:shadow-lg transition">
      <div className="aspect-square bg-warm-grey/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-dark-grey font-light">{title}</p>
        {showArrow && <ArrowRight size={16} className="text-dark-grey" />}
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showArrow: PropTypes.bool,
};

export default CategoryCard;
