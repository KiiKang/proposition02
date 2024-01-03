import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from 'react';

// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
const MapContainer = lazy(() => import('./components/MapContainer'))
const Intro = lazy(() => import('./components/Intro'))
const BlurryBackdrop = lazy(() => import('./components/BlurryBackdrop'))
const MenuBar = lazy(() => import('./components/MenuBar'))
const Filters = lazy(() => import('./components/Filters'))

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/><Intro/></>}
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
          element={<><MapContainer/><Filters/><BlurryBackdrop/><MenuBar/></>}
      />
      </Routes>
    </Router>
  );
}

export default App;
