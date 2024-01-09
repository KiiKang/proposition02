import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { lazy, startTransition} from 'react';
// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
const MapContainer = lazy(() => import('./components/MapContainer'))
const Intro = lazy(() => import('./components/Intro'))
const BlurryBackdrop = lazy(() => import('./components/BlurryBackdrop'))
const MenuBar = lazy(() => import('./components/MenuBar'))
const Filters = lazy(() => import('./components/Filters'))
const ImageReel = lazy(() => import("./views/ImageReel"));


function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><Intro/><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/></>}
        />
      <Route
          path="/map"
          element={<><MapContainer displayImages='true'/><Filters/><MenuBar/></>}
      />
      <Route
          path="/filter"
          element={<><MapContainer displayImages='true'/><Filters/><MenuBar/></>}
      />
      <Route
          path="/images"
          element={<><MapContainer displayImages='true'/><Filters/><BlurryBackdrop/><MenuBar/><ImageReel/></>}
      />
      </Routes>
    </Router>
  );
}

export default App;
