import React from 'react';

// const MenuBar = () => import('../components/MenuBar');
// const WorldMap = () => import('../components/WorldMap');
import MenuBar from "../components/MenuBar";
import WorldMap from "../components/WorldMap";

const HomePage = () => {
    return (
        <div className='Home'>
            <WorldMap/>
            <MenuBar/>
        </div>
    )
}

export default HomePage
