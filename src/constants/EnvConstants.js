const SPOTIFY_BASE = "https://api.spotify.com/v1";

export const APP_API_BASE = "http://localhost:8000/api/playlists";

export const SPOTIFY_ENDPOINT_USER = SPOTIFY_BASE + "/me";

export const SPOTIFY_ENDPOINT_PLAYLISTS = SPOTIFY_ENDPOINT_USER + "/playlists";

export const spotifyEndpointTracks = (playlistId) =>
  `${SPOTIFY_BASE}/playlists/${playlistId}/tracks`;

export const spotifyEndpointUnfollowPlaylist = (playlistId) =>
  `${SPOTIFY_BASE}/playlists/${playlistId}/followers`;

export const spotifyHeaders = (token) => {
  return { Authorization: "Bearer " + token };
};
