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
import Filters from "./components/Filters";

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
      </Routes>
    </Router>
  );
}

export default App;
