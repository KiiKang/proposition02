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
    useEffect(() => {
        ref.current.scroll({
            top: 0
        })
    }, [props.id])

    const bibify = (str) => {
        let str_bibified = str
        textData.bib.forEach(b => {
            let lastName = b.author.substring(b.author.indexOf(" ") + 1)
            str_bibified = str_bibified.replaceAll(lastName, "<span class='hover:underline decoration-red-600 underline-offset-1'>" + lastName + "</span>")
        })
        return str_bibified
    }

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
            {textData ? parse(bibify(textData.content[props.id].html)) : ""}
            <br/>
            <center>
                <Link
                    // onClick={props.onCenterChange([textData[props.id].lat, textData[props.id].lon])}
                    to={parseInt(props.id) + 1 < textData.content.length ? '/r/' + (parseInt(props.id) + 1) : '/map'}>
                    <b>*</b>
                </Link>
            </center>
            <br/>
        </div>
    )
}

export default TextContainer;
