import React, {useEffect, useRef} from 'react';
import './Intro.css'
import parse from 'html-react-parser';

// import axios from "axios";
import {Link} from "react-router-dom";
import textData from "../text.json";
const TextContainer = (props) => {
    // const [textData, setTextData] = useState(null);
    // const [content, setContent] = useState(null);
    // const [loading, setLoading] = useState(true);
    const ref = useRef();
    const bibRef = useRef();

    useEffect(() => {
        bibRef.current.style.visibility = "hidden"
        ref.current.scroll({
            top: 0
        })
        const spans = ref.current.querySelectorAll('span');
        spans.forEach(span => {
            span.addEventListener('mouseenter', (e) => {
                handleBib(e);
            });
            span.addEventListener('mouseout', () => {
                hideBib();
            });
        });
        // let ps = Array.prototype.slice.call(ref.current.children).filter(d => d.localName === "p")
        // ps.forEach(p => {
        //     let spans = Array.prototype.slice.call(p.children).filter(d => d.localName === "span")
        //     console.log(spans);
        // })
    }, [props.id])

    const handleBib = (e) => {
        let bib = textData.bib.filter(d => d.match === e.target.innerText)[0]
        bibRef.current.innerHTML = ""
        if (bib.author) bibRef.current.innerHTML += bib.author + ". "
        bibRef.current.innerHTML += "<i>" + bib.title + "</i>. "
        if (bib.publisher) bibRef.current.innerHTML += bib.publisher + ", "
        bibRef.current.innerHTML += bib.year + "."
        if (bib.page) bibRef.current.innerHTML += " p." + bib.page
        // bibRef.current.style.width = "fit-content"
        bibRef.current.style.visibility = "visible"
        if (e.target.offsetLeft < 250) bibRef.current.style.left = e.target.offsetLeft + 'px'
        else bibRef.current.style.right = 520 - e.target.offsetLeft - e.target.offsetWidth + 'px'
        bibRef.current.style.top = e.target.offsetTop + 25 + 'px'
    }
    const hideBib = () => {
        bibRef.current.style.visibility = "hidden"
    }
    const bibify = (str) => {
        let str_bibified = str
        textData.bib.forEach(b => {
            str_bibified = str_bibified.replaceAll(b.match,
                "<span key={lastName} className='hover:underline decoration-red-600 underline-offset-1'>" + b.match + "</span>")
        })
        return str_bibified
    }

    return (
        <div className='Intro-textbox overflow-x-clip w-[480px] p-7 text-base fixed hyphens-auto min-h-fit max-h-[80%] overflow-y-scroll'
        ref={ref}>
            <br/>
            <center>
                <Link to={parseInt(props.id) > 0 ? '/r/' + (parseInt(props.id) - 1) : '/map'}>
                    <b>*</b>
                </Link>
            </center>
            <br/>
            {textData ? parse(bibify(textData.content[props.id].html)) : ""}
            <br/>
            <center>
                <Link
                    // onClick={props.onCenterChange([textData[props.id].lat, textData[props.id].lon])}
                    to={parseInt(props.id) + 1 < textData.content.length ? '/r/' + (parseInt(props.id) + 1) : '/map'}>
                    <b>*</b>
                </Link>
            </center>
            <br/>
            <div ref={bibRef}
                 className='fixed leading-tight pointer-events-none max-w-[80%] min-w-[200px] w-fit left-0 top-0 bg-white border-2 border-gray-700 p-1 font-sans text-xs'
            />
        </div>
    )
}

export default TextContainer;
