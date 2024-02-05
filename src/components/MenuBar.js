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
        <div className='absolute bottom-0 w-full flex justify-between'>
                    <div className='text-4xl ml-3 mb-3 cursor-pointer font-sans' onClick={goHome}>
                        about
                    </div>
                    {
                        Cookies.get("user") ?
                            <div className='text-4xl mr-3 mb-3 cursor-pointer font-sans'
                                 onClick={signOut}>
                                sign out
                            </div> :
                            <div className='text-4xl mr-3 mb-3 cursor-pointer font-sans'
                                 onClick={() => navigate("/login")}>
                                sign in
                            </div>
                    }
                    {/*<div className='button-round-L' onClick={() => navigate("/login")}>*/}
                    {/*    {Cookies.get("user") ? "sign out" : "sign in"}*/}
                    {/*</div>*/}
        </div>
    )
}

export default MenuBar
