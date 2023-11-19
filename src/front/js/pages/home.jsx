// Recommendations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const Recommendations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [recommendations, setRecommendations] = useState({
    tracks: [],
    albums: [],
    artists: [],
  });
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [topTracksModal, setTopTracksModal] = useState({
    isOpen: false,
    tracks: [],
  });

  useEffect(() => {
    if (!searchTerm) return;

    const accessToken = 'BQAMg4w65FnzP1TAqdg30J1xXzO9XO-FRWlCBpvF_MNMojYtBngr-Ut2OPoeWym0kTsqn57UFWKjJ2EvIL7Y_V5buu4QQbSnwucyx_grEictCd2uU37F05C2sb1Q66PcNKpWw44FoktmqITN1d7dmNJ6BfChebSZ2jb51RVbCui8RlZ_Dghqqrg7vY0oPrgpZjXu_N3EAIpPjFl-xSqoXTLnVj8-';

    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?type=artist&q=${searchTerm}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        const artistId = response.data.artists.items[0].id;
        setSelectedArtist(response.data.artists.items[0]);
        return axios({
          method: 'get',
          url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        setRecommendations(response.data);
        return axios({
          method: 'get',
          url: `https://api.spotify.com/v1/artists/${selectedArtist.id}/related-artists`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        setRelatedArtists(response.data.artists);
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
      });
  }, [searchTerm, selectedArtist]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchTopTracks = (artistId) => {
    const accessToken = 'BQAMg4w65FnzP1TAqdg30J1xXzO9XO-FRWlCBpvF_MNMojYtBngr-Ut2OPoeWym0kTsqn57UFWKjJ2EvIL7Y_V5buu4QQbSnwucyx_grEictCd2uU37F05C2sb1Q66PcNKpWw44FoktmqITN1d7dmNJ6BfChebSZ2jb51RVbCui8RlZ_Dghqqrg7vY0oPrgpZjXu_N3EAIpPjFl-xSqoXTLnVj8-';

    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setTopTracksModal({
          isOpen: true,
          tracks: response.data.tracks,
        });
      })
      .catch((error) => {
        console.error('Error fetching top tracks:', error);
      });
  };

  const handleCloseTopTracksModal = () => {
    setTopTracksModal({
      isOpen: false,
      tracks: [],
    });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '50%', height: 'auto' }}>
      <h1>Spotify Recommendations</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search for an artist"
        value={searchTerm}
        onChange={handleSearch}
      />

      {selectedArtist && (
        <div className="card mb-3">
          <img
            src={selectedArtist.images[0].url}
            className="card-img-top"
            alt={selectedArtist.name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="card-body">
            <h5 className="card-title">{selectedArtist.name}</h5>
            <p className="card-text">Popularity: {selectedArtist.popularity}</p>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        {recommendations.tracks && recommendations.tracks.map((track) => (
          <div key={track.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{track.name}</h5>
                <p className="card-text">Artist: {track.artists.map((artist) => artist.name).join(', ')}</p>
                <button className="btn btn-primary" onClick={() => fetchTopTracks(track.artists[0].id)}>View Top Tracks</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h2>Related As</h2>
        <div className="row">
          {relatedArtists && relatedArtists.map((relatedArtist) => (
            <div key={relatedArtist.id} className="col-md-6 mb-3">
              <div className="card">
                <img
                  src={relatedArtist.images[0].url}
                  className="card-img-top"
                  alt={relatedArtist.name}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{relatedArtist.name}</h5>
                  <p className="card-text">Popularity: {relatedArtist.popularity}</p>
                  <button className="btn btn-info" onClick={() => fetchTopTracks(relatedArtist.id)}>View Top Tracks</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Top Tracks */}
      {topTracksModal.isOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Top Tracks</h5>
                <button type="button" className="close" onClick={handleCloseTopTracksModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {topTracksModal.tracks.map((track) => (
                  <div key={track.id} className="mb-3">
                    <h6>{track.name}</h6>
                    <ReactPlayer url={track.preview_url} controls />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
