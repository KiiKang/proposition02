import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { lazy, useEffect, useState } from 'react';
import {getCurrentUser} from "aws-amplify/auth";
import axios from "axios";
import './App.css';
import tsvToArray from "./helpers";
// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
// import ImageReel from "./views/ImageReel";
// const MapContainer = lazy(() => import('./components/MapContainer'))
// const BlurryBackdrop = lazy(() => import('./components/BlurryBackdrop'))
// const MenuBar = lazy(() => import('./components/MenuBar'))
// const Filters = lazy(() => import('./components/Filters'))
// const ImageReel = lazy(() => import("./views/ImageReel"));
import Image from "./views/Image";
import Home from "./views/Home";
// import Map from "./views/Map";
import MapContainer from "./components/MapContainer";
import Filters from "./components/Filters";
import Text from "./views/Text";

function App() {
    const [data, setData] = useState([]);
    const [filteredYear, setFilteredYear] = useState(null);
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [center, setCenter] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then(user => setUser(user.username))
            .catch(err => {
                setUser(null)
            })
    }, [])

    useEffect(()=> {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                setData(tsvToArray(response.data));
            } catch (err) {
                setData(null);
            }
        }
        getData()
    }, [])

  return (
    <Router>
        <MapContainer data={data}
                      year={filteredYear}
                      center={center}
                      country={filteredCountry}/>
        <Filters data={data}
                 onYearChange={setFilteredYear}
                 onCountryChange={setFilteredCountry}/>
        <Routes>
          <Route
              path="/"
              element={<Home data={data} user={user}/>}
          />
          <Route
              path="/map"
              element={<div/>}
          />
          <Route
            path="/images"
            element={<Image data={data}/>}
          />
          <Route
              path="/r/:textId"
              // element={<Text onCenterChange={setCenter}/>}
              element={<Text/>}
          />
      </Routes>
    </Router>
  );
}

export default App;
