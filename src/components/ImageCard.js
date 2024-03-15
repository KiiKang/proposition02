import {useState, useEffect, useRef} from 'react';
import React from 'react';
import ContentEditable from "react-contenteditable";
import './ImageCard.css'
// import {useNavigate} from "react-router-dom";

const ImageCard = (props) => {
    const [imgLoading, setImgLoading] = useState(true);
    // const [imageUrl, setImageUrl] = useState('');
    const [anno, setAnno] = useState([]);
    // const [annoFocus, setAnnoFocus] = useState(true);
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState([600, 600])
    // const imageCardRef = useRef(null);
    const imageContainerRef = useRef(null);
    useEffect(() => {
        const getImage = async (file_name) => {
            try {
                let img = new Image();
                img.src = "https://ara-images.s3.amazonaws.com/" + file_name
                img.onload = () => {
                    setImage(img);
                    // imageCardRef.current.style.minWidth = img.width;
                    setImageSize([img.width, img.height])
                    // imageContainerRef.current.style.width = img.width;
                    // imageContainerRef.current.style.height = img.height;
                }
                // setImageUrl("https://ara-images.s3.amazonaws.com/" + file_name);
            } catch (err) {
                console.error('Error getting image:', err);
            } finally {
                setImgLoading(false);
            }
        }
        getImage(props.file_name);
    }, [])

    const addAnno = (e) => {
        console.log(e);
        if (e.target.className === "image-anno") {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            setAnno(anno.concat(
                <ContentEditable className='image-anno-content'
                                 style={{left: x + 'px', top: y + 'px'}}
                 html={<div></div>}/>
            ))
            // navigate(window.location)
        }
    }

    const formatText = (text) => {
        // const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/uig;
        // let resultString = text;
        // let match = ifcUnicodeRegEx.exec (text);
        // while (match) {
        //     const unicodeChar = String.fromCharCode (parseInt (match[1], 16));
        //     resultString = resultString.replace (match[0], unicodeChar);
        //     match = ifcUnicodeRegEx.exec (text);
        // }
        if (text[0] === '"') text = text.split('"').slice(1, -1).join("'")
        return text.split("_").map((part, index) => {
            return index % 2 === 1 ? <i key={index}>{part}</i> : part;
        });
    }

    // if (imgLoading || !image) {
    //     return (
    //         <div className='image-card'
    //              style={{
    //                  width: "600px",
    //                  height: "600px",
    //                  background: "black",
    //                  left: 'calc(50% + ' + props.index * window.innerWidth * 0.3 + 'px)',
    //                  transformOrigin: 'top center',
    //              }}/>
    //     )
    // }
    return (
        <div className='image-card'
             // ref={imageCardRef}
             onClick={props.onSwitch}
             style={{
                 // minWidth: image.width,
                 left: 'calc(50% + ' + props.index * window.innerWidth * 0.3 + 'px)',
                 transformOrigin: 'top center',
                 scale: props.index === 0 ? '90%' : '70%',
                 filter: props.index === 0 ? 'blur(0)' : 'blur(6px)',
                 zIndex: 999 - Math.abs(props.index),
                 opacity: 1 - Math.abs(props.index) * 0.2,
                 cursor: props.index === 0 ? 'default' : props.index > 0 ? 'e-resize' : 'w-resize'
             }}>
            {/* <div className='image-card-year'> */}
            {/*<h4>{props.region_local ? props.region_local : null}<br/>{props.region === props.country ? props.country : props.region + ", " + props.country}*/}
            {/*</h4>*/}
            {/* <p>{props.year}</p><br/> */}
            {/*<h2>*/}
            {/*    <i>{props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null} </i></h2>*/}
            {/* </div> */}
            <div className='image-card-info text-2xl font-bold tracking-wide text-neutral-700 mb-5'>
                {props.country.includes('&') ? props.year + ', ' + props.region : props.region === props.country ? props.year + ', ' + props.country : props.year + ', ' + props.region + ', ' + props.country}
                {/* {props.region_local ? props.region_local : null} */}
            </div>
            <div className='image-container m-auto relative'
                 style = {{width: imageSize[0] + 'px', height: imageSize[1] + 'px',
            background: !image ? 'black': 'none', borderRadius: !image ? '50%': '5px', filter: !image ? 'blur(50px)' : 'none'}}
                 >
                <img
                    // title={props.footnote}
                    loading={"lazy"}
                    className='w-full h-full m-0'
                    src={"https://ara-images.s3.amazonaws.com/" + props.file_name}
                    key={props.file_name} alt=''
                    />
                <div className='image-anno w-full h-full relative top-0 left-0'
                     onClick={addAnno}
                     style={{ visibility: props.index === 0 ? "visible":"hidden" }}>
                    { anno }
                </div>

            </div>
            {
                props.caption !== undefined ?
                    <div className={'image-card-caption tracking-wide text-xl mt-2 text-neutral-700 font-bold mt-8'}>
                        {formatText(props.caption)}
                        {/*{props.caption ? formatText(props.caption) : props.footnote ? formatText(props.footnote) : <br/>}*/}
                        {/*{props.caption.split(" ").slice(0, -2).map(s => {*/}
                        {/*    return s + " "*/}
                        {/*})}*/}
                        {/*{props.caption.split(" ").slice(-2).map(s => {*/}
                        {/*    return <span style={{whiteSpace: "nowrap"}}> {s + " "} </span>*/}
                        {/*})}*/}
                    </div> : null
            }
            {
                props.footnote !== undefined ?
                    <div className={'image-card-caption tracking-wide text-xl mt-2 text-neutral-700'}>
                        {formatText(props.footnote)}
                    </div> : null
            }

            {/*<div className='image-card-description'>*/}
            {/*    <div>*/}
            {/*        {props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null}</div>*/}
            {/*</div>*/}

        </div>
    )

}

export default ImageCard
