const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-soft-teal text-off-white hover:bg-opacity-90 focus:ring-soft-teal",
    secondary:
      "bg-dark-grey text-off-white hover:bg-opacity-90 focus:ring-dark-grey",
    outline:
      "border-2 border-soft-teal text-soft-teal hover:bg-soft-teal hover:text-off-white focus:ring-soft-teal",
    ghost: "text-dark-grey hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-red-500 text-off-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
