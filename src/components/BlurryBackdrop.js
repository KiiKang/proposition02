import { Link } from "react-router-dom";
import React from 'react';

const BlurryBackdrop = () => {
    return (
        <Link to='/map'>
            <div className='w-full h-full top-0 fixed m-0 backdrop-blur-sm'/>
        </Link>
    )
}

export default BlurryBackdrop
