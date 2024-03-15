import React, {useState} from 'react';
import BlurryBackdrop from "../components/BlurryBackdrop";
import ImageReel from "./ImageReel";
import TextContainer from "../components/TextContainer";

const Text = (props) => {
    return (
        <div>
            <BlurryBackdrop bg={true}/>
            <TextContainer id={props.id}/>
        </div>
    );
}

export default Text;
