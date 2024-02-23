import {useState} from 'react';
import React from 'react';
// import ContentEditable from "react-contenteditable";
import './ImageCard.css'
// import {useNavigate} from "react-router-dom";

const ImageCard = (props) => {
    // const [imgLoading, setImgLoading] = useState(true);
    // const [imageUrl, setImageUrl] = useState('');
    // const [anno, setAnno] = useState([]);
    const [annoFocus, setAnnoFocus] = useState(true);
    // const [image, setImage] = useState(null);
    // const imageCardRef = useRef(null);
    // const imageContainerRef = useRef(null);
    // useEffect(() => {
    //     const getImage = async (file_name) => {
    //         try {
    //             let img = new Image();
    //             img.src = "https://ara-images.s3.amazonaws.com/" + file_name
    //             img.onload = () => {
    //                 setImage(img);
    //                 imageCardRef.current.style.minWidth = img.width;
    //                 imageContainerRef.current.style.minWidth = img.width;
    //                 imageContainerRef.current.style.minHeight = img.height;
    //             }
    //             // setImageUrl("https://ara-images.s3.amazonaws.com/" + file_name);
    //         } catch (err) {
    //             console.error('Error getting image:', err);
    //         } finally {
    //             setImgLoading(false);
    //         }
    //         // AWS.config.update({
    //         //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    //         //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    //         //     region: 'us-east-1',
    //         // });
    //         // const s3 = new AWS.S3();
    //         // try {
    //         //     console.log("image selected: ", file_name)
    //         //     const signedUrl = await s3.getSignedUrlPromise('getObject', {
    //         //         Bucket: 'ara-images',
    //         //         Key: file_name,
    //         //         Expires: 60,
    //         //     });
    //         //     let img = new Image();
    //         //     img.src = signedUrl
    //         //     img.onload = () => setImage(img);
    //         //     setImageUrl(signedUrl);
    //         // } catch (err) {
    //         //     console.error('Error getting image:', err);
    //         // } finally {
    //         //     setImgLoading(false);
    //         // }
    //     }
    //     getImage(props.file_name);
    // }, [])

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
    // if (imgLoading) return
    return (
        <div className='image-card'
             // ref={imageCardRef}
             style={{
                 // minWidth: image.width,
                 pointerEvents: annoFocus ? 'none' : 'auto',
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
            <div className='image-card-info text-5xl'>
                {props.country.includes('&') ? props.year + ', ' + props.region : props.region === props.country ? props.year + ', ' + props.country : props.year + ', ' + props.region + ', ' + props.country}
                {/* {props.region_local ? props.region_local : null} */}
            </div>
            {
                props.caption !== undefined ?
                    <div className={'image-card-caption tracking-tight ' + (props.caption ? 'text-5xl' : 'text-4xl')}>
                        {props.caption ? formatText(props.caption) : props.footnote ? formatText(props.footnote) : <br/>}
                        {/*{props.caption.split(" ").slice(0, -2).map(s => {*/}
                        {/*    return s + " "*/}
                        {/*})}*/}
                        {/*{props.caption.split(" ").slice(-2).map(s => {*/}
                        {/*    return <span style={{whiteSpace: "nowrap"}}> {s + " "} </span>*/}
                        {/*})}*/}
                    </div> : null
            }
            <div className='image-container'
                 // ref={imageContainerRef}
                 onClick={props.onSwitch}>
                <img
                    src={"https://ara-images.s3.amazonaws.com/" + props.file_name}
                    key={props.file_name} alt=''
                    loading='lazy'/>
            </div>
            {/*<div className='image-anno' onClick={addAnno} style={{visibility: props.index === 0 ? "visible":"hidden"}}>*/}
            {/*    { anno }*/}
            {/*</div>*/}
            {/*<div className='image-card-description'>*/}
            {/*    <div>*/}
            {/*        {props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null}</div>*/}
            {/*</div>*/}

        </div>
    )

}

export default ImageCard
