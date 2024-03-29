import React, {startTransition, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import ImageCard from "../components/ImageCard";
// const ImageCard = lazy(() => import("../components/ImageCard"));
const ImageReel = (props) => {
    // const [imageData, setImageData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const filteredYear = useContext(YearContext);
    const [indexNow, setIndexNow] = useState(0);
    // const [filteredCountry, setFilteredCountry] = useState(null);
    // const [filteredRegion, setFilteredRegion] = useState("");
    const [filteredImageData, setFilteredImageData] = useState([]);
    // const [coor, setCoor] = useState(null)
    const ref = useRef(null);
    const { search } = useLocation();
    let navigate = useNavigate();

    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             let response = await axios.get('./images.tsv');
    //             setImageData(tsvToArray(response.data));
    //         } catch (err) {
    //             console.log(err.message);
    //             setImageData(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     startTransition(() => {
    //         getData();
    //     })
    // }, [search])
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
                // if (filteredYear) {
                //     if (filteredYear == d.year) imageData_cleaned.push(d)
                // } else {
                imageData_cleaned.push(d)
                // }
            })
            if (search) {
                let [query, value] = search.split("?")[1].split("=")
                // if (query === 'country') {
                //     setFilteredCountry(value.replace('%20', ' '));
                // } else
                // if (query === 'region') {
                //     setFilteredRegion(value.replace('%20', ' '));
                //     setFilteredImageData(imageData_cleaned.filter(d => d.region_en === filteredRegion))
                // } else {
                //     setFilteredRegion(null)
                // }
                if (query === 'coor') {
                    // let coor = [parseFloat(value.split(",")[0]), parseFloat(value.split(",")[1])]
                    // setCoor(coor)
                    setFilteredImageData(imageData_cleaned.filter(d => coor_to_str(d) === value))
                }
            }
        })
    // }, [props.data, search, filteredRegion, filteredYear])
    }, [props.data, search])

    // useEffect(() => {
    //     if (ref.current !== null) {
    //         ref.current.tabIndex = 0;
    //         ref.current.focus();
    //     }
    // }, [ref])

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

export default ImageReel
