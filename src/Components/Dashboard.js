import axios from "axios";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import Table from "./Table";

function Dashboard({ Logout }) {
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [filterWindProb, setFilterWindProb] = useState("");
  const [toggleAdd, setToggleAdd] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);

  const spotValues = { name: "", country: "", month: "", lat: "", long: "" };
  const [addSpot, setAddSpot] = useState(spotValues);

  const toggleAddSpot = () => {
    setToggleAdd((current) => !current);
    setAddSpot(spotValues);
  };
  const toggleFilterBtn = () => {
    setToggleFilter((current) => !current);
    setFilterCountry("");
    setFilterWindProb("");
    getSpots(spots);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setAddSpot({ ...addSpot, [name]: value });
  };

  const getSpots = async () => {
    const response = await axios.get(
      "https://62543bbd89f28cf72b5a6911.mockapi.io/spot"
    );
    if (response) {
      const spots = response.data;
      setSpots(spots);
    }
  };

  const getFavorites = async () => {
    const response = await axios.get(
      "https://62543bbd89f28cf72b5a6911.mockapi.io/favourites"
    );
    if (response) {
      const favorites = response.data;
      setFavorites(favorites);
    }
  };

  const addFavorites = async (favorite) => {
    const response = await axios.post(
      "https://62543bbd89f28cf72b5a6911.mockapi.io/favourites",
      favorite
    );
    if (response) {
      const favorite = response.data;
      const newFavorites = favorites.push(favorite);
      getFavorites(favorites);
    }
  };

  const removeFavorite = async (id) => {
    await axios
      .delete(`https://62543bbd89f28cf72b5a6911.mockapi.io/favourites/${id}`)
      .then((response) => getFavorites(favorites.pop(response.data)));
  };

  const submitAddedSpot = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://62543bbd89f28cf72b5a6911.mockapi.io/spot",
      addSpot
    );
    if (response) {
      const addedSpot = response.data;
      const newSpots = spots.push(addedSpot);
      getSpots(spots);
    }
    setToggleAdd((current) => !current);
  };

  const filterSpots = (e) => {
    e.preventDefault();
    spots.filter((spot) => {
      if (
        spot.country.toLowerCase() === filterCountry.toLowerCase() &&
        spot.probability === Number(filterWindProb)
      ) {
        setSpots([spot]);
        setFilterCountry("");
        setFilterWindProb("");
        setToggleFilter((current) => !current);
      }
    });
  };

  const favoriteIcon = new L.Icon({
    iconUrl: require("./resources/star-on.png"),
    iconSize: [20, 20],
  });
  const spotIcon = new L.Icon({
    iconUrl: require("./resources/star-off.png"),
    iconSize: [20, 20],
  });
  useEffect(() => {
    getSpots();
    getFavorites();
  }, []);

  return (
    <div className="dashboard">
      <div className="navBar">
        <h2 className="logo">Kite</h2>
        <button className="logoutBtn" onClick={Logout}>
          Logout
        </button>
      </div>
      <div className="addSpot" style={{ display: toggleAdd ? "flex" : "none" }}>
        <h2>Add Spot</h2>
        <form className="column" onSubmit={submitAddedSpot}>
          <label htmlFor="name">Name:</label>
          <input
            type="string"
            name="name"
            value={addSpot.name}
            required
            className="addInput"
            onChange={changeHandler}
          />
          <label>Country:</label>
          <input
            type="string"
            name="country"
            value={addSpot.country}
            required
            className="addInput"
            onChange={changeHandler}
          />
          <label>High Season:</label>
          <input
            type="date"
            name="month"
            value={addSpot.month}
            required
            className="addInput"
            onChange={changeHandler}
          />
          <label>Lattitude:</label>
          <input
            type="number"
            name="lat"
            min="-90"
            max="90"
            value={addSpot.lat}
            required
            className="addInput"
            onChange={changeHandler}
          />
          <label>Longitude:</label>
          <input
            type="number"
            name="long"
            min="-180"
            max="180"
            value={addSpot.long}
            required
            className="addInput"
            onChange={changeHandler}
          />
          <div>
            <button type="submit" className="confirmBtn">
              Confirm
            </button>
            <button type="button" className="cancelBtn" onClick={toggleAddSpot}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="forms">
        <div
          className="filter"
          style={{ display: toggleFilter ? "flex" : "none" }}
        >
          <form className="column" onSubmit={filterSpots}>
            <label htmlFor="country">Country:</label>
            <input
              type="string"
              name="country"
              value={filterCountry}
              className="addInput"
              onChange={(country) => setFilterCountry(country.target.value)}
            />

            <label>Wind Probability:</label>
            <input
              type="number"
              name="month"
              value={filterWindProb}
              min="1"
              max="100"
              className="addInput"
              onChange={(probability) =>
                setFilterWindProb(probability.target.value)
              }
            />
            <div className="row">
              <button type="submit" className="confirmBtn">
                Apply filter
              </button>
              <button
                type="button"
                className="cancelBtn"
                onClick={toggleFilterBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mapContainer">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={2}
          className="map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.long]}
              icon={
                favorites.map((spot) => spot.name).includes(spot.name)
                  ? favoriteIcon
                  : spotIcon
              }
            >
              <Popup position={[spot.lat, spot.long]}>
                <div>
                  <h2 className="spotName">{spot.name} </h2>
                  <h3 className="country">{spot.country} </h3>
                  <h3 className="details">Wind probability:</h3>
                  <h3 className="detailsData">{spot.probability + "%"}</h3>
                  <h3 className="details">Lattitude:</h3>
                  <h3 className="detailsData">{spot.lat}</h3>
                  <h3 className="details">Longitude:</h3>
                  <h3 className="detailsData">{spot.long}</h3>
                  <h3 className="details">When to go:</h3>
                  <h3 className="detailsData">{spot.month}</h3>
                  {favorites
                    .map((favorite) => favorite.name)
                    .includes(spot.name) ? (
                    <button
                      className="removeFavorite"
                      onClick={() => {
                        removeFavorite(spot.id);
                      }}
                    >
                      REMOVE FAVORITE
                    </button>
                  ) : (
                    <button
                      className="addFavorites"
                      onClick={() => {
                        addFavorites(spot);
                      }}
                    >
                      ADD FAVORITE
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="btnColumn">
          <button className="addBtn" onClick={toggleAddSpot}>
            Add spot
          </button>
          <button className="filterBtn" onClick={toggleFilterBtn}>
            Filter
          </button>
        </div>
      </div>

      <Table></Table>
    </div>
  );
}

export default Dashboard;
