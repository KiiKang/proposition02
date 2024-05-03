import React from 'react';
import BlurryBackdrop from "../components/BlurryBackdrop";
import ImageReel from "./ImageReel";

const Image = (props) => {
    return (
        <div>
            <BlurryBackdrop bg={true}/>
            <ImageReel data={props.data} user={props.user} filteredYear={props.filteredYear}/>
        </div>
    );
}

export default Image;
