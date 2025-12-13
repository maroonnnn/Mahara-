export default function Card({ children, className = '', hover = false }) {
  const hoverClass = hover ? 'hover:shadow-lg' : '';
  
  return (
    <div className={`card ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

