import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Map, Marker } from "react-map-gl";
import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios, { create } from "axios";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css'
import './WorldMap.css'
import ImagePreview from "./ImagePreview";
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid2sxa2FuZyIsImEiOiJjbGl4c2Q2M3IwOWU0M2RxbDBtcXptZzJqIn0.0zFVop4aJdmnT7uEsZN3YQ'
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

const MapContainer = () => {
    /** refs **/
    const mapRef = useRef(null);
    const labelsRef = useRef([]);
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
    const [filteredCountry, setFilteredCountry] = useState(null);
    // const [filteredRegion, setFilteredRegion] = useState(null);
    /** states-data **/
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [countryBounds, setCountryBounds] = useState(null);

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

    const getData = async () => {
        try {
            let response
            response = await axios.get('./images.tsv');
            setImageData(tsvToArray(response.data));
            response = await axios.get('./country-bounding-box.json');
            setCountryBounds(response.data);
            response = await axios.get('./countries.geojson');
            setCountryData(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setCountryData(null);
            setCountryBounds(null);
            setImageData(null);
        } finally {
            setLoading(false);
            // if (map.current) return; // initialize map only once
            // map.current = new mapboxgl.Map({
            //     container: mapContainer.current,
            //     style: 'mapbox://styles/wk1kang/cleyy88d2000001nkj1mettoe',
            //     center: [viewport.latitude, viewport.longitude],
            //     zoom: viewport.zoom,
            //     maxZoom: 8
            // });
        }
    }

    const handleMouseOver = (i) => {
        labelsRef.current[i].style.filter = 'blur(0)'
    }

    useEffect(() => {
        getData();
        if (search) {
            let [query, value] = search.split("?")[1].split("=")
            // if (query === 'region') {
            //     setFilteredRegion(value.replace('%20', ' '));
            // }
            if (query === 'country') {
                setFilteredCountry(value.replace('%20', ' '));
                let bounds = Object.values(countryBounds).filter(d => d[0] === value.replace('%20', ' '))[0][1];
                // TODO: make exceptions for when the country not in the db is selected
                if (bounds) {
                    mapRef.current.fitBounds([[bounds[0] - 6, bounds[1] - 6], [bounds[2] + 6, bounds[3] + 6]], {
                        duration: 10000
                    })
                }
            } else {
                setFilteredCountry(null);
            }
        }

    }, [search]);

    if (filteredCountry) {
        labelsRef.current.forEach(l => {
            if (l.id.split('-')[2] === filteredCountry) {
                l.style.filter = 'blur(0)'
            } else {
                l.style.filter = 'blur(3px)'
            }
        })
    }



    let imagePoints = []
    let regions = []
    if (!loading) {
        imageData.forEach(d => {
            let region = d.region ? d.region : d.country_db
            regions.push(region)
        })
        regions = [...new Set(regions)]
        regions.forEach(r => {
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
            } else {
                const countryMatched = countryData.features.filter(d => d.properties.COUNTRY === i.country_db );
                coor = countryMatched != false ? [countryMatched[0].geometry.coordinates[0], countryMatched[0].geometry.coordinates[1]]: null
            }
            if (coor) {
                imagePoints.push({
                    "country_custom": i.country,
                    "country": i.country_db,
                    "years": years,
                    "region": r,
                    "coor": coor,
                    "image": images,
                })
            }
        })
        // const pointSize = 20;

        // imagePoints.forEach((d, i) => {
        //     console.log(map.current)
        //     const root = createRoot(map.current);
        //     root.render(<div className='country-markers' />);
        //     if (d.coor) new mapboxgl.Marker(root).setLngLat(d.coor).addTo(map.current);
        // })

        // imagePoints.forEach((d, i) => {
        //         axios.get('/images/gl/' + d.image[0].file_name.trim().split('.')[0] + '-gl.jpg')
        //             .then(imagesRef.current[i].style.visibility = "visible")
        //
        //     }
        // )

        imagesRef.current.forEach((d, i) => {
                axios.get('/images/gl/' + imagePoints[i].image[0].file_name.trim().split('.')[0] + '-gl.jpg')
                    .then(d.style.visibility = "visible")
            }
        )

    }

    return (
        <div className="map-container">
            <ReactMapGL
                initialViewState={viewport}
                mapStyle='mapbox://styles/wk1kang/cleyy88d2000001nkj1mettoe'
                onViewportChange={(viewport) => setViewport(viewport)}
                ref={mapRef}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            >
                {
                    imagePoints.map((d, i) => (
                        <Marker longitude={d.coor[0]} latitude={d.coor[1]}
                                anchor= {d.coor[1] > 30 ? 'bottom-left': 'top-left'}
                                clickTolerance={10}
                                key={'country-marker-' + d.country + i}
                                id={'country-marker-' + d.country + i}
                                onMouseOver={() => handleMouseOver(i)}
                                onClick={()=> {
                                    navigate({
                                        pathname: '/images',
                                        search: 'region=' + d.region
                                    })
                                    setFilteredCountry(null);
                                    mapRef.current.flyTo({
                                        center: d.coor,
                                        essential: true,
                                        zoom: mapRef.current.getZoom() < 5.5 ? 5.5 : mapRef.current.getZoom(),
                                        duration: 8000
                                    })
                                }}
                        >
                            <img ref={ img => imagesRef.current[i] = img }
                                 src={'/images/gl/' + d.image[0].file_name.trim().split('.')[0] + '-gl.jpg'}
                                 title={d.image[0].region}
                                 style={{visibility: "hidden"}}
                                 alt=''/>
                            <div ref={ label => labelsRef.current[i] = label }
                                 className='country-label'
                                 key={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}
                                 id={'country-label-' + d.country + '-' + d.region + '-' + d.years.join('_') + '-' + i}
                            >
                                    "{d.image[0].caption}"
                                {/*{*/}
                                {/*    d.image.map(function(img) {*/}
                                {/*        return (*/}
                                {/*            <span>*/}
                                {/*                {img.caption}<br/>*/}
                                {/*            </span>*/}
                                {/*        )*/}
                                {/*    })*/}
                                {/*}*/}
                            </div>
                            {/*{*/}
                            {/*    selectedImagePoints[0] != false ?*/}
                            {/*        <ImagePreview key={'image-card-' + selectedImagePoints[0].country + '-' + 1}*/}
                            {/*                      image={selectedImagePoints[0].images[0]}*/}
                            {/*                      index={1}*/}
                            {/*                      imageCount={selectedImagePoints[0].images.length}*/}
                            {/*                      country={selectedImagePoints[0].country}*/}
                            {/*        />*/}
                            {/*        : null*/}
                            {/*}*/}
                        </Marker>
                    ))
                }
                {/*<Marker*/}
                {/*    className='country-markers'*/}
                {/*    latitude={37}*/}
                {/*    longitude={126}*/}
                {/*    onClick={() => navigate('/seoul!')}*/}
                {/*>*/}
                {/*    <img*/}
                {/*        style={{ height: 50, width: 50 }}*/}
                {/*        src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"*/}
                {/*    />*/}
                {/*</Marker>*/}

            {/*<Marker coordinates={coordinates} className={className}>*/}

            {/*<svg>*/}
            {/*    {*/}
            {/*        imagePoints.map((d, i) => (*/}
            {/*            <rect ref={ label => labelsRef.current[i] = label }*/}
            {/*                  className={d.country + '-label'}*/}
            {/*                  key={d.country + '-' + d.region + '-label' + i}*/}
            {/*                  id={d.country + '-' + d.region + '-label' + i}*/}
            {/*                  width={ pointSize + 'px'}*/}
            {/*                  height={ pointSize + 'px'}*/}
            {/*                  style = {{*/}
            {/*                      fill: d.country === filteredCountry? '#252323': '#8c8484',*/}
            {/*                      filter: d.country === filteredCountry? 'blur(1px)': 'blur(5px)'*/}
            {/*                  }}*/}
            {/*            />*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</svg>*/}
            </ReactMapGL>
        </div>
    );
}

export default MapContainer;
