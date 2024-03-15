import React, {useEffect, useRef} from 'react';
import './Intro.css'
import parse from 'html-react-parser';

// import axios from "axios";
import {Link} from "react-router-dom";
import textData from "../text.json";
const TextContainer = (props) => {
    // const [textData, setTextData] = useState(null);
    // const [content, setContent] = useState(null);
    // const [loading, setLoading] = useState(true);
    const ref = useRef();
    console.log(textData)
    useEffect(() => {
        ref.current.scroll({
            top: 0
        })
    }, [props.id])

    return (
        <div className='Intro-textbox w-[520px] p-7 text-lg fixed hyphens-auto min-h-fit max-h-[80%] overflow-y-scroll'
        ref={ref}>
            <br/>
            <center>
                <Link to={parseInt(props.id) > 0 ? '/r/' + (parseInt(props.id) - 1) : '/map'}>
                    <b>*</b>
                </Link>
            </center>
            <br/>
            {textData ? parse(textData[props.id].html) : ""}
            <br/>
            <center>
                <Link
                    // onClick={props.onCenterChange([textData[props.id].lat, textData[props.id].lon])}
                    to={parseInt(props.id) + 1 < textData.length ? '/r/' + (parseInt(props.id) + 1) : '/map'}>
                    <b>*</b>
                </Link>
            </center>
            <br/>
        </div>
    )
}

export default TextContainer;
