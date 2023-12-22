import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MapContainer from "./components/MapContainer";
import Intro from "./components/Intro";
import BlurryBackdrop from "./components/BlurryBackdrop";
import MenuBar from "./components/MenuBar";

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><MapContainer/><BlurryBackdrop/><MenuBar/><Intro/></>}
        />
      <Route
          path="/map"
          element={<><MapContainer/><MenuBar/></>}
      />
      </Routes>
    </Router>
  );
}

export default App;
