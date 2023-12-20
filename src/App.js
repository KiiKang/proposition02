import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MapContainer from "./components/MapContainer";
import Intro from "./components/Intro";

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><MapContainer/><Intro/></>}
        />
      </Routes>
    </Router>
  );
}

export default App;
