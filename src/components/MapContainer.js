import mapboxgl from 'mapbox-gl';
import {Link} from 'react-router-dom';
import ReactMapGL from "react-map-gl";
import React, {useEffect, useRef, useState} from "react";
import parse from 'html-react-parser';
import {useNavigate} from "react-router-dom";
import {Marker} from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapContainer.css'
import axios from "axios";
import Cookies from "js-cookie";
import textData from "../text.json";

// import BlurryBackdrop from "./BlurryBackdrop";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const MapContainer = (props) => {

    /** refs **/
    const mapContainer = useRef()
    const mapRef = useRef(null);
    // const labelsRef = useRef([]);
    const imagesRef = useRef([]);
    /** states-map **/
    let viewport_init = {
        width: "100vw",
        height: "100vh",
        longitude: Math.floor(Math.random() * 360),
        latitude: 20,
        zoom: 2.5,
        minZoom: 2,
        maxZoom: 9.5
    }
    const [viewport, setViewport] = useState(viewport_init);
    // const [filteredCountry, setFilteredCountry] = useState(null);
    // const [filteredRegion, setFilteredRegion] = useState(null);
    /** states-data **/
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [imagePoints, setImagePoints] = useState([]);
    // const [countryData, setCountryData] = useState(null);
    const [countryBounds, setCountryBounds] = useState(null);
    // const { search } = useLocation();
    let navigate = useNavigate();

    function signOut() {
        Cookies.remove("user");
        window.location.reload();
    }

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('./country-bounding-box.json');
                setCountryBounds(response.data);
            } catch (err) {
                console.log(err.message);
                // setImageData(null);
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, [])

    useEffect(() => {
        if (props.country && !loading) {
            let bounds = Object.values(countryBounds).filter(d => d[0] === props.country)
            // TODO: make exceptions for when the country not in the db is selected
            if (bounds.length !== 0) {
                bounds = bounds[0][1];
                mapRef.current.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {
                    duration: 10000
                })
            }
        }
    }, [props.country])
    // useEffect(() => {
    //     if (search) {
    //         let [query, value] = search.split("?")[1].split("=")
    //         // if (query === 'region') {
    //         //     setFilteredRegion(value.replace('%20', ' '));
    //         // }
    //         if (query === 'country') {
    //             let bounds = Object.values(countryBounds).filter(d => d[0] === value.replace('%20', ' '))
    //             // TODO: make exceptions for when the country not in the db is selected
    //             if (bounds.length !== 0) {
    //                 bounds = bounds[0][1];
    //                 mapRef.current.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {
    //                     duration: 10000
    //                 })
    //             }
    //         }
    //     }
    // }, [countryBounds, search]);

    useEffect(() => {
        // console.log("filtered year: ", props.year)
        // let regions = []
        let coors = []
        let imagePoints_ = []
        props.data.forEach(d => {
            // let region = d.region ? d.region : d.country_db
            // regions.push(region)
            let coor = [parseFloat(d.longitude), parseFloat(d.latitude)]
            if (!isNaN(coor[0]) && !isNaN(coor[1])) {
                coor = JSON.stringify(coor)
                coor = coor.substring(1, coor.length-1)
                coors.push(coor)
            }
        })
        // regions = [...new Set(regions)]
        coors = [...new Set(coors)]
        coors.sort()
        // console.log(coors)
        coors.forEach((c) => {
            // let imageDatum = []
            let images = []
            let years = []
            props.data.forEach(d => {
                let coor = [parseFloat(d.longitude), parseFloat(d.latitude)]
                if (!isNaN(coor[0]) && !isNaN(coor[1])) {
                    let coor_str = JSON.stringify(coor)
                    coor_str = coor_str.substring(1, coor_str.length-1)

                    if (c === coor_str) {
                        images.push({
                            file_name: d.file_name,
                            year: d.year,
                            caption: d.caption_title,
                            region: d.region ? d.region + ', ' + d.country_db : d.country_db,
                            country: d.country_db
                        })
                        years.push(parseInt(d.year))
                    }
                }
                // if (region === r) imageDatum.push(i)
            })
            imagePoints_.push({
                // "country_custom": d.country,
                // "country": d.country_db,
                "region": images[0].region,
                "years": [...new Set(years)],
                "coor_str": c,
                "coor": [parseFloat(c.split(",")[0]), parseFloat(c.split(",")[1])],
                "images": images
            })
        })
            // let years = []
            // imageDatum.forEach(i => {
            //     // if (!props.year || props.year == i.year) {
            //     images.push({
            //         "file_name": i.file_name,
            //         "year": i.year,
            //         "caption": i.caption_title,
            //         "region": i.region ? i.region + ', ' + i.country_db : i.country_db
            //     })
            //     // }
            //     years.push(parseInt(i.year))
            // })

            // years = years ? [...new Set(years)]: [9999];
            // let coor
            // let i = imageDatum[0]
            // if (i["longitude"] && i["latitude"]) {
            //     coor = [parseFloat(i.longitude), parseFloat(i.latitude)]
            // }
            // else {
            //     const countryMatched = countryData.features.filter(d => d.properties.COUNTRY === i.country_db );
            //     coor = countryMatched != false ? [countryMatched[0].geometry.coordinates[0], countryMatched[0].geometry.coordinates[1]]: null
            // }
        //     if (coor !== undefined && !isNaN(coor[0]) && !isNaN(coor[1])) {
        //         imagePoints_.push({
        //             "country_custom": d.country,
        //             "country": d.country_db,
        //             "years": [...new Set(years)],
        //             "region": d,
        //             "coor": c,
        //             "images": images
        //         })
        //     }
        // }
        // console.log(imagePoints_)
        setImagePoints(imagePoints_)
    }, [props.data])

    const flyTo = (center) => {
        if (center) {
            mapRef.current.flyTo({
                center: center,
                essential: true,
                zoom: mapRef.current.getZoom() < 5 ? 5 : mapRef.current.getZoom(),
                duration: 8000
            })
        }
    }


    return (
        <div className="map-container" ref={mapContainer} tabIndex={-1}>
            <ReactMapGL
                ref={mapRef}
                initialViewState={viewport}
                mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                onViewportChange={(viewport) => setViewport(viewport)}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            >
                {
                    // imagePoints.filter(img => !props.year || img.years.includes(props.year)).map((d, i) => (
                    imagePoints.map((d, i) => (
                        <Marker longitude={d.coor[0]} latitude={d.coor[1]}
                                anchor= {d.coor[1] > 30 ? 'bottom-left': 'top-left'}
                                clickTolerance={10}
                                key={'country-marker-' + d.country + i}
                                id={'country-marker-' + d.country + i}
                                style={{
                                    opacity: !props.year || d.years.includes(props.year) ? 0.75 : 0.07,
                                    pointerEvents: !props.year || d.years.includes(props.year) ? 'auto':'none',
                                    cursor: !props.year || d.years.includes(props.year) ? 'pointer':'default',
                                }}
                                onClick={()=> {
                                    if (!props.year || d.years.includes(props.year)) flyTo(d.coor)
                                }}
                        >
                            <Link to={'/images?coor=' + d.coor_str}
                            className={'w-full h-full'}>
                            <img ref={ img => imagesRef.current[i] = img }
                                 src={"https://ara-images.s3.amazonaws.com/" + d.images[0].file_name}
                                 key={"thumbnail-" + d.region}
                                 title={d.region}
                                 loading="lazy"
                                 style={{
                                     pointerEvents: !props.year || d.years.includes(props.year) ? 'auto':'none',
                                 }}
                                 alt=""
                            />
                            </Link>
                            {/*<div className='country-label'*/}
                            {/*     key={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}*/}
                            {/*     id={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}*/}
                            {/*>*/}
                            {/* {d.image[Math.floor(Math.random(0,d.image.length))].caption.split(" ").filter(d=>d.length > 4)[0].split("—")[0].split(",")[0]}*/}
                            {/* </div>*/}
                        </Marker>
                    ))
                }
                {   textData ?
                    textData.content.map((d, i) => (
                        <Marker
                            longitude={d.lon}
                            latitude={d.lat}
                            clickTolerance={10}
                            onClick={() => flyTo([d.lon, d.lat])}
                            >
                            <Link to={'r/' + i}>
                                <div className="border-solid border-2 bg-white opacity-50 text-[0.5rem] leading-tight w-[80px] h-[80px] overflow-clip serif">
                                {parse(d.html.split("<p>")[1])}
                                </div>
                            </Link>
                        </Marker>
                    )) : null
                }
            </ReactMapGL>
            <div className='MenuBar absolute bottom-0 w-full flex justify-between'>
                <Link className='text-3xl ml-3 mb-3 cursor-pointer font-sans' to={"/"}>
                    about
                </Link>
                {
                    Cookies.get("user") ?
                        <div className='text-3xl mr-3 mb-3 cursor-pointer font-sans'
                             onClick={signOut}>
                            sign out
                        </div> :
                        <div className='text-3xl mr-3 mb-3 cursor-pointer font-sans'
                             onClick={() => navigate("/login")}>
                            sign in
                        </div>
                }
            </div>
        </div>
    );
}

export default MapContainer;
