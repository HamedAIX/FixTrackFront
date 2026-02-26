import "./Input.css";

function Input({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  pattern,
  placeholder,
  dir = "rtl",
}) {
  const handleChange = (e) => {
    if (inputMode === "numeric") {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      onChange({ target: { value: numericValue } });
    } else {
      onChange(e);
    }
  };

  // نمنع الأحرف غير الرقمية أثناء الكتابة عند الحقول الرقمية.
  const handleKeyDown = (e) => {
    if (inputMode === "numeric") {
      if (
        [8, 46, 9, 27, 13, 110, 190].includes(e.keyCode) ||
        (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode))
      ) {
        return;
      }
      if (
        (e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputMode={inputMode}
        pattern={inputMode === "numeric" ? "[0-9]*" : pattern}
        placeholder={placeholder}
        dir={dir}
      />
    </div>
  );
}

export default Input;
