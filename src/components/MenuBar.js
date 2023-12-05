import {useNavigate} from "react-router-dom";
import React from 'react'
import './MenuBar.css'
import Cookies from 'js-cookie';

const MenuBar = () => {
    let navigate = useNavigate();
    function goHome(e) {
        e.preventDefault();
        navigate("/");
    }
    function signOut() {
        Cookies.remove("user");
        window.location.reload();
    }
    return (
        <div className='MenuBar'>
            <div className='MenuBar-Bottom'>
                <div className='MenuBar-Nav'>
                    <div className='button-round-L' onClick={goHome}>about</div>
                    {
                        Cookies.get("user") ?
                            <div className='button-round-L' onClick={signOut}>sign out</div> :
                            // <div className='button-round-L' onClick={() => navigate("/login")}>sign in</div>
                            <div className='button-round-L'>sign in</div>

                    }
                    {/*<div className='button-round-L' onClick={() => navigate("/login")}>*/}
                    {/*    {Cookies.get("user") ? "sign out" : "sign in"}*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default MenuBar
