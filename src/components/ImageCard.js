import {useState, useEffect, useRef} from 'react';
import React from 'react';
import ContentEditable from "react-contenteditable";
import './ImageCard.css'

const ImageCard = (props) => {
    const [anno, setAnno] = useState([]);
    // const [annoFocus, setAnnoFocus] = useState(true);
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState([800, 600])
    const [mouse, setMouse] = useState({x:null, y:null})
    const [showAnno, setShowAnno] = useState(false);
    useEffect(() => {
        if (props.index === 0) {
            const updateMousePosition = ev => {
                if (ev.target.id === "anno-canvas"){
                    let rect = ev.target.getBoundingClientRect()
                    setMouse({x: ev.clientX - rect.left, y: ev.clientY - rect.top});
                } else {
                    setMouse({x: null, y:null})
                }
            };
            window.addEventListener('mousemove', updateMousePosition);
            return () => {
                window.removeEventListener('mousemove', updateMousePosition);
            };
        }
    }, [props.index]);

    useEffect(() => {
        const getImage = async (file_name) => {
            try {
                let img = new Image();
                img.src = "https://ara-images.s3.amazonaws.com/" + file_name
                img.onload = () => {
                    setImage(img);
                    setImageSize([img.width*0.9, img.height*0.9])
                }
            } catch (err) {
                console.error('Error getting image:', err);
            }
        }
        getImage(props.file_name);
    }, [props.file_name])

    const addAnno = (e) => {
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
        if (text[0] === '"') text = text.split('"').slice(1, -1).join("'")
        return text.split("_").map((part, index) => {
            return index % 2 === 1 ? <i key={index}>{part}</i> : part;
        });
    }

    return (
        <div className='image-card border-[1px] border-neutral-700 min-w-[600px]'
             // ref={imageCardRef}
             onClick={props.onSwitch}
             style={{
                 // minWidth: image.width,
                 width: imageSize[0] + 60 + 'px',
                 left: 'calc(50% + ' + props.index * window.innerWidth * 0.3 + 'px)',
                 transformOrigin: 'top center',
                 scale: props.index === 0 ? '100%' : '70%',
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
            <div className='image-card-info text-xl font-bold tracking-wide text-neutral-700 mb-2'>
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
                <div className='image-anno w-full h-full relative -top-full left-0 bg-[rgba(255,255,255,0)] hover:bg-[rgba(255,255,255,0.2)] transition-colors cursor-crosshair'
                     id='anno-canvas'
                     onMouseEnter={() => setShowAnno(true)}
                     onMouseLeave={() => setShowAnno(false)}
                     onClick={addAnno}>
                    { anno }
                    <div className='relative text-sm image-anno-content border-[0.5px] border-neutral-800 w-fit max-w-full pr-1 pl-1 italic tracking-wide'
                    style={{left: mouse.x + 'px', top: mouse.y + 'px', visibility: showAnno ? "visible": "hidden"}}
                    >
                        what do you see?
                    </div>
                </div>

            </div>
            {
                props.caption !== undefined ?
                    <div className={'image-card-caption tracking-wide text-[1.1rem] mt-[15px] text-neutral-700 font-bold mt-8'}>
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
                    <div className={'image-card-caption tracking-wide text-base mt-1 text-neutral-700'}>
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
