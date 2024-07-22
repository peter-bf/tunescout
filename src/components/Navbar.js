import React from 'react';

function Navbar({ onLinkClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (section) => {
    scrollToTop();
    onLinkClick(section);
  };

  return (
    <nav className="bg-zinc-950/100 backdrop-blur-sm text-text sticky top-0 z-50 transition-transform duration-300">
      <div className="container mx-auto container-padding py-3 flex justify-between items-center">
        <a
          href="#home"
          className="text-3xl font-bold text-primary"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('Home');
          }}
        >
          TuneScout
        </a>
        <ul className="flex space-x-10 text-lg">
          {['Home', 'Trending', 'Artists', 'Discover', 'FAQ'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="hover:text-white text-primary transition duration-300 ease-in-out relative group"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item);
                }}
              >
                {item}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
