import {Link, useNavigate} from "react-router-dom";
import React from 'react'
import './MenuBar.css'
import Cookies from 'js-cookie';

const MenuBar = () => {
    let navigate = useNavigate();
    function signOut() {
        Cookies.remove("user");
        window.location.reload();
    }
    return (
        <div className='absolute bottom-0 w-full flex justify-between'>
                    <Link to='/' className='text-3xl ml-3 mb-3 cursor-pointer font-sans'>
                        about
                    </Link>
                    {
                        Cookies.get("user") ?
                            <div className='text-3xl mr-3 mb-3 cursor-pointer font-sans'
                                 onClick={signOut}>
                                sign out
                            </div> :
                            <div className='text-3xl mr-3 mb-3 cursor-pointer font-sans'
                                 onClick={() => navigate("/login")}>
                                sign in
                            </div>
                    }
        </div>
    )
}

export default MenuBar
