// https://stackoverflow.com/a/68551326
import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';

import './ImagePreview.css'
import imageCard from "./ImageCard";
import ImageCard from "./ImageCard";

const ImagePreview = (props) => {
    const [loading, setLoading] = useState(true);
    const [isShowCard, setIsShowCard] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getImage = async () => {
            try {
                await axios.get('./images/' + props.image.file_name);
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

    if (!loading) {
        return (
            <div className='image-container'>
                <div className='image-preview' onClick={showImageCard}
                style={{
                         left: props.anchorPt[0]
                             // - (props.zoomParams.x - props.anchorPt[0]) * props.zoomParams.k
                             + 200*props.zoomParams.k * Math.cos(props.index * 2*Math.PI/props.imageCount),
                         top: props.anchorPt[1]
                             // - (props.zoomParams.y - props.anchorPt[1]) * props.zoomParams.k
                             + 200*props.zoomParams.k * Math.sin(props.index * 2*Math.PI/props.imageCount)
                }}>
                    {
                        <img src={'./images/' + props.image.file_name }
                             key={props.image.file_name} alt=''/>
                    }
                    {/*<h4>{props.image.year}</h4>*/}
                    {/*<p>{props.image.caption}</p>*/}
                </div>
                {isShowCard ?
                    <ImageCard data={{
                        "file_name": props.image.file_name,
                        "year": props.image.year,
                        "caption": props.image.caption,
                        "footnote": props.image.footnote,
                    }}
                    /> : null
                }

            </div>
        )
    }
}

export default ImagePreview;
