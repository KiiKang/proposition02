import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, {lazy, useEffect, useState, Suspense} from 'react';
import axios from "axios";
import tsvToArray from "./helpers";
// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
import ImageReel from "./views/ImageReel";
const MapContainer = lazy(() => import('./components/MapContainer'))
const Intro = lazy(() => import('./components/Intro'))
const BlurryBackdrop = lazy(() => import('./components/BlurryBackdrop'))
const MenuBar = lazy(() => import('./components/MenuBar'))
const Filters = lazy(() => import('./components/Filters'))
// const ImageReel = lazy(() => import("./views/ImageReel"));

function App() {
    const [data, setData] = useState([]);
    const [filteredYear, setFilteredYear] = useState(null);
    const [filteredCountry, setFilteredCountry] = useState(null);

    useEffect(() => {
        console.log(filteredYear)
    }, [filteredYear])

    useEffect(()=> {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                setData(tsvToArray(response.data));
            } catch (err) {
                console.log(err.message);
                setData(null);
            }
        }
        getData()
    }, [])

  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<>
                <Intro data={data}/>
                <MapContainer data={data}
                              year={filteredYear}
                              country={filteredCountry}
                />
                <Filters onYearChange={setFilteredYear} onCountryChange={setFilteredCountry}/>
                <BlurryBackdrop/>
                <MenuBar/>
            </>}
        />
      <Route
          path="/map"
          element={<>
              <MapContainer data={data}
                            year={filteredYear}
                            country={filteredCountry}
                            displayImages={true}/>
              <Filters onYearChange={setFilteredYear} onCountryChange={setFilteredCountry}/>
              <MenuBar/>
          </>}
      />
      {/*<Route*/}
      {/*    path="/filter"*/}
      {/*    element={<>*/}
      {/*        <MapContainer data={data} year={filteredYear} displayImages={true}/>*/}
      {/*        <Filters/>*/}
      {/*        <MenuBar/>*/}
      {/*    </>}*/}
      {/*/>*/}
      <Route
          path="/images"
          element={<>
              <MapContainer data={data} year={filteredYear} displayImages={true}/>
              <Filters/>
              <BlurryBackdrop bg={true}/>
              <MenuBar/>
              <ImageReel data={data}/>
          </>}
      />
      </Routes>
    </Router>
  );
}

export default App;
