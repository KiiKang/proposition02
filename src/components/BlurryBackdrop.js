import { Link } from "react-router-dom";
import React from 'react';
import "../App.css"
const BlurryBackdrop = (props) => {
    return (
        <Link to='/map' className={'w-full h-full top-0 fixed m-0 backdrop-blur-md backdrop-close'}
        style={{
            background: props.bg === "red" ? 'hsla(27,78%,32%,0.4)' : props.bg? 'hsla(27,78%,32%,0.4)' : 'none',
            pointerEvents: props.isMobile ? "none" : "default"
            // cursor: `url("${X}") 12 12, default`
        }}
        />
    )
}

export default BlurryBackdrop
