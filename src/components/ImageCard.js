import {useState, useEffect, useRef} from 'react';
import React from 'react';
import './ImageCard.css';
import ContentEditable from "react-contenteditable";
// import {DynamoDB} from 'aws-sdk'
// import { post } from 'aws-amplify/api';
import { db } from "../utils/firebase";
// import {signInAnonymously} from "firebase/auth";
import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";


const ImageCard = (props) => {
    const annoCollection = collection(db, "anno")
    const [annos, setAnnos] = useState([]);
    const [user, setUser] = useState(null);
    const [anno, setAnno] = useState({content: "what do you see?"});
    const [annoFocus, setAnnoFocus] = useState(false);
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState([720, 600])
    const [mouse, setMouse] = useState({x:null, y:null})
    const [showAnnoPreview, setShowAnnoPreview] = useState(false);
    // const annoRefs = useRef([]);

    const [showMenus, setShowMenus] = useState({});
    const [delayHandler, setDelayHandler] = useState(null)

    const getAnnos = async () => {
        const data = await getDocs(annoCollection);
        let docs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setAnnos(docs.filter(d => d.img === props.file_name))
    }

    const deleteAnno = async (id) => {
        const annoDoc = doc(db,"anno", id);
        await deleteDoc(annoDoc);
        setTimeout(getAnnos, 1000);
    }

    useEffect(() => {
        setAnno({content: "what do you see?"})
        getAnnos();
    }, [props.indexNow])

    useEffect(() => {
        let showMenus_ = {};
        for (let i = 1; i <= annos.length; i++) showMenus_[i] = false;
        setShowMenus(showMenus_);
    }, [annos])

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
        setUser(props.user)
    }, [props.user])

    useEffect(() => {
        const getImage = async (file_name) => {
            try {
                let img = new Image();
                img.src = "https://ara-images.s3.amazonaws.com/" + file_name
                img.onload = () => {
                    setImage(img);
                    setImageSize([img.width*0.85, img.height*0.85])
                }
            } catch (err) {
                console.error('Error getting image:', err);
            }
        }
        getImage(props.file_name);
    }, [props.file_name])

    async function postAnno(data) {
        const json_data = JSON.stringify(data)
        await addDoc(annoCollection, JSON.parse(json_data))
        setShowAnnoPreview(true)
        setAnnoFocus(false)
        // try {
        //     const response = await addDoc(annoCollection, JSON.parse(json_data))
        // } catch (error) {
        //   console.error('Error:', error);
        // }
    }

    async function handleBlur(e) {
        setAnnoFocus(false)
        setAnno({...anno, content: e.target.innerText})
        await postAnno({...anno, content: e.target.innerText})
        setAnno({content: "what do you see?"})
        await getAnnos()
        return
        // console.log(e.target, id)
        // let anno_updated = []
        // anno.forEach(a => {
        //     if (a.id === id) a.content = e.target.innerHTML
        //     anno_updated.push(a)
        // })
        // setAnno(anno_updated)
        // console.log(anno)

        // setTimeout(() => {
        //     console.log()
        // }, 500);
        // await sleep(100);
        // await(postAnno(anno[0]))

        // setAnnoFocus(false)
    }

    const addAnno = (e) => {
        // to be unlocked
        if (props.file_name !== "vol-89_no-02_Feb-1946_09.jpg") return
        if (!user) return
        if (annoFocus) return
        if (props.index !== 0) return
        if (!e.target.classList.contains("image-anno")) return
        setShowAnnoPreview(false)
        // if (e.target.className === "image-anno") {
        //     e.preventDefault();

        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;
        setAnno({
            ...anno,
            img: props.file_name,
            id: annos.length + 1,
            x: x,
            y: y,
            user: user,
            timeStamp: e.timeStamp,
        })

        // setAnno(anno.concat(
            //     <ContentEditable className='absolute text-sm image-anno-content border-[0.5px] border-neutral-800 w-fit max-w-full pr-1 pl-1'
            //          ref={r => annoRefs.current.push(r)}
            //          onFocus={() => setAnnoFocus(true)}
            //          onKeyDown={(e) => {
            //              if (e.code === "Enter") e.currentTarget.blur()
            //          }}
            //          onBlur={handleBlur}
            //          style={{left: x + 'px', top: y + 'px'}}
            //          html={"what do you see?"}
            //     />
            // ))
            // navigate(window.location)
        // }
    }

    const formatText = (text) => {
        // if (text[0] === '"') text = text.split('"').slice(1, -1).join("'")
        return text.split("_").map((part, index) => {
            return index % 2 === 1 ? <i key={index}>{part}</i> : part;
        });
    }

    return (
        <div className='image-card p-[20px] border-[1px] border-neutral-700 min-w-[600px]'
             onClick={props.onSwitch}
             style={{
                 // minWidth: image.width,
                 width: imageSize[0] + 40 + 'px',
                 left: 'calc(50% + ' + props.index * window.innerWidth * 0.3 + 'px)',
                 transformOrigin: 'top center',
                 scale: props.index === 0 ? '100%' : '70%',
                 filter: props.index === 0 ? 'blur(0)' : 'blur(6px)',
                 zIndex: 999 - Math.abs(props.index),
                 opacity: 1 - Math.abs(props.index) * 0.2,
                 cursor: props.index === 0 ? 'default' : props.index > 0 ? 'e-resize' : 'w-resize',
             }}>
            {/* <div className='image-card-year'> */}
            {/*<h4>{props.region_local ? props.region_local : null}<br/>{props.region === props.country ? props.country : props.region + ", " + props.country}*/}
            {/*</h4>*/}
            {/* <p>{props.year}</p><br/> */}
            {/*<h2>*/}
            {/*    <i>{props.footnote && props.footnote !== "\r" ? '"' + props.footnote + '"' : null} </i></h2>*/}
            {/* </div> */}
            <div className='image-card-info text-lg font-bold tracking-wide text-neutral-700 mb-2 select-none'>
                {props.country ? props.country.includes('&') ? props.year + ', ' + props.region : props.region === props.country ? props.year + ', ' + props.country : props.year + ', ' + props.region + ', ' + props.country : null}
                {/* {props.region_local ? props.region_local : null} */}
            </div>
            <div className='image-container m-auto relative select-none'
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
                     onMouseEnter={() => setShowAnnoPreview(true)}
                     onMouseLeave={() => setShowAnnoPreview(false)}
                     onClick={addAnno}>
                    {
                        anno.x ?
                            <ContentEditable className='absolute text-[0.75rem] bg-[#e8e4e180] image-anno-content w-fit max-w-full pr-1 pl-1 -translate-x-1/2 whitespace-nowrap'
                                // ref={r => annoRefs.current.push(r)}
                                             onFocus={() => setAnnoFocus(true)}
                                             onKeyDown={(e) => {
                                                 if (e.code === "Enter") e.currentTarget.blur()
                                             }}
                                             style={{
                                                 left: anno.x + 'px',
                                                 top: anno.y + 'px',
                                                 border: 'solid 1px rgb(130 0 0)',
                                                 cursor:'text'
                                             }}
                                             onBlur={handleBlur}
                                             html={anno.content}
                            /> : null
                    }
                    <div className='absolute text-[0.75rem] border-[0.5px] bg-[rgba(232,228,225,0.2)] border-neutral-800 w-fit max-w-full pr-1 pl-1 -translate-x-1/2 whitespace-nowrap pointer-events-none'
                         style={{left: mouse.x + 'px', top: mouse.y + 'px', visibility: showAnnoPreview && !annoFocus ? "visible": "hidden"}}
                    >
                        what do you see?
                    </div>
                    { annos.map((d, id) => (
                        <div key={"anno-container-" + id}>
                            <div className='absolute bg-[#bcb6b280] cursor-pointer font-sans text-[0.6rem] text-stone-600'
                                 onClick={() => {
                                     if (d.user !== user) return
                                     deleteAnno(d.id)
                                 }}
                                 style={{
                                     left: d.x + 'px',
                                     top: d.y + 20 + 'px',
                                     visibility: d.user === user && showMenus[id] ? 'visible':'hidden'
                                 }}
                                 key={"anno-delete-" + id}
                            >
                                delete
                            </div>
                            <ContentEditable className='absolute text-[0.75rem] bg-[#a8a29e80] image-anno-content w-fit max-w-full pr-1 pl-1 -translate-x-1/2 whitespace-nowrap'
                                         // ref={r => annoRefs.current.push(r)}
                                         onFocus={() => setAnnoFocus(true)}
                                         onKeyDown={(e) => {
                                             if (e.code === "Enter") e.currentTarget.blur()
                                         }}
                                         onMouseEnter={() => {
                                             setShowAnnoPreview(false)
                                             setDelayHandler(setTimeout(() => {
                                                 setShowMenus(d => ({
                                                     ...d, [id]: true
                                                 }));
                                             }, 500))
                                             clearTimeout(delayHandler)
                                         }}
                                         onMouseLeave={() => {
                                             setDelayHandler(setTimeout(() => {
                                                 setShowMenus(d => ({
                                                     ...d, [id]: false
                                                 }));
                                                 setShowAnnoPreview(true)
                                             }, 1300))
                                             clearTimeout(delayHandler)
                                         }}
                                         disabled={true}
                                         style={{
                                             left: d.x + 'px',
                                             top: d.y + 'px',
                                             border: d.user === user ? 'solid 0.5px rgb(130 0 0)': 'solid 0.5px rgb(38 38 38)',
                                             cursor: d.user === user ? 'pointer' : 'inherit'
                                         }}
                                         html={d.content}
                                         key={props.file_name + "-" + id}
                        />
                        </div>
                    ))}
                </div>

            </div>
            {
                props.caption !== undefined ?
                    <div className={'image-card-caption tracking-wider text-sm mt-[15px] text-neutral-700 font-bold mt-8 select-none'}>
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
                    <div className={'image-card-caption tracking-wider text-sm mt-1 text-neutral-700 select-none'}>
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
