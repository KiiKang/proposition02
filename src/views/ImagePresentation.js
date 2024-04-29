import React, {startTransition, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import ImageCard from "../components/ImageCard";
const ImagePresentation = (props) => {
    const [indexNow, setIndexNow] = useState(0);
    const [filteredImageData, setFilteredImageData] = useState([]);
    const ref = useRef(null);
    const { search } = useLocation();
    let navigate = useNavigate();


    useEffect(() => {
      const interval = setInterval(() => {
        setIndexNow(prevNumber => prevNumber < 50 ? prevNumber + 1 : 0); 
      }, 3000); 
  
      return () => clearInterval(interval); 
    }, []); 
  
    const coor_to_str = c => {
        let str = [parseFloat(c.longitude), parseFloat(c.latitude)]
        if (!isNaN(str[0]) && !isNaN(str[1])) {
            str = JSON.stringify(str)
            return str.substring(1, str.length - 1)
        }
        return null
    }

    useEffect(() => {
        if (props.data.length === 0 ) return
        startTransition(() => {
            let imageData_cleaned = []
            props.data.forEach(d => {
                if (!d.region_en) d['region_en'] = d.country_db
                if (d.country) imageData_cleaned.push(d)
            })
            setFilteredImageData(imageData_cleaned.slice(0,50))
        })
    }, [props.data, search])

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            if (indexNow > 0) setIndexNow(indexNow - 1)
        } else if (e.key === 'ArrowRight') {
            if (indexNow < filteredImageData.length - 1 ) setIndexNow(indexNow + 1)
        } else if (e.key === 'Escape') {
            navigate('/map')
        }
    }

    return (
        <div className='image-reel'
             tabIndex={0} ref={ref}
             onKeyDown={handleKeyDown}
        >
            {
                filteredImageData.map((d, i)=> (
                    <ImageCard
                        key={'image-card-' + d.file_name}
                        file_name={d.file_name}
                        caption={d.caption_title}
                        footnote={d.caption}
                        country={d.country}
                        coor={d.coor}
                        region={d.region ? d.region : d.region_en}
                        user={props.user}
                        // region_local={d.region_local}
                        year={d.year}
                        index={i - indexNow}
                        onSwitch={() => setIndexNow(i)}
                    />
                ))
            }
        </div>
    )
}

export default ImagePresentation
