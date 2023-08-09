import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import React from "react";
import ImageReel from "./views/ImageReel";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Filters from "./components/Filters";
// import ImageCard from "./components/ImageCard";

const BlurryBackdrop = React.lazy(() => import('./components/BlurryBackdrop'));
const Intro = React.lazy(() => import('./components/Intro'));
const MenuBar = React.lazy(() => import('./components/MenuBar'));
// const WorldMap = React.lazy(() => import('./components/WorldMap'));
const MapContainer = React.lazy(() => import('./components/MapContainer'));

function App() {

    return (
      <Router>
          <Routes>
              <Route
                  path="/"
                  element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/><Intro/></>}
              />
              <Route
                  path="/login"
                  element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/><SignIn/></>}
              />
              <Route
                  path="/signup"
                  element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/><SignUp/></>}
              />
              <Route
                  path="/map"
                  element={<><MapContainer/><Filters/><MenuBar/></>}
              />
              <Route
                  path="/filter"
                  element={<><MapContainer/><Filters/><MenuBar/></>}
              />
              <Route
                  path="/images"
                  element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/><ImageReel/></>}
              />
          </Routes>
      </Router>
  );
}

export default App;
