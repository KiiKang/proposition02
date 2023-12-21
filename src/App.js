import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MapContainer from "./components/MapContainer";
import Intro from "./components/Intro";
import BlurryBackdrop from "./components/BlurryBackdrop";

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><MapContainer/><BlurryBackdrop/><Intro/></>}
        />
      <Route
          path="/map"
          element={<><MapContainer/></>}
      />

      </Routes>
    </Router>
  );
}

export default App;
