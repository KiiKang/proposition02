import React from 'react';
import BlurryBackdrop from "../components/BlurryBackdrop";
import TextContainer from "../components/TextContainer";
import {useParams} from "react-router-dom";

const Text = (props) => {
    let {textId} = useParams();
    return (
        <div>
            <BlurryBackdrop bg={true}/>
            <TextContainer id={textId}/>
        </div>
    );
}

export default Text;
