import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Navbar from "../component/navbar";

const SearchPage = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("artist");
  const [searchResults, setSearchResults] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [showTopTracksModal, setShowTopTracksModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedArtistInfo, setSelectedArtistInfo] = useState(null);

  const [selectedAlbumTracks, setSelectedAlbumTracks] = useState([]);
  const [showAlbumTracksModal, setShowAlbumTracksModal] = useState(false);

  const handleViewAlbumTracks = async (albumId) => {
    try {
      const accessToken = "BQDhlXbnFjICFVAE9hy5Kmj_nMeUCtt8DS8d4Lo7zMR1AWjkzSspvy7m14ZBe37FBH9zI715rMyHJJ-DMgaISepZZZtY6DJQTREeQaijBvR42LOrxn7_F-c1SmRoKDPFSrlgJ1k85fQTh4vlepfNG5pGVqQB2wOxHstjeB1m9PImPIPx0q7QJqLP7yqvQI3wmPMGov9thy4SxCHU1RbcKhyuTprL "; // Replace with your actual access token

      // Fetch tracks for the selected album
      const albumTracksResponse = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSelectedAlbumTracks(albumTracksResponse.data.items);
      setShowAlbumTracksModal(true);
    } catch (error) {
      console.error("Error fetching album tracks:", error);
    }
  };

  const handleCloseAlbumTracksModal = () => {
    setShowAlbumTracksModal(false);
    setSelectedAlbumTracks([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken =
          "BQA8wB80x_p4JBPmBr8OzUTxwuhD9nYgy82Jc0XM4tVml52-N0cKkNE3ZVDWbGpWyfQ49AB5ujznr4n7uvHLT5kwoBcsGjOg3JkuiPoMx9OTQ8dPh-R39BepxCErANizHN-G_zGFenaD1Gw5Nh8EGqJzYE_FQe5oAMqu17ijr5pHPDzdKpaco_y0KGS2SSgyF721ZQ9JN9nBsE1kESDQTz9NZZ11";
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${searchTerm}&type=${searchType}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSearchResults(response.data[searchType + "s"].items || []);
      } catch (error) {
        console.error("Error fetching data from Spotify API:", error);
      }
    };

    // Fetch data when the component mounts or when searchTerm or searchType changes
    fetchData();
  }, [searchTerm, searchType]);

  const handleSearch = (event) => {
    event.preventDefault();
    // Trigger a re-fetch when the search button is clicked
    fetchData();
  };

  const playPreview = (previewUrl) => {
    // Pause and reset the current track
    if (currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }

    const audio = new Audio(previewUrl);
    setCurrentTrack(audio); // Set the current track
    audio.play();
  };

  const handleViewTopTracks = async (artistId) => {
    try {
      const accessToken =
        "BQA8wB80x_p4JBPmBr8OzUTxwuhD9nYgy82Jc0XM4tVml52-N0cKkNE3ZVDWbGpWyfQ49AB5ujznr4n7uvHLT5kwoBcsGjOg3JkuiPoMx9OTQ8dPh-R39BepxCErANizHN-G_zGFenaD1Gw5Nh8EGqJzYE_FQe5oAMqu17ijr5pHPDzdKpaco_y0KGS2SSgyF721ZQ9JN9nBsE1kESDQTz9NZZ11";
      // Fetch top tracks
      const topTracksResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Fetch detailed artist information
      const artistInfoResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setTopTracks(topTracksResponse.data.tracks);
      setSelectedArtistInfo(artistInfoResponse.data);
      setShowTopTracksModal(true);
    } catch (error) {
      console.error("Error fetching top tracks or artist information:", error);
    }
  };

  const handleCloseTopTracksModal = () => {
    // Pause and reset the current track
    if (currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }

    setShowTopTracksModal(false);
    setTopTracks([]);
    setCurrentTrack(null);
    setSelectedArtistInfo(null);
  };

  return (
    <div>
      <Navbar/>
      <Form onSubmit={handleSearch}>
  <Form.Group controlId="formSearch" style={{ marginTop: '100px ',marginLeft:'200px' }}>
    <Row>
      <Col md={6} xs={12}> {/* Reduce the md size and add xs size for smaller screens */}
        <Form.Control
          type="text"
          placeholder={`Search for ${searchType}s`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Col>
      <Col md={3} xs={6}> {/* Reduce the md size and add xs size for smaller screens */}
        <DropdownButton
          id="dropdown-search-type"
          title={`Search for ${searchType}s`}
        >
          <Dropdown.Item onClick={() => setSearchType("artist")}>
            Artist
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType("track")}>
            Track
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType("album")}>
            Album
          </Dropdown.Item>
        </DropdownButton>
      </Col>
      <Col md={3} xs={6} > {/* Reduce the md size and add xs size for smaller screens */}
        <Button type="submit" className="btn btn-primary" >
          Search
        </Button>
      </Col>
    </Row>
  </Form.Group>
</Form>


      <Row>
        {searchResults.map((result) => (
          <Col key={result.id} md={3} style={{marginTop:'100px'}}>
            <Card>
              <Card.Img
                variant="top"
                src={result.images ? result.images[0]?.url : ""}
              />
              <Card.Body>
                <Card.Title>{result.name}</Card.Title>
                {result.artists && result.artists[0] && (
                  <Card.Text>{result.artists[0].name}</Card.Text>
                )}
                {result.album && (
                  <Card.Text>Album: {result.album.name}</Card.Text>
                )}

                {searchType === "album" && (
                  <div>
                    <Button
                      variant="primary"
                      onClick={() => handleViewAlbumTracks(result.id)}
                    >
                      View All Tracks
                    </Button>
                  </div>
                )}

                {searchType === "track" && (
                  <Button
                    variant="success"
                    onClick={() => playPreview(result.preview_url)}
                  >
                    Play Preview
                  </Button>
                )}
                {searchType === "artist" && (
                  <div>
                    <Card.Text>Followers: {result.followers.total}</Card.Text>
                    <Card.Text>Genres: {result.genres.join(", ")}</Card.Text>
                    <Card.Text>Popularity: {result.popularity}</Card.Text>
                    <Button
                      variant="info"
                      onClick={() => handleViewTopTracks(result.id)}
                    >
                      View Top Tracks
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Show album tracks modal */}
      {showAlbumTracksModal && (
        <Modal show={showAlbumTracksModal} onHide={handleCloseAlbumTracksModal}>
          <Modal.Header closeButton>
            <Modal.Title>All Tracks</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {selectedAlbumTracks.map((track) => (
                <li key={track.id}>
                  {/* Adjust this part based on your track data */}
                  <Button
                    variant="outline-success"
                    onClick={() => playPreview(track.preview_url)}
                  >
                    Play
                  </Button>{' '}
                  {track.name}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAlbumTracksModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Show top tracks modal */}
      {showTopTracksModal && (
        <Modal show={showTopTracksModal} onHide={handleCloseTopTracksModal}>
          <Modal.Header closeButton>
            <Modal.Title>Top Tracks</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {topTracks.map((track) => (
                <li key={track.id}>
                  <Button
                    variant="outline-success"
                    onClick={() => playPreview(track.preview_url)}
                  >
                    Play
                  </Button>{" "}
                  {track.name}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTopTracksModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        
      )}
    </div>
  );
};

export default SearchPage;
