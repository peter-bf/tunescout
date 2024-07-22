import React, { useEffect, useState } from 'react';
import { getSpotifyTrackDetails, getSpotifyArtistDetails } from './API';

const TrackModal = ({ track, isVisible, onClose, modalRef }) => {
  const [spotifyDetails, setSpotifyDetails] = useState(null);
  const [artistDetails, setArtistDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchSpotifyDetails = async () => {
      if (!track.trackDetails?.album?.release_date || !track.trackDetails?.genres) {
        const details = await getSpotifyTrackDetails(track.name, track.artist);
        setSpotifyDetails(details);
      }
      if (!track.artistDetails) {
        const artist = await getSpotifyArtistDetails(track.artist);
        setArtistDetails(artist);
      }
    };
    fetchSpotifyDetails();
  }, [track]);

  const getReleaseDate = () => {
    return track.trackDetails?.album?.release_date || spotifyDetails?.album?.release_date || 'N/A';
  };

  const getGenres = () => {
    const genres = track.trackDetails?.genres || spotifyDetails?.album?.genres || [];
    return genres.map(capitalize).join(', ') || 'N/A';
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }
    setComments([...comments, `User 1: ${newComment}`]);
    setNewComment('');
    setError('');
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-all duration-300 ease-in-out ${
        isVisible ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-none pointer-events-none'
      } flex items-center justify-center z-50`}
    >
      <div
        ref={modalRef}
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative transition-all duration-300 ease-in-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } overflow-y-auto max-h-[90vh]`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">{track.name}</h2>
            <p className="text-xl mb-2"><strong>Artist:</strong> {track.artist}</p>
            {track.trackDetails?.album?.name && track.trackDetails?.album?.name !== track.name && (
              <p className="text-xl mb-2"><strong>Album:</strong> {track.trackDetails.album.name}</p>
            )}
            <p className="text-xl mb-6"><strong>Streams:</strong> {formatNumber(track.playcount)}</p>
            <iframe
              src={`https://open.spotify.com/embed/track/${spotifyDetails?.id || track.id}`}
              width="100%"
              height="152"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              className="mb-6 rounded"
              title="Track Player"
            ></iframe>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2">Additional Stats</h3>
              <ul className="list-disc pl-5 text-lg">
                {track.trackDetails?.album?.release_date || spotifyDetails?.album?.release_date ? (
                  <li><strong>Release Date:</strong> {getReleaseDate()}</li>
                ) : null}
                {track.trackDetails?.duration_ms || spotifyDetails?.duration_ms ? (
                  <li>
                    <strong>Duration:</strong>{' '}
                    {`${Math.floor((track.trackDetails?.duration_ms || spotifyDetails.duration_ms) / 60000)}:${Math.floor(((track.trackDetails?.duration_ms || spotifyDetails.duration_ms) % 60000) / 1000)
                      .toString()
                      .padStart(2, '0')}`}
                  </li>
                ) : null}
                {track.artistDetails?.genres?.length > 0 || spotifyDetails?.album?.genres?.length > 0 ? (
                  <li>
                    <strong>Genre:</strong> {getGenres()}
                  </li>
                ) : null}
                {track.trackDetails?.popularity && (
                  <li><strong>Popularity:</strong> {track.trackDetails.popularity}/100</li>
                )}
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-6 flex flex-col">
            <div className="mb-6">
              <img src={artistDetails?.images?.[0]?.url || ''} alt={track.artist} className="w-40 h-40 rounded-full mx-auto" loading="lazy" />
            </div>
            {track.trackDetails?.album && track.trackDetails.album.id && (
              <iframe
                src={`https://open.spotify.com/embed/album/${track.trackDetails.album.id}`}
                width="100%"
                height="380"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
                className="rounded flex-grow"
                title="Album Player"
              ></iframe>
            )}
          </div>
        </div>
        
        {/* Comment Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              placeholder="Write a comment..."
              rows="1"
              maxLength="70"
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              type="submit"
              className="mt-2 bg-primary text-white px-5 py-2 rounded-full hover:bg-red-500 transition duration-300"
            >
              Post Comment
            </button>
          </form>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md">
                <p>{comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackModal;
