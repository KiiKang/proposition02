import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';
import ContentEditable from "react-contenteditable";
import './ImageCard.css'
import {useNavigate, useParams} from "react-router-dom";

const ImageCard = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anno, setAnno] = useState([]);
    const [annoFocus, setAnnoFocus] = useState(false);
    const [image, setImage] = useState(null);
    const imgRef = React.createRef();

    const navigate = useNavigate()
    // let { img } = useParams()
    const getImage = async () => {
        try {
            await axios.get('/images/gl/' + props.file_name );
            let img = new Image();
            img.src = '/images/gl/' + props.file_name
            setError(null);
            img.onload = () => setImage(img);
            setTimeout(200);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            console.log(props.file_name + ' loaded!')
        }
    };

    useEffect(() => {
        getImage();
    }, [loading])

    // const addAnno = (e) => {
    //     return
    //     console.log(e);
    //     if (e.target.className === "image-anno") {
    //         let x = e.clientX - e.target.getBoundingClientRect().left;
    //         let y = e.clientY - e.target.getBoundingClientRect().top;
    //         setAnno(anno.concat(
    //             <ContentEditable className='image-anno-content'
    //                              style={{left: x + 'px', top: y + 'px'}}
    //             />
    //         ))
    //         // navigate(window.location)
    //     }
    // }
        return (
            <div className='image-card'
                 style={{
                     width: image ? image.width : '200px',
                     pointerEvents: annoFocus ? 'none' : 'auto',
                     left: 'calc(50% + ' + props.index * window.innerWidth * 0.3 + 'px)',
                     transformOrigin: 'top center',
                     scale: props.index === 0 ? '100%' : '75%',
                     filter: props.index === 0 ? 'blur(0)' : 'blur(5px)',
                     zIndex: 999 - Math.abs(props.index),
                     opacity: 1 - Math.abs(props.index) * 0.1,
                     cursor: props.index === 0 ? 'default' : props.index > 0 ? 'e-resize' : 'w-resize'
                 }}>
                {/* <div className='image-card-year'> */}
                    {/*<h4>{props.region_local ? props.region_local : null}<br/>{props.region === props.country ? props.country : props.region + ", " + props.country}*/}
                    {/*</h4>*/}
                    {/* <p>{props.year}</p><br/> */}
                    {/*<h2>*/}
                    {/*    <i>{props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null} </i></h2>*/}
                {/* </div> */}
                <div className='image-card-caption'>
                    {/*<h4>{props.region_local ? props.region_local : null}<br/>{props.region === props.country ? props.country : props.region + ", " + props.country}*/}
                    {/*</h4>*/}
                    <div>{props.caption}</div>
                    {/* <div>{this.imgeRef.current}</div> */}
                </div>

                <div className='image-container' onClick={props.onSwitch}>
                    { !loading?
                        <img 
                        // ref={this.imgRef}
                         src={'/images/gl/' + props.file_name}
                             key={props.file_name} alt='' loading='lazy'></img>:null
                    }
                </div>
                {/*<div className='image-anno' onClick={addAnno} style={{visibility: props.index === 0 ? "visible":"hidden"}}>*/}
                {/*    { anno }*/}
                {/*</div>*/}
                <div className='image-card-description'>
                    {/*<h4>{props.region_local ? props.region_local : null}<br/>{props.region === props.country ? props.country : props.region + ", " + props.country}*/}
                    {/*</h4>*/}
                    <div>
                        {props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null}</div>
                </div>

            </div>
        )

}

export default ImageCard
