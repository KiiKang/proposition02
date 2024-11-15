import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {getCurrentUser, signOut} from "aws-amplify/auth";
import axios from "axios";
import './App.css';
import tsvToArray from "./helpers";
// import Cookies from "js-cookie";
import "./views/Authenticator.css"
// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
import Image from "./views/Image";
// import ImagePresentation from "./views/ImagePresentation";
// import Home from "./views/Home";
// import Map from "./views/Map";
import MapContainer from "./components/MapContainer";
import Filters from "./components/Filters";
import Text from "./views/Text";
import {GrClose} from "react-icons/gr";
import {Authenticator, useAuthenticator} from "@aws-amplify/ui-react";
import {Hub} from "aws-amplify/utils";
import Intro from "./components/Intro";
import BlurryBackdrop from "./components/BlurryBackdrop";
import {collection, getDocs, onSnapshot, doc} from "firebase/firestore";
import {db} from "./utils/firebase";

const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

function App() {
    const [adminProps, setAdminProps] = useState({locked: false});
    // const annoCollection = collection(db, "anno");
    const [isMobile, setIsMobile] = useState(false);

    const [data, setData] = useState([]);
    // const [annoData, setAnnoData] = useState([]);
    const [filteredYear, setFilteredYear] = useState(null);
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [center, setCenter] = useState(null);
    const [user, setUser] = useState(null);

    // const [timer, setTimer] = useState(0);

    const [showAuth, setShowAuth] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const { toSignUp, toSignIn } = useAuthenticator(
        ({ toSignUp, toSignIn }) => [
            toSignUp,
            toSignIn,
        ]
    );
    useEffect(() => {
        setIsMobile(isMobileDevice());
        if (isMobileDevice()) console.log("mobile device detected.")
    }, []);

    const shout = (r) => {
        if (r.payload.event === "signedIn") {
            setShowAuth(false);
            window.location.reload();
        }
    }
    function handleSignOut() {
        signOut().then(() =>
            window.location.reload()
        )
    }
    Hub.listen('auth', shout);
    useEffect(() => {
        if (isSignUp) toSignUp()
        else toSignIn()
    }, [isSignUp])

    // useEffect(() => {
    //     // const data = await getDocs(annoCollection);
    //     // let docs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //     // setAnnoData(docs)
    //     const unsubscribe = onSnapshot(collection(db, "anno"), data => {
    //         data.docs.forEach(doc => {
    //             console.log(doc.type)
    //         })
    //         setAnnoData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //     }, err => {
    //         console.log('Error fetching annotations: ', err);
    //     })
    //     return () => unsubscribe();
    // }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "admin", "anno"), (doc) => {
            console.log(doc.data())
            setAdminProps(doc.data()); // Update state with entire snapshot at once
        }, err => {
            console.log('Error fetching admin props: ', err);
        });
        // Cleanup listener when component unmounts
        return () => unsubscribe();

        // const adminData = getDocs(adminCtrl);
        // let locked = adminData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        // setIsLocked(locked[0].locked)
    }, [])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTimer(prev => prev + 1);
    //     }, 1000);
    //     setFilteredYear(timer % 9 + 1946);
    //     return () => clearInzterval(interval);
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
                      isMobile={isMobile}
        />
        {!isMobile ?
            <Filters data={data}
                     onYearChange={setFilteredYear}
                     onCountryChange={setFilteredCountry}
            /> : null
        }
        <Routes>
          <Route
              path="/"
              element={<><BlurryBackdrop isMobile={isMobile}/>
                  <Intro
                    data={data}
                    user={user}
                    onShowAuth={setShowAuth}
                    onInOrUp={setIsSignUp}
                    isMobile={isMobile}
                  /></>}
          />
          <Route
              path="/map"
              element={<div/>}
          />
          <Route
            path="/images"
            element={<Image data={data} user={user} filteredYear={filteredYear} isLocked={adminProps.locked}
                            // annoData={annoData}
            />}
          />
          {/*<Route*/}
          {/*  path="/p"*/}
          {/*  element={<><BlurryBackdrop bg="red"/><ImagePresentation  data={data} user={user}/></>}*/}
          {/*/>*/}
          <Route
              path="/r/:textId"
              // element={<Text onCenterChange={setCenter}/>}
              element={<Text/>}
          />
        </Routes>
        {
            !isMobile ?
                <Link className='absolute top-1 left-2 text-2xl text-gray-900 cursor-pointer font-sans hover:mix-blend-difference' to={"/"}>
                    about
                </Link>
                : null
        }
        {
            !user ?
            <div className='absolute left-2 bottom-2 text-2xl text-gray-900 cursor-pointer font-sans hover:mix-blend-difference'
                 onClick={() => {
                     setShowAuth(true)
                     setIsSignUp(true)
                 }}
            >
                <p className='w-fit m-auto cursor-pointer'>sign up</p>
            </div> : null
        }
        {
            !isMobile ?
            user ?
                <div className='absolute right-2 bottom-2 text-2xl text-gray-900 cursor-pointer font-sans hover:mix-blend-difference'
                     onClick={handleSignOut}>
                    sign out
                </div> :
                <div className='absolute right-2 bottom-2 text-2xl text-gray-900 cursor-pointer font-sans hover:mix-blend-difference'
                     onClick={() => {
                         setShowAuth(true)
                         setIsSignUp(false)
                     }}>
                    sign in
                </div> : null
        }

        {   showAuth ?
            <div className='auth-container bg-gray-50'>
                <div className='close'
                     onClick={() => setShowAuth(false)}
                >
                    <GrClose size={15}/>
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
