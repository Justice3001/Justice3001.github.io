import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../component/navbar";
import "./Recon.css";

const Recommendations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [recommendations, setRecommendations] = useState({
    tracks: [],
    albums: [],
    artists: [],
  });
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioRef] = useState(() => new Audio());
  const [topTracks, setTopTracks] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!searchTerm) return;

    const accessToken = "BQAXWq5knXuHvOm_1J32DYa6JO5PJ-U9rZ5BMCtZ1u7HD17PUuZoT7ClUUPJqlldh638-kDNZimvn9mGdLBjb1YbYTvF_UXKXsLsmmrIqp77NFN9NSei9U_lo76TvIhpQbbl4JwqB0eJNuFI0GGbLbLq80iwSvNbwAJm_wkhS6uWfHnxq619i_MO2hP4h2itRa2aaAdqilgEC2o89R7-k5JnQRKa ";

    axios({
      method: "get",
      url: `https://api.spotify.com/v1/search?type=artist&q=${searchTerm}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        const artistId = response.data.artists.items[0].id;
        setSelectedArtist(response.data.artists.items[0]);
        return axios({
          method: "get",
          url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then((response) => {
        setRecommendations(response.data);
        return axios({
          method: "get",
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
        console.error("Error fetching recommendations:", error);
      });

    const input = document.getElementById("artistSearchInput");
    if (input) {
      input.classList.add("swipe-in");
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

  useEffect(() => {
    if (selectedArtist) {
      fetchTopTracks(selectedArtist.id);
    }
  }, [selectedArtist]);

  const fetchTopTracks = (artistId) => {
    const accessToken = "BQAXWq5knXuHvOm_1J32DYa6JO5PJ-U9rZ5BMCtZ1u7HD17PUuZoT7ClUUPJqlldh638-kDNZimvn9mGdLBjb1YbYTvF_UXKXsLsmmrIqp77NFN9NSei9U_lo76TvIhpQbbl4JwqB0eJNuFI0GGbLbLq80iwSvNbwAJm_wkhS6uWfHnxq619i_MO2hP4h2itRa2aaAdqilgEC2o89R7-k5JnQRKa";

    axios({
      method: "get",
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setTopTracks(response.data.tracks);
      })
      .catch((error) => {
        console.error("Error fetching top tracks:", error);
      });
  };

  // ... (previous code)

return (
  <div className="container mt-5">
    <Navbar />

    <div className="jumbotron text-center">
      <h1 className="display-4">Recommendations</h1>
    </div>

    <input
      type="text"
      className="form-control mb-3 swipe-in"
      id="artistSearchInput"
      placeholder="Search for an artist"
      value={searchTerm}
      onChange={handleSearch}
    />

    {selectedArtist && (
      <div className="card mb-5 mx-auto" style={{ maxWidth: "50rem" }}>
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
      {recommendations.tracks &&
        recommendations.tracks.map((track) => (
          <div key={track.id} className="col-md-4 mb-5">
            <div className="card text-center">
              <img
                src={track.album.images[0].url}
                className="card-img-top"
                alt={track.name}
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title text-center">{track.name}</h5>
                <p className="card-text text-center">
                  Artists:{" "}
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => playTrack(track.preview_url)}
                >
                  Play
                </button>
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
                  <p className="card-text">
                    Popularity: {relatedArtist.popularity}
                  </p>
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

    {topTracks.length > 0 && (
      <div className="row mt-4">
        <h2>Top Tracks</h2>
        {topTracks.map((track) => (
          <div key={track.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={track.album.images[0].url}
                className="card-img-top"
                alt={track.name}
              />
              <div className="card-body">
                <h5 className="card-title">{track.name}</h5>
                <p className="card-text">
                  Artists: {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => playTrack(track.preview_url)}
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    <audio ref={audioRef}></audio>
  </div>
);

};

export default Recommendations;
