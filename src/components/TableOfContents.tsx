import { useState, useEffect, useRef } from 'react';
import './TableOfContents.css';

export interface TableOfContentsSection {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  sections: TableOfContentsSection[];
  className?: string;
  sticky?: boolean;
  collapsible?: boolean;
}

export default function TableOfContents({
  sections,
  className = '',
  sticky = true,
  collapsible = true
}: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tocRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    // Set up Intersection Observer to track active section
    const observers: IntersectionObserver[] = [];
    const options: IntersectionObserverInit = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(handleIntersection, options);
        observer.observe(element);
        observers.push(observer);
      }
    });

    // Set initial active section
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveSection(sectionId);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      ref={tocRef}
      className={`table-of-contents ${className} ${sticky ? 'sticky' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      aria-label="Table of Contents"
    >
      {collapsible && (
        <button
          className="toc-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        >
          <span className="toc-toggle-icon">{isCollapsed ? '▶' : '▼'}</span>
          <span className="toc-toggle-text">Table of Contents</span>
        </button>
      )}
      {(!collapsible || !isCollapsed) && (
        <ol className="toc-list">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`toc-item toc-level-${section.level} ${activeSection === section.id ? 'active' : ''}`}
            >
              <button
                className="toc-link"
                onClick={() => scrollToSection(section.id)}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}


