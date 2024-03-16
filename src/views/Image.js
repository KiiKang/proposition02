import React from 'react';
import BlurryBackdrop from "../components/BlurryBackdrop";
import ImageReel from "./ImageReel";

const Image = (props) => {
    return (
        <div>
            <BlurryBackdrop bg={true}/>
            <ImageReel data={props.data}/>
        </div>
    );
}

export default Image;
