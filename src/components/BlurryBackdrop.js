import { Link } from "react-router-dom";
import React from 'react';

const BlurryBackdrop = (props) => {
    return (
        <Link to='/map'>
            <div className={'w-full h-full top-0 fixed m-0 backdrop-blur-md'}
            style={{background: props.bg ? 'hsla(27,78%,32%,0.4)' : 'none'}}
            />
        </Link>
    )
}

export default BlurryBackdrop
