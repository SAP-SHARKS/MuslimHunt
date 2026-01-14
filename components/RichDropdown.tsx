import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

export interface DropdownItem {
  label: string;
  subtext?: string;
  icon: LucideIcon;
  colorClass?: string;
  bgClass?: string;
  onClick?: () => void;
}

interface RichDropdownProps {
  label: string;
  items: DropdownItem[];
}

const RichDropdown: React.FC<RichDropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<string>('classic');

  // Get dropdown style from body classes on mount and when they change
  React.useEffect(() => {
    const updateDropdownStyle = () => {
      const classList = document.body.classList;
      const dropdownClass = Array.from(classList).find(c => c.startsWith('dropdown-') && !c.startsWith('dropdown-anim-'));
      if (dropdownClass) {
        const style = dropdownClass.replace('dropdown-', '');
        setDropdownStyle(style);
      }
    };

    updateDropdownStyle();

    // Watch for class changes
    const observer = new MutationObserver(updateDropdownStyle);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Render based on dropdown style
  const renderClassicLayout = () => (
    <div className="py-4">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="dropdown-item w-full flex items-start gap-4"
        >
          <div className={`dropdown-icon w-9 h-9 ${item.bgClass || 'bg-gray-50'} rounded-xl flex items-center justify-center ${item.colorClass || 'text-gray-400'} shrink-0`}>
            <item.icon className="w-4 h-4" />
          </div>
          <div className="flex flex-col pt-0.5 min-w-0 text-left">
            <p className="dropdown-text-primary">{item.label}</p>
            {item.subtext && <p className="dropdown-text-secondary line-clamp-1">{item.subtext}</p>}
          </div>
        </button>
      ))}
    </div>
  );

  const renderModernLayout = () => (
    <div className="py-3">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="dropdown-item w-full flex items-center gap-4 group"
        >
          <div className={`dropdown-icon w-11 h-11 ${item.bgClass || 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-2xl flex items-center justify-center ${item.colorClass || 'text-gray-500'} shrink-0 shadow-sm`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 text-left flex-1">
            <p className="dropdown-text-primary text-[14px]">{item.label}</p>
            {item.subtext && <p className="dropdown-text-secondary text-[11px] mt-1">{item.subtext}</p>}
          </div>
          <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-90" style={{ color: 'var(--color-primary)' }} />
        </button>
      ))}
    </div>
  );

  const renderMinimalLayout = () => (
    <div className="py-2">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="dropdown-item w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="dropdown-icon w-1 h-1 rounded-full bg-gray-300 group-hover:bg-current shrink-0" />
            <div className="flex flex-col min-w-0 text-left">
              <p className="dropdown-text-primary text-[13px]">{item.label}</p>
              {item.subtext && <p className="dropdown-text-secondary text-[10px] mt-0.5 opacity-60">{item.subtext}</p>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderCardLayout = () => (
    <div className="grid grid-cols-2 gap-3 p-3">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="dropdown-item flex flex-col items-start text-left group card-item"
        >
          <div className={`dropdown-icon w-12 h-12 ${item.bgClass || 'bg-gray-50'} rounded-xl flex items-center justify-center ${item.colorClass || 'text-gray-400'} mb-3 group-hover:shadow-md`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 w-full">
            <p className="dropdown-text-primary text-[13px] mb-1 font-bold">{item.label}</p>
            {item.subtext && <p className="dropdown-text-secondary text-[10px] line-clamp-2">{item.subtext}</p>}
          </div>
        </button>
      ))}
    </div>
  );

  const renderMegaLayout = () => {
    // Split items into 3 columns
    const itemsPerColumn = Math.ceil(items.length / 3);
    const columns = [
      items.slice(0, itemsPerColumn),
      items.slice(itemsPerColumn, itemsPerColumn * 2),
      items.slice(itemsPerColumn * 2)
    ];

    return (
      <div className="grid grid-cols-3 gap-8 p-6">
        {columns.map((columnItems, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-1">
            {columnItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="dropdown-item flex items-start gap-3 text-left group"
              >
                <div className={`dropdown-icon w-9 h-9 ${item.bgClass || 'bg-gray-50'} rounded-lg flex items-center justify-center ${item.colorClass || 'text-gray-400'} shrink-0`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="dropdown-text-primary text-[12px]">{item.label}</p>
                  {item.subtext && <p className="dropdown-text-secondary text-[10px] mt-0.5 line-clamp-1">{item.subtext}</p>}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getDropdownWidth = () => {
    if (dropdownStyle === 'mega') return 'w-[750px]';
    if (dropdownStyle === 'card') return label === "Best Products" ? 'w-[520px]' : 'w-[420px]';
    if (label === "Best Products" && dropdownStyle === 'classic') return 'w-[520px]';
    return 'w-80';
  };

  const renderContent = () => {
    switch (dropdownStyle) {
      case 'modern':
        return renderModernLayout();
      case 'minimal':
        return renderMinimalLayout();
      case 'card':
        return renderCardLayout();
      case 'mega':
        return renderMegaLayout();
      case 'classic':
      default:
        return renderClassicLayout();
    }
  };

  return (
    <div
      className="relative group h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1.5 text-[13px] font-bold text-gray-600 hover:text-primary py-4 transition-colors"
        style={isOpen ? { color: 'var(--color-primary)' } : undefined}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Invisible bridge to prevent dropdown from closing when moving mouse down */}
          <div className="absolute top-full left-0 right-0 h-2" />

          <div className={`rich-dropdown-menu ${getDropdownWidth()}`}>
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default RichDropdown;
