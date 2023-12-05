import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MapContainer from "./components/MapContainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={<><MapContainer/></>}
        />
      </Routes>
    </Router>
  );
}

export default App;
