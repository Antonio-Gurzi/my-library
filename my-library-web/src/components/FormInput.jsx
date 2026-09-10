function FormInput({ type, name, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-amber-700 rounded-md px-3 py-2 bg-amber-50 text-stone-800 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
    />
  );
}

export default FormInput;