import React from 'react';

function Navbar({ isVisible }) {
  return (
    <nav className={`bg-background/80 backdrop-blur-sm text-text sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">TuneScout</div>
        <ul className="flex space-x-6">
          {['Home', 'Discover', 'Playlists', 'Artists'].map((item) => (
            <li key={item}>
              <button className="hover:text-primary transition duration-300 ease-in-out relative group">
                {item}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;