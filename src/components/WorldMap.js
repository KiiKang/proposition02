// https://blog.logrocket.com/modern-api-data-fetching-methods-react/
// https://geojson-maps.ash.ms/
// https://observablehq.com/@d3/world-map
// https://www.canva.com/colors/color-wheel/
import { geoPath, geoMercator, geoGraticule10 } from 'd3';
import { useWindowSize } from 'codefee-kit';
import { useState, useEffect } from 'react';
import axios from "axios";

import './WorldMap.css'

const WorldMap = () => {

    const [mapData, setMapData] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { width, height } = useWindowSize();
    const projection = geoMercator()
        .precision(100);
    const path = geoPath().projection(projection)
        .pointRadius(5);

    const graticule = geoGraticule10();

    const csvToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

        const array = csvRows.map(i => {
            const values = i.split(",");
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
                response = await axios.get('./geo50.json');
                setMapData(response.data);
                response = await axios.get('./images.csv');
                csvToArray(response.data)
                setError(null);
            } catch (err) {
                setError(err.message);
                setMapData(null);
                setImageData(null);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    let countries = []
    const pointSize = 6


    if(!loading) {
        projection.fitWidth(width, mapData)
            .translate([width*0.5, height *0.65])
        // projection.fitExtent([[0,0], [width, height]], data.features);

        mapData.features.forEach(d => {
            countries.push({
                "country": d.properties.admin,
                "coor": [d.properties.label_x, d.properties.label_y],
                "images": []
            })
        })
        countries.forEach(d => {
            imageData.forEach(i => {
                if (i.country_db === d.country) {
                    d.images.push({
                        "file_name": i.file_name,
                        "year": d.year,
                        "caption": d.caption,
                        "footnote": d.footnote
                    })
                }
            })
        })
        countries = countries.filter(d => d.images != false)

        console.log(countries)
        return (
            <div className='map-container'>
                <svg className='world-map'
                width={ width } height={ height }>
                    <g className='graticules'>
                        {
                            <path className='graticule'
                                d={path(graticule)}
                            />
                        }
                    </g>
                    <g className='country-paths'>
                        {
                            mapData.features.map(d => (
                                <path className='country-path'
                                    key={d.properties.admin}
                                    id={d.properties.admin}
                                    d={path(d.geometry)}
                                />
                            ))
                        }
                    </g>
                </svg>
                <div className='country-labels'>
                    {
                        countries.map(d => (
                            <div className='country-label'
                                 key={d.country + '-label'}
                                 id={d.country + '-label'}
                                 style={{
                                     width: pointSize + 'px',
                                     height: pointSize + 'px',
                                     left: projection(d.coor)[0] + 'px',
                                     top: projection(d.coor)[1] + 'px',
                                 }}
                            />
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
