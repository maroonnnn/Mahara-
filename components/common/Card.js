export default function Card({ children, className = '', hover = false, clickable = false }) {
  const hoverClass = hover ? 'hover:shadow-medium hover:-translate-y-1' : '';
  const clickableClass = clickable ? 'cursor-pointer' : '';
  const baseClass = 'bg-white rounded-lg shadow-soft p-6 transition-all duration-300';
  
  return (
    <div className={`${baseClass} ${hoverClass} ${clickableClass} ${className}`}>
      {children}
    </div>
  );
}

