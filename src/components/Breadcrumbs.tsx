import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: 'arrow' | 'slash' | 'chevron';
}

export default function Breadcrumbs({ 
  items, 
  className = '',
  separator = 'arrow'
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return ' / ';
      case 'chevron':
        return ' › ';
      case 'arrow':
      default:
        return ' → ';
    }
  };

  const sep = getSeparator();

  return (
    <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumbs-item">
              {isLast ? (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link to={item.path} className="breadcrumbs-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumbs-text">{item.label}</span>
              )}
              {!isLast && <span className="breadcrumbs-separator">{sep}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


