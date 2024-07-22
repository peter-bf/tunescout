import React from 'react';

const ArtistCard = ({ artist, index, onClick }) => {
  const formatNumber = (num) => {
    if (num === undefined || num === null) {
      return 'N/A';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick(artist);
    }
  };

  return (
    <div
      key={artist.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-glow hover:bg-gray-100 w-48 h-64"
      onClick={() => onClick(artist)}
      onKeyPress={handleKeyPress}
      tabIndex="0" // Make the artist card focusable
      role="button"
      aria-label={`Artist ${artist.name}`}
    >
      {artist.images && artist.images[0] && (
        <img src={artist.images[0].url} alt={artist.name} className="w-full h-36 object-cover" loading="lazy" draggable="false" />
      )}
      <div className="p-2">
        <h3 className="font-bold text-xs truncate">
          {index !== undefined ? <span className="mr-1">{index + 1}.</span> : null}
          {artist.name}
        </h3>
        {index !== undefined ? (
          <>
            <p className="text-xs text-red-600 truncate">Genres: {artist.genres.join(', ')}</p>
            <p className="text-xs text-black-500">Followers: {formatNumber(artist.followers)}</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ArtistCard;
