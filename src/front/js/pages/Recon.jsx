// Recommendations.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Recon.css'; // Correct import statement
import Navbar from '../component/navbar'



const Recommendations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [recommendations, setRecommendations] = useState({
    tracks: [],
    albums: [],
    artists: [],
  });
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioRef] = useState(() => new Audio());
  const [showTopTracksModal, setShowTopTracksModal] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!searchTerm) return;

    const accessToken = 'BQCtimy6hzovW8ugQVGfdd9E6hWBM-mmYg7-bDUNv9rEUGuPC-H4Rd1IZJJ_pyawEavkopc_njWK1ocCfXKH-FD6WL_ddWS4KF-uiv3c2UFvrSzeiJXVbzQxnCurCe7ppPVkaClPviaN3cKFYF4F1a1MhF_X9Sihtg1Ov4IlcFMyjDdAMi1PmUMdWin6PmUyIBqgdVVKSdXIRf7YzygOzHg9LuKv';

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

      const input = document.getElementById('artistSearchInput');
      if (input) {
        input.classList.add('swipe-in');
      }
  
  }, [searchTerm, selectedArtist]);



  

  const playTrack = (previewUrl) => {
    if (currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }

    if (audioRef.current) {
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setCurrentTrack(audioRef.current);

      // Stop the audio after 30 seconds
      setTimeout(stopAudio, 30000);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const fetchTopTracks = (artistId) => {
    const accessToken = 'BQCtimy6hzovW8ugQVGfdd9E6hWBM-mmYg7-bDUNv9rEUGuPC-H4Rd1IZJJ_pyawEavkopc_njWK1ocCfXKH-FD6WL_ddWS4KF-uiv3c2UFvrSzeiJXVbzQxnCurCe7ppPVkaClPviaN3cKFYF4F1a1MhF_X9Sihtg1Ov4IlcFMyjDdAMi1PmUMdWin6PmUyIBqgdVVKSdXIRf7YzygOzHg9LuKv';

    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setTopTracks(response.data.tracks);
        setShowTopTracksModal(true);
      })
      .catch((error) => {
        console.error('Error fetching top tracks:', error);
      });
  };

  const handleCloseModal = () => {
    setShowTopTracksModal(false);
  };

  

  return (
    <div className="container mt-5 justify-content-center" style={{ maxWidth: '50%', height: 'auto', }}>
      <Navbar/>
      {/* Bootstrap Jumbotron for larger header banner */}
      <div className="jumbotron text-center" style={{ marginTop: '100px', backgroundColor: '#343a40', color: '#fff' }}>
        <h1 className="display-4">Recommendations</h1>
        {/* Add additional content or description if needed */}
      </div>
      <input
        type="text"
        className="form-control mb-3 swipe-in" // Add the animation class here
        id="artistSearchInput"
        placeholder="Search for an artist"
        value={searchTerm}
        onChange={handleSearch}
      />
      {selectedArtist && (
        <div className="card mb-5 mx-auto" style={{ maxWidth: "40rem", marginLeft: "50px" }}>
        <img
          src={selectedArtist.images[0].url}
          className="card-img-top"
          alt={selectedArtist.name}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{selectedArtist.name}</h5>
          <p className="card-text">Popularity: {selectedArtist.popularity}</p>
        </div>
      </div>
      
      )}

<div className="row justify-content-center">
  <h2>Related Tracks</h2> 
  {recommendations.tracks && recommendations.tracks.map((track) => (
    <div key={track.id} className="col-md-4 mb-5">
    <div className="card text-center">
      <img
        src={track.album.images[0].url}  
        className="card-img-top"
        alt={track.name}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="card-body text-center">
        <h5 className="card-title text-center">{track.name}</h5>
        <p className="card-text text-center">Artists: {track.artists.map((artist) => artist.name).join(', ')}</p>
        {/* Add your play button here */}
        <button className="btn btn-primary" onClick={() => playTrack(track.preview_url)}>Play</button>
      </div>
    </div>
  </div>
  
  ))}
</div>


      <div className="mt-5">
      <h2>Related Artists</h2>
      <div className="row">
        {relatedArtists &&
          relatedArtists.map((relatedArtist) => (
            <div key={relatedArtist.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="image-container">
                  <img
                    src={relatedArtist.images[0].url}
                    className="card-img-top"
                    alt={relatedArtist.name}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{relatedArtist.name}</h5>
                  <p className="card-text">Popularity: {relatedArtist.popularity}</p>
                  <button
                    className="btn btn-info"
                    onClick={() => fetchTopTracks(relatedArtist.id)}
                  >
                    View Top Tracks
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
      <div/>

      {/* Modal for Top Tracks */}
      {showTopTracksModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Top Tracks</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {topTracks.map((track) => (
                    <li key={track.id} className="list-group-item">
                      {track.name}
                      <button
                        className="btn btn-sm btn-primary ml-2"
                        onClick={() => playTrack(track.preview_url)}
                      >
                        Play
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef}></audio>
    </div>
  );
};

export default Recommendations;
