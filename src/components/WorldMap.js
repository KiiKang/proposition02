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
const clone = require('rfdc')()

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
    const [zoomParams, setZoomParams] = useState({"k": 1, "x": 0, "y": 0})
    const [patternSvg, setPatternSvg] = useState(null);
    /** refs **/
    const svgRef = useRef(null);
    const labelsRef = useRef([]);
    const filtersRef = useRef([]);
    const connections = useRef(null);

    const { width, height } = useWindowSize();
    const projection = d3.geoMercator()
        .precision(1)
        .rotate([-150, 0])
        .translate([-512,-52]);

    const path = d3.geoPath().projection(projection)
        .pointRadius(5)

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
        return array;
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
                setImageData(csvToArray(response.data));
                response = await axios.get('./pattern/diagonal-stripe-1.svg')
                setPatternSvg(response.data)
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
            window.addEventListener("keydown", resetSelectedCountry)
            console.log(patternSvg);
            // d3.select(connections.current)
            //     .remove()
            // labelsRef.current.forEach(l => {
            //     filtersRef.current.forEach(f => {
            //         if (l.country === f.country) {
            //             let rectStart = f.getBoundingClientRect()
            //             let rectEnd = l.getBoundingClientRect()
            //             let path = d3.path()
            //             let [x0, y0, x1, y1] = [
            //                 (rectStart.left + rectStart.right)/2, rectStart.bottom,
            //                 (rectEnd.left + rectEnd.right)/2, rectEnd.top
            //             ]
            //             let [cx0, cy0] = [x0, y1-100]
            //             let [cx1, cy1] = [x1, y0+100]
            //             path.moveTo(x0, y0)
            //             path.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1)
            //             path.lineTo(x1, y1)
            //             d3.select(connections.current)
            //                 .append("path")
            //                 .attr("d", path)
            //                 .attr("class", "connections")
            //                 .attr("fill", "none")
            //                 .attr("stroke", "black")
            //                 .attr("opacity", 0.2)
            //                 .attr("stroke-width", '0.5px')
            //                 .attr("transform", 'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')')
            //         }
            //     })
            // })
        }
    }, [loading, labelsRef, filtersRef, zoomParams, width, height]);

    let countries = [];
    let imagePoints = [];
    const pointSize = 14;

    const onLabelClicked = (e) => {
        e.stopPropagation();
        setHoveredCountry(e.target.id.split("-")[0]);
        setSelectedRegion(e.target.id.split("-")[1]);
        setSelectedImagePoints(imagePoints.filter(d => d.region === e.target.id.split("-")[1])[0]);
    }

    const setSelectedCountry = (e) => {
        setHoveredCountry(e.target.id.split("-")[2]);
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
            if (i.country_db) countries.push(i.country_db)
        })
        countries = [...new Set(countries)]
        console.log(countries)

        imageData.forEach(i => {
            const countryMatched = countryData.features.filter(d => d.properties.COUNTRY === i.country_db );
            if (i.file_name != false && countryMatched != false) {
                let regions = [...imagePoints].map(p => (p.region));
                // if (!countries.includes(countryMatched[0].properties.COUNTRY)){
                //     countries.push(countryMatched[0].properties.COUNTRY);
                // }
                if (regions.includes(i.region)) {
                    let idx = imagePoints.findIndex(d => d.region === i.region)
                    let imagePoint = clone(imagePoints[idx])
                    imagePoint.images.push({
                            "file_name": i.file_name,
                            "year": i.year,
                            "caption": i.caption,
                            "footnote": i.footnote
                        });
                    imagePoints[idx] = imagePoint
                } else {
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

                }
            }
        })
        return (
            <div className='map-container'>
                <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                        <pattern id="diagonal-stripe-1" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform='scale(0.8)'>
                            <image xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+Cg==" x="0" y="0" width="10" height="10">
                            </image>
                        </pattern>
                    </defs>
                </svg>

                <svg id='world-map' ref={ svgRef }
                     width={ width } height={ height }
                     onClick={resetSelectedCountry}>
                    <g className='map-component' id='graticules'
                       transform={'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')'}>
                        {
                            <path className='graticule'
                                d={path(graticule)}
                                strokeWidth={0.2/zoomParams.k + 'px'}
                                  fill={'none'}
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
                                      strokeWidth={hoveredCountry === d.properties.admin ? 1/zoomParams.k + 'px': .3/zoomParams.k + 'px'}
                                      style={{fill: hoveredCountry === d.properties.admin ? "url(#diagonal-stripe-1)": '#ffffff'}}
                                />
                            ))
                        }
                    </g>
                    <g className='map-component' id='country-labels'
                       transform={'translate(' + zoomParams.x + ' ' + zoomParams.y + ') scale(' + zoomParams.k + ')'}>
                        {
                            imagePoints.map((d, i) => (
                                <rect ref={ label => labelsRef.current[i] = label }
                                      className={d.country + '-label'}
                                      key={d.country + '-' + d.region + '-label' + i}
                                      id={d.country + '-' + d.region + '-label' + i}
                                      width={ pointSize/zoomParams.k + 'px'}
                                      height={ pointSize/zoomParams.k + 'px'}
                                      x={projection(d.coor)[0] -pointSize/zoomParams.k/2+ 'px'}
                                      y={projection(d.coor)[1] -pointSize/zoomParams.k/2+ 'px'}
                                      onClick={onLabelClicked}
                                      style = {{
                                          fill: d.country === hoveredCountry? '#252323': '#8c8484',
                                          filter: d.country === hoveredCountry? 'blur(1px)': 'blur(5px)'
                                      }}
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
                <div className='WorldMap-Filters' id='Filters-Country'>
                    {
                        countries.map((d, i) => {
                            return (
                                <div
                                    ref={ f => filtersRef.current[i] = f }
                                     className='WorldMap-Filter-Country button-round-S'
                                     key={'filter-country-' + d}
                                     id={'filter-country-' + d}
                                     onMouseOver={setSelectedCountry}
                                     onMouseLeave={resetSelectedCountry}
                                     style={{
                                         opacity: hoveredCountry == null ? 1: hoveredCountry === d ? 1: 0.2,
                                }}
                                >
                                    {d === "United States of America" ? "United States": d }
                                </div>
                        )})
                    }
                </div>
                <svg ref={connections} className='connections-svg'/>
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
