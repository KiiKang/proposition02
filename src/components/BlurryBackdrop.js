import { Link } from "react-router-dom";
import React from 'react';

const BlurryBackdrop = () => {
    return (
        <Link to='/map'>
            <div className='full-backdrop-overlay'/>
        </Link>
    )
}

export default BlurryBackdrop