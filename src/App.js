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
import ImagePresentation from "./views/ImagePresentation";
import Home from "./views/Home";
// import Map from "./views/Map";
import MapContainer from "./components/MapContainer";
import Filters from "./components/Filters";
import Text from "./views/Text";
import {GrClose} from "react-icons/gr";
import {Authenticator, useAuthenticator} from "@aws-amplify/ui-react";
import {Hub} from "aws-amplify/utils";
import Intro from "./components/Intro";
import BlurryBackdrop from "./components/BlurryBackdrop";

function App() {
    const [data, setData] = useState([]);
    const [filteredYear, setFilteredYear] = useState(null);
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [center, setCenter] = useState(null);
    const [user, setUser] = useState(null);

    const [timer, setTimer] = useState(0);

    const [showAuth, setShowAuth] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const { toSignUp, toSignIn } = useAuthenticator(
        ({ toSignUp, toSignIn }) => [
            toSignUp,
            toSignIn,
        ]
    );
    const shout = (r) => {
        if (r.payload.event === "signedIn") {
            setShowAuth(false);
            window.location.reload();
        }
    }
    Hub.listen('auth', shout);
    useEffect(() => {
        if (isSignUp) toSignUp()
        else toSignIn()
    }, [isSignUp])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTimer(prev => prev + 1);
    //     }, 1000);
    //     setFilteredYear(timer % 9 + 1946);
    //     return () => clearInterval(interval);
    // }, [timer]);

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
                      user={user}
                      country={filteredCountry}
                      onShowAuth={setShowAuth}
                      onInOrUp={setIsSignUp}
        />
        <Filters data={data}
                 onYearChange={setFilteredYear}
                 onCountryChange={setFilteredCountry}/>
        <Routes>
          <Route
              path="/"
              element={<><BlurryBackdrop/>
                  <Intro
                    data={data}
                    user={user}
                    onShowAuth={setShowAuth}
                    onInOrUp={setIsSignUp}
                  /></>}
          />
          <Route
              path="/map"
              element={<div/>}
          />
          <Route
            path="/images"
            element={<Image data={data} user={user}/>}
          />
          <Route
            path="/p"
            element={<><BlurryBackdrop bg="red"/><ImagePresentation  data={data} user={user}/></>}
          />
          <Route
              path="/r/:textId"
              // element={<Text onCenterChange={setCenter}/>}
              element={<Text/>}
          />
        </Routes>
        {   showAuth ?
            <div className='auth-container bg-gray-50'>
                <div className='close'
                     onClick={() => setShowAuth(false)}
                >
                    <GrClose size={18}/>
                </div>
                <div className='auth'>
                    <Authenticator loginMechanism="email" initialState= {isSignUp ? "signUp":"signIn"} />
                </div>
            </div> : <div/>
        }
    </Router>
  );
}

export default App;
