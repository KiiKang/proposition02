import React, {useEffect, useState} from 'react';
import './Intro.css'
import parse from 'html-react-parser';

import axios from "axios";

const TextContainer = (props) => {
    const [textData, setTextData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('text.json');
                setTextData(response.data);
            } catch (err) {
                console.log(err.message);
                // setImageData(null);
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, [])

    return (
        <div className='Intro-textbox fixed min-h-fit max-h-[80%] overflow-y-scroll'>
            {textData ? parse(textData[0].html) : ""}
        </div>
    )
}

export default TextContainer;
