// https://stackoverflow.com/a/68551326
import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';

import './ImagePreview.css'
import {useNavigate} from "react-router-dom";

const ImagePreview = (props) => {
    const [loading, setLoading] = useState(true);
    const [isShowCard, setIsShowCard] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        const getImage = async () => {
            try {
                await axios.get('./images/gl/' + props.image.file_name);
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

    const showImageCard = () => {
        setIsShowCard(true);
    }

    function removeExtension(filename) {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }

    const goToImageCard = (e) => {
        e.preventDefault();
        navigate("/image/" + removeExtension(props.image.file_name))
    }

    if (!loading) {
        return (
            <div className='image-preview-container'>
                <div className='image-preview' onClick={goToImageCard}
                style={{
                         left: Math.cos(props.index * 2*Math.PI/props.imageCount),
                         top: Math.sin(props.index * 2*Math.PI/props.imageCount)
                }}>
                    {
                        <img src={'./images/' + props.image.file_name }
                             key={props.image.file_name} alt=''/>
                    }
                    {/*<h4>{props.image.year}</h4>*/}
                    {/*<p>{props.image.caption}</p>*/}
                </div>
            </div>
        )
    }
}

export default ImagePreview;
