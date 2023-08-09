import {NavLink, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react'
import './MenuBar.css'
import axios from "axios";

const MenuBar = () => {
    let navigate = useNavigate();
    function goHome(e) {
        e.preventDefault();
        navigate("/");
    }
    return (
        <div className='MenuBar'>
            <div className='MenuBar-Bottom'>
                <div className='MenuBar-Nav'>
                    <div className='button-round-L' onClick={goHome}>about</div>
                    <div className='button-round-L' onClick={() => navigate("/login")}>sign in</div>
                </div>
            </div>
        </div>
    )
}

export default MenuBar
