import "./Button.css";

function Button({
  text,
  onClick,
  type = "primary",
  variant,
  buttonType = "button",
  disabled = false,
  className = "",
}) {
  const buttonStyle = variant || type;

  return (
    <button
      className={`btn btn-${buttonStyle} ${className}`.trim()}
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
