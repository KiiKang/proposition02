import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';
import ContentEditable from "react-contenteditable";
import './ImageCard.css'
import {useParams} from "react-router-dom";

const ImageCard = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anno, setAnno] = useState([]);
    const [annoFocus, setAnnoFocus] = useState(false);

    // let { img } = useParams()

    useEffect(() => {
        const getImage = async () => {
            try {
                await axios.get('/images/gl/' + props.file_name );
                setError(null);
                setTimeout(200);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                console.log(props.file_name + 'loaded!')
            }
        };
        getImage();
    }, [])

    const addAnno = (e) => {
        console.log(e);
        if (e.target.className === "image-anno") {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            setAnno(anno.concat(
                <ContentEditable className='image-anno-content'
                                 style={{left: x + 'px', top: y + 'px'}}
                />
            ))
        }
    }

    if (!loading) {
        return (
            <div className='image-card'
                 style={{
                     pointerEvents: annoFocus? 'none':'auto',
                     left: 'calc(50% + ' + props.index * 300 + 'px)',
                     scale: props.index===0 ? '100%': '80%',
                     minWidth: '600px',
                     transformOrigin: 'top left',
                     height: 'auto',
                     filter: 'blur(' + Math.abs(props.index)*5 + 'px)',
                     zIndex: 999 - Math.abs(props.index),
                     opacity: 1 - Math.abs(props.index)*0.1,
                     cursor: props.index === 0 ? 'default' : props.index>0 ? 'e-resize' : 'w-resize'
                 }}>
                <div className='image-container' onClick={props.onSwitch}>
                    {
                        <img src={'/images/gl/' + props.file_name }
                             key={ props.file_name } alt='' />
                    }
                </div>
                {/*<div className='image-anno' onClick={addAnno}>*/}
                {/*    { anno }*/}
                {/*</div>*/}
                {/*{ props.index === 0 ? (*/}
                <div className='image-card-description'>
                    {/*<h4>year: {props.year}</h4>*/}
                    <p className='subtitle'>"{props.caption}</p>
                    {/*<p className='subtitle'>{props.footnote}"</p>*/}
                </div>
                {/*) : null*/}
                {/*}*/}
            </div>
        )
    }
}

export default ImageCard
