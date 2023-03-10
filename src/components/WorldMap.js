// https://blog.logrocket.com/modern-api-data-fetching-methods-react/
// https://geojson-maps.ash.ms/
// https://observablehq.com/@d3/world-map
// https://www.canva.com/colors/color-wheel/
import * as d3 from "d3";
import { useWindowSize } from 'codefee-kit';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import React from 'react';

import './WorldMap.css'
import ImagePreview from "./ImagePreview";

const WorldMap = () => {
    /** data states **/
    const [mapData, setMapData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedImagePoints, setSelectedImagePoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    /** zoom states **/
    const [zoomParams, setZoomParams] = useState({"k": 1, "x": 0, "y": 0})
    const svgRef = useRef(null);
    const labelActiveRef = useRef([]);
    const labelNonActiveRef = useRef([]);

    const { width, height } = useWindowSize();
    const projection = d3.geoMercator()
        .precision(0.1)
        .rotate([10,0]);
    const path = d3.geoPath().projection(projection)
        .pointRadius(5);
    const graticule = d3.geoGraticule10();

    const csvToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split("\t");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

        const array = csvRows.map(i => {
            const values = i.split("\t");
            return csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
        });
        setImageData(array);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                let response
                response = await axios.get('./geo110.json');
                setMapData(response.data);
                response = await axios.get('./countries.geojson');
                setCountryData(response.data);
                response = await axios.get('./images.tsv');
                csvToArray(response.data)
                setError(null);
            } catch (err) {
                setError(err.message);
                setMapData(null);
                setCountryData(null);
                setImageData(null);
            } finally {
                setLoading(false);
            }
        };
        getData();

    }, []);

    useEffect(() => {
        const zoom = d3.zoom()
            .scaleExtent([1, 10])
        zoom
            .on("zoom", (event) => {
                const {x, y, k} = event.transform;
                setZoomParams({"k": k, "x": x, "y": y})
            });
        // d3.select(svgRef.current).call(zoom);
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            if (hoveredCountry) {
                labelActiveRef.current.forEach(d =>
                    d3.select(d)
                        .style('fill', '#4b4a49')
                        .style('stroke', '#ffffff')
                )
            }
            labelNonActiveRef.current.forEach(d =>
                d3.select(d)
                    .style('fill', '#ffffff')
                    .style('stroke', '#9b9690')
            )
            window.addEventListener("keydown", resetSelectedCountry)
        }
    }, [loading, labelActiveRef, labelNonActiveRef, hoveredCountry]);

    let countries = [];
    let imagePoints = [];
    const pointSize = 18;

    const onLabelClicked = (e) => {
        e.stopPropagation();
        setHoveredCountry(e.target.id.split("-")[0]);
        setSelectedRegion(e.target.id.split("-")[1]);
        setSelectedImagePoints(imagePoints.filter(d => d.region === e.target.id.split("-")[1])[0]);
    }

    const toggleSelectedCountry = (e) => {
        if (hoveredCountry) setHoveredCountry(null)
        else setHoveredCountry(e.target.id.split("-")[2]);
    }

    const resetSelectedCountry = (e) => {
        if (e.key){
            if (e.key !== 'Escape') return
        }
        setHoveredCountry(null);
        setSelectedImagePoints(null);
    }

    if(!loading) {
        if (width < height * 1.5) projection.fitHeight(height, mapData)
        else projection.fitWidth(width, mapData)
        projection.translate([width*0.5, height *0.65])

        imageData.forEach(i => {
            const countryMatched = countryData.features.filter(d => d.properties.COUNTRY === i.country_db );
            if (i.file_name != false && countryMatched != false) {
                let imagePoint = imagePoints.filter(d => d.region === i.region);
                if (!countries.includes(countryMatched[0].properties.COUNTRY)){
                    countries.push(countryMatched[0].properties.COUNTRY);
                }
                if (imagePoint.length === 0) {
                    const coor = (i.longitude && i.latitude) ?
                        [parseFloat(i.longitude), parseFloat(i.latitude)] :
                        [countryMatched[0].geometry.coordinates[0], countryMatched[0].geometry.coordinates[1]]
                    imagePoints.push({
                        "coor": coor,
                        "region": i.region ? i.region : i.country_db,
                        "country": i.country_db,
                        "country_custom": i.country,
                        "images": [{
                            "file_name": i.file_name,
                            "year": i.year,
                            "caption": i.caption,
                            "footnote": i.footnote
                        }],
                    })
                } else {
                    let images = imagePoint[0].images;
                    images.push({
                        "file_name": i.file_name,
                        "year": i.year,
                        "caption": i.caption,
                        "footnote": i.footnote
                    });
                    imagePoint.images = images;
                }
            }
        })
        return (
            <div className='map-container'>
                <svg id='world-map' ref={ svgRef }
                     width={ width } height={ height }
                     onClick={resetSelectedCountry}>
                    <g className='map-component' id='graticules'
                       transform={'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')'}>
                        {
                            <path className='graticule'
                                d={path(graticule)}
                                strokeWidth={0.2/zoomParams.k + 'px'}
                            />
                        }
                    </g>
                    <g className='map-component' id='country-paths'
                       transform={'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')'}>
                    >
                        {
                            mapData.features.map(d => (
                                <path className='country-path'
                                      key={d.properties.admin}
                                      id={d.properties.admin}
                                      d={path(d.geometry)}
                                      strokeWidth={0.3/zoomParams.k + 'px'}
                                />
                            ))
                        }
                    </g>
                    <g className='map-component' id='country-labels'
                       transform={'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')'}>
                        {
                            imagePoints.map((d, i) => (
                                <rect ref={ label => d.country === hoveredCountry?
                                    labelActiveRef.current[i] = label : labelNonActiveRef.current[i] = label }
                                      className={d.country + '-label'}
                                      key={d.country + '-' + d.region + '-label' + i}
                                      id={d.country + '-' + d.region + '-label' + i}
                                      width={ pointSize/zoomParams.k + 'px'}
                                      height={ pointSize/zoomParams.k + 'px'}
                                      x={projection(d.coor)[0] -pointSize/zoomParams.k/2+ 'px'}
                                      y={projection(d.coor)[1] -pointSize/zoomParams.k/2+ 'px'}
                                      onClick={onLabelClicked}
                                />
                            ))
                        }
                    </g>
                </svg>
                {
                    selectedImagePoints ?
                        selectedImagePoints.images.map( (image, i) => (
                            <ImagePreview key={'image-card-'+ selectedImagePoints.country + '-' +i}
                                          image={image}
                                          index={i}
                                          imageCount={selectedImagePoints.images.length}
                                          country={selectedImagePoints.country}
                                          anchorPt={projection(selectedImagePoints.coor)}
                                          zoomParams={zoomParams}
                            />
                        )
                    ) : null
                }
                <div className='filters' id='filters-country'>
                    {
                        countries.map(d =>(
                                <div className='filter-country'
                                     key={'filter-country-' + d}
                                     id={'filter-country-' + d}
                                     onMouseOver={toggleSelectedCountry}
                                     onMouseLeave={toggleSelectedCountry}
                                     style={{
                                         opacity: hoveredCountry == null ? 1: hoveredCountry === d ? 1: 0.2,
                                         // height: (width - 150)/countries.length - 15
                                }}
                                >
                                    {d === "United States of America" ? "United States": d }
                                </div>
                        ))
                    }
                </div>
            </div>
        )
    }


    // return (
    //     <svg className="mapContainer" ref={ svgRef }
    //          width={'100vw'} height={'100vh'}
    //     >
    //        <g> {countries}</g>
    //     </svg>
    // )
}

export default WorldMap;
