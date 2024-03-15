import React from 'react';
import Intro from "../components/Intro";
import BlurryBackdrop from "../components/BlurryBackdrop";

const Home = (props) => {
    return (
        <div>
            <BlurryBackdrop/>
            <Intro data={props.data}/>
        </div>
    );
}

export default Home;
