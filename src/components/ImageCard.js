import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';

import './ImageCard.css'

const ImageCard = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getImage = async () => {
            try {
                await axios.get('./images/' + props.data.file_name);
                setError(null);
                setTimeout(200);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getImage();

    }, [props])

    console.log(props.data.footnote)
    if (!loading) {
        return (
            <div className='image-card-container'>
                <div className='overlay'>
                <div className='image-card'>
                    <div className='image-container'>
                        {
                        <img src={'./images/' + props.data.file_name }
                             key={props.data.file_name} alt=''/>
                        }
                    </div>
                    <div className='image-description'>
                        {/*<h4>Year: {props.data.year}</h4>*/}
                        <p className='subtitle'>{props.data.caption}</p>
                        <p className='subtitle'>{props.data.footnote}</p>
                    </div>

                </div>
                </div>
            </div>
        )
    }
}

export default ImageCard
