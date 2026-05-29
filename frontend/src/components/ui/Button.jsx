export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading,
  disabled,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
