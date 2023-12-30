import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Marker } from "react-map-gl";
import React, {useEffect, useRef, useState} from "react";
import AWS from 'aws-sdk';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {tsvToArray} from "../helpers";

import 'mapbox-gl/dist/mapbox-gl.css'
import './MapContainer.css'
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const MapContainer = () => {
    /** refs **/
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
        maxZoom: 9
    }
    const [viewport, setViewport] = useState(viewport_init);
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [filteredYear, setFilteredYear] = useState(0);
    // const [filteredRegion, setFilteredRegion] = useState(null);
    /** states-data **/
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageData, setImageData] = useState([]);
    const [imagePoints, setImagePoints] = useState([]);
    // const [countryData, setCountryData] = useState(null);
    const [countryBounds, setCountryBounds] = useState(null);
    const { search } = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                let imageData_ = tsvToArray(response.data);
                // let imageData_ = []
                if (filteredYear !== 0) {
                    imageData_ = imageData_.filter(d => d.year === filteredYear)
                }
                setImageData(imageData_);
                response = await axios.get('./country-bounding-box.json');
                setCountryBounds(response.data);
                setError(null);
            } catch (err) {
                console.log(err.message);
                // setImageData(null);
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, [filteredYear])

    useEffect(() => {
        if (search) {
            let [query, value] = search.split("?")[1].split("=")
            // if (query === 'region') {
            //     setFilteredRegion(value.replace('%20', ' '));
            // }
            if (query === 'year') {
                setFilteredYear(parseInt(value));
            }
                // else if (query === 'country') {
                //     setFilteredCountry(value.replace('%20', ' '));
                //     let bounds = Object.values(countryBounds).filter(d => d[0] === value.replace('%20', ' '))[0][1];
                //     // TODO: make exceptions for when the country not in the db is selected
                //     if (bounds) {
                //         mapRef.current.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {
                //             duration: 10000
                //         })
                //     }
            // }
            else {
                setFilteredCountry(null);
                setFilteredYear(0);
            }
        }
        // if (filteredYear !== undefined) {
        //     imagePoints.forEach((d, i) => {
        //         if (d !== filteredYear) {
        //             imagesRef.current[i].style.opacity = 0.2
        //         } else {
        //             imagesRef.current[i].style.opacity = 1
        //         }
        //     })
        // } else {
        //     imagePoints.forEach((d, i) => {
        //         imagesRef.current[i].style.opacity = 1
        //     })
        // }
    }, [search]);

    useEffect(() => {
        let regions = []
        let imagePoints_ = []
        if (imageData.length !== 0) {
            imageData.forEach(d => {
                let region = d.region ? d.region : d.country_db
                regions.push(region)
            })
            regions = [...new Set(regions)]
            for (const r of regions) {
                let imageDatum = []
                imageData.forEach(i => {
                    let region = i.region ? i.region : i.country_db
                    if (region === r) imageDatum.push(i)
                })
                let images = []
                let years = []
                imageDatum.forEach(i => {
                    images.push({
                        "file_name": i.file_name,
                        "year": i.year,
                        "caption": i.caption_title,
                        "region": i.region ? i.region + ', ' + i.country_db: i.country_db
                    })
                    years.push(i.year)
                })
                years = years ? [...new Set(years)]: [9999];

                let coor
                let i = imageDatum[0]
                if (i.longitude && i.latitude) {
                    coor = [parseFloat(i.longitude), parseFloat(i.latitude)]
                }
                // else {
                //     const countryMatched = countryData.features.filter(d => d.properties.COUNTRY === i.country_db );
                //     coor = countryMatched != false ? [countryMatched[0].geometry.coordinates[0], countryMatched[0].geometry.coordinates[1]]: null
                // }
                if (coor !== undefined) {
                    imagePoints_.push({
                        "country_custom": i.country,
                        "country": i.country_db,
                        "years": years,
                        "region": r,
                        "coor": coor,
                        "image": images
                    })
                }
            }
        }
        setImagePoints(imagePoints_)
    }, [imageData, filteredYear])

    // useEffect(() => {
    //
    // }, [imagePoints])


    useEffect(() => {
        const getSignedUrl = async (file_name, i) => {
            const s3 = new AWS.S3();
            // console.log("getting signed url for", file_name)
            try {
                const signedUrl = await s3.getSignedUrlPromise('getObject', {
                    Bucket: 'ara-images',
                    Key: file_name,
                    Expires: 60,
                })
                imagesRef.current[i].src = signedUrl
            } catch(err) {
                console.error('Error getting image:', err);
            }
        }

        if (imagePoints.length !== 0) {
            AWS.config.update({
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                region: 'us-east-1',
            });
            imagePoints.forEach((d, i) => {
                getSignedUrl(d.image[0].file_name, i)
            })
        }
    }, [imagePoints])

    return (
        <div className="map-container">
            <ReactMapGL
                initialViewState={viewport}
                mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                onViewportChange={(viewport) => setViewport(viewport)}
                ref={mapRef}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            >
                {
                    imagePoints.map((d, i) => (
                        <Marker longitude={d.coor[0]} latitude={d.coor[1]}
                                anchor= {d.coor[1] > 30 ? 'bottom-left': 'top-left'}
                                clickTolerance={10}
                                key={'country-marker-' + d.country + i}
                                id={'country-marker-' + d.country + i}
                                onClick={()=> {
                                    navigate({
                                        pathname: '/images',
                                        search: 'region=' + d.region
                                    })
                                    mapRef.current.flyTo({
                                        center: d.coor,
                                        essential: true,
                                        zoom: mapRef.current.getZoom() < 5.5 ? 5.5 : mapRef.current.getZoom(),
                                        duration: 8000
                                    })
                                }}
                        >
                            <img ref={ img => imagesRef.current[i] = img }
                                 key={"thumbnail-" + d.region}
                                 title={d.region}
                                 loading="lazy"
                                 alt=''
                            />
                            {/*<div className='country-label'*/}
                            {/*     key={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}*/}
                            {/*     id={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}*/}
                            {/*>*/}
                            {/* {d.image[Math.floor(Math.random(0,d.image.length))].caption.split(" ").filter(d=>d.length > 4)[0].split("—")[0].split(",")[0]}*/}
                            {/* </div>*/}
                        </Marker>
                    ))
                }
            </ReactMapGL>
        </div>
    );
}

export default MapContainer;
