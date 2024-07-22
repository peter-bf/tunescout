import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from 'react-query';
import { getLastFmTopTracks, getLastFmTrackDetails, getLastFmArtistDetails, getLastFmTrackTags } from './API';
import TrackCard from './TrackCard';
import TrackTable from './TrackTable';
import TrackModal from './TrackModal';

const Trending = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef(null);

  const { data: tracks, error, isLoading } = useQuery('topTracks', async () => {
    const lastFmTracks = await getLastFmTopTracks();
    return Promise.all(
      lastFmTracks.map(async (lastFmTrack) => {
        const trackDetails = await getLastFmTrackDetails(lastFmTrack.id);
        const tags = await getLastFmTrackTags(lastFmTrack.artist, lastFmTrack.name);
        return { ...lastFmTrack, trackDetails, tags };
      })
    );
  });

  const handleTrackClick = useCallback(async (track) => {
    setSelectedTrack(track);
    try {
      const artistDetails = await getLastFmArtistDetails(track.artist);
      setSelectedTrack((prev) => ({ ...prev, artistDetails }));
    } catch (err) {
      console.error('Failed to fetch artist details', err);
    }
    setIsModalVisible(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedTrack(null);
    }, 300);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closePopup();
      }
    };

    if (isModalVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalVisible, closePopup]);

  if (error) return <p className="text-red-500 text-center mt-4">Failed to fetch top songs</p>;
  if (isLoading) return <p className="text-center mt-4">Loading...</p>;

  // Sort tracks by playcount
  const sortedTracks = [...tracks].sort((a, b) => b.playcount - a.playcount);

  const topSixTracks = sortedTracks.slice(0, 6);
  const remainingTracks = sortedTracks.slice(6);

  return (
    <div className="p-4 mb-3">
      <h1 className="text-5xl font-bold text-center mb-5 text-red-600">Trending (Top 50)</h1>
      <div className="flex">
        <div className="w-1/2 pr-4 grid grid-cols-3 gap-4" style={{ height: '700px' }}>
          {topSixTracks.map((track, index) => (
            <TrackCard key={track.id || index} track={track} index={index} onClick={handleTrackClick} />
          ))}
        </div>
        <div className="w-1/2 pl-4" style={{ height: '700px' }}>
          <TrackTable tracks={remainingTracks} onClick={handleTrackClick} />
        </div>
      </div>

      {selectedTrack && <TrackModal track={selectedTrack} isVisible={isModalVisible} onClose={closePopup} modalRef={modalRef} />}
    </div>
  );
};

export default React.memo(Trending);