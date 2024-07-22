import axios from 'axios';

// Please don't do anything bad with these!!!!
const clientId = '7c6b8a3ea0e3406b9d8e5974be8b442b';
const clientSecret = '49aa02d0a85249279ae8ab73bbef28f5';
const lastFmApiKey = '28c425ac5fe3a7288e17efe8d7f9f82c';

let spotifyToken = null;
let tokenExpiry = null;

const getSpotifyToken = async () => {
  if (spotifyToken && tokenExpiry && tokenExpiry > Date.now()) {
    return spotifyToken;
  }

  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    params: {
      grant_type: 'client_credentials'
    }
  });

  spotifyToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return spotifyToken;
};

const getSpotifyTrackDetails = async (trackName, artistName) => {
  const token = await getSpotifyToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      q: `track:${trackName} artist:${artistName}`,
      type: 'track',
      limit: 1
    }
  });

  if (response.data.tracks.items.length > 0) {
    return response.data.tracks.items[0];
  }

  return null;
};

const getSpotifyTrackImages = async (trackName, artistName) => {
  const track = await getSpotifyTrackDetails(trackName, artistName);
  return track?.album?.images[1]?.url || '';
};

const getSpotifyArtistDetails = async (artistName) => {
  const token = await getSpotifyToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      q: `artist:${artistName}`,
      type: 'artist',
      limit: 1
    }
  });

  if (response.data.artists.items.length > 0) {
    return response.data.artists.items[0];
  }

  return null;
};

const getLastFmTopTracks = async () => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.gettoptracks',
        api_key: lastFmApiKey,
        format: 'json',
        limit: 50
      }
    });
    return Promise.all(response.data.tracks.track.map(async (track) => {
      const image = await getSpotifyTrackImages(track.name, track.artist.name);
      const spotifyDetails = await getSpotifyTrackDetails(track.name, track.artist.name);
      return {
        id: track.mbid || track.name, // Use name as fallback if mbid is not available
        name: track.name,
        artist: track.artist.name,
        image,
        playcount: track.playcount,
        spotifyDetails
      };
    }));
  } catch (error) {
    console.error('Failed to fetch Last.FM top tracks', error);
    return [];
  }
};

const getLastFmTopArtists = async (limit = 50) => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.gettopartists',
        api_key: lastFmApiKey,
        format: 'json',
        limit
      }
    });
    return Promise.all(response.data.artists.artist.map(async (artist) => {
      const spotifyDetails = await getSpotifyArtistDetails(artist.name);
      return {
        id: artist.mbid,
        name: artist.name,
        genres: spotifyDetails?.genres || [],
        followers: spotifyDetails?.followers.total || artist.listeners,
        popularity: spotifyDetails?.popularity || artist.playcount,
        images: spotifyDetails?.images || [{ url: artist.image[2]['#text'] }] // Using the medium-sized image
      };
    }));
  } catch (error) {
    console.error('Failed to fetch Last.FM top artists', error);
    return [];
  }
};

const getLastFmTrackDetails = async (trackId) => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'track.getInfo',
        api_key: lastFmApiKey,
        mbid: trackId,
        format: 'json'
      }
    });
    return response.data.track;
  } catch (error) {
    console.error('Failed to fetch Last.FM track details', error);
    return null;
  }
};

const getLastFmTrackTags = async (artist, track) => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'track.getTopTags',
        api_key: lastFmApiKey,
        artist: artist,
        track: track,
        format: 'json'
      }
    });
    return response.data.toptags.tag.map(tag => tag.name);
  } catch (error) {
    console.error('Failed to fetch Last.FM track tags', error);
    return [];
  }
};

const getLastFmArtistDetails = async (artist) => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.getInfo',
        api_key: lastFmApiKey,
        artist: artist,
        format: 'json'
      }
    });
    const artistData = response.data.artist;
    return {
      ...artistData,
      images: artistData.image.map(img => ({ url: img['#text'] }))
    };
  } catch (error) {
    console.error('Failed to fetch Last.FM artist details', error);
    return null;
  }
};

export { getLastFmTopTracks, getLastFmTopArtists, getLastFmTrackDetails, getLastFmArtistDetails, getLastFmTrackTags, getSpotifyTrackDetails, getSpotifyArtistDetails, getSpotifyToken };
