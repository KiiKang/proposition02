import React from 'react';

// const BlurryBackdrop = React.lazy(() => import('../components/BlurryBackdrop'));
// const Intro = React.lazy(() => import('../components/Intro'));
// const MenuBar = React.lazy(() => import('../components/MenuBar'))
// const WorldMap = React.lazy(() => import('../components/WorldMap'));
import BlurryBackdrop from "../components/BlurryBackdrop";
import Intro from "../components/Intro";
import MenuBar from "../components/MenuBar";
import WorldMap from "../components/WorldMap";

const EnterPage = () => {
    return (
        <div className='EnterPage'>
            <BlurryBackdrop/>
            <Intro/>
            <WorldMap/>
            <MenuBar/>
        </div>
    )
}

export default EnterPage
