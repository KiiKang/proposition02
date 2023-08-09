import {useState, useEffect, useRef} from 'react';
import axios from "axios";
import React from 'react';
import ImageCard from "../components/ImageCard";
import {useLocation, useNavigate} from "react-router-dom";

const ImageReel = () => {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [indexNow, setIndexNow] = useState(0);
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [filteredRegion, setFilteredRegion] = useState(null);
    const ref = useRef(null);
    const { search } = useLocation();
    let navigate = useNavigate();

    const tsvToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split("\t");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

        const array = csvRows.map(i => {
            const values = i.split("\t");
            return csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
        });
        return array;
    };

    const handleClick = (i) => {
        setIndexNow(i)
    }

    useEffect(() => {
        const getData = async () => {
            try {
                let response
                response = await axios.get('./images.tsv');
                setImageData(tsvToArray(response.data));
                setError(null);
            } catch (err) {
                setError(err.message);
                setImageData(null);
            } finally {
                let imageData_cleaned = []
                imageData.forEach(d => {
                    if (!d.region) d['region'] = d.country_db
                    imageData_cleaned.push(d)
                })
                setImageData(imageData_cleaned)
                setLoading(false);
                if (search) {
                    let [query, value] = search.split("?")[1].split("=")
                    // if (query === 'year') setFilteredYear(value)
                    if (query === 'country') {
                        setFilteredCountry(value.replace('%20', ' '));
                    } else if (query === 'region') {
                        setFilteredRegion(value.replace('%20', ' '));
                    }
                }


            }
        }
        getData()
        ref.current.focus();
    }, [search, imageData])
    let filteredImageData = [];

    if (!loading) {
        if (filteredCountry) {
            filteredImageData = imageData.filter(d => d.country_db === filteredCountry)
        } else if (filteredRegion) {
            filteredImageData = imageData.filter(d => d.region === filteredRegion)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            if (indexNow > 0) setIndexNow(indexNow - 1)
        } else if (e.key === 'ArrowRight') {
            if (indexNow < filteredImageData.length - 1 ) setIndexNow(indexNow + 1)
        } else if (e.key === 'Escape') {
            navigate('/map')
        }
    }

    {
        return (
            <div className='image-reel'
                 tabIndex={-1} ref={ref}
                 onKeyDown={handleKeyDown}
            >
                {
                    filteredImageData.map((d, i)=> (
                        <ImageCard
                            key={'image-card-' + d.file_name}
                            file_name={d.file_name.trim().split('.')[0] + '-gl.jpg'}
                            caption={d.caption_title}
                            // footnote={d.caption_title} TODO: caption field converting as string? e.g. "caption "
                            year={d.year}
                            index={i - indexNow}
                            onSwitch={() => setIndexNow(i)}
                        />
                    ))
                }
            </div>
        )
    }
}

export default ImageReel
