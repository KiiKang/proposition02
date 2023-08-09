import {NavLink, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react'
import './MenuBar.css'
import axios from "axios";

const Filters = () => {
    /** states **/
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState('Seoul');
    const [filteredCountry, setFilteredCountry] = useState(null);
    const [filteredRegion, setFilteredRegion] = useState(null);

    const { search } = useLocation();

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

    const onHoverRegion = (e) => {
        setHoveredRegion(e.target.innerText);
        console.log(hoveredRegion)
    }

    const resetHoverRegion = (e) => {
        // setHoveredRegion(null);
    }

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                setImageData(tsvToArray(response.data));
                setError(null);
            } catch (err) {
                setError(err.message);
                setImageData(null);
            } finally {
                setLoading(false);
                if (search) {
                    let [query, value] = search.split("?")[1].split("=")
                    if (query === 'country') {
                        setFilteredCountry(value.replace('%20', ' '));
                    } else if(query === 'region'){
                        setFilteredRegion(value.replace('%20', ' '));
                    }
                }
            }
        }
        getData();
    }, [search, filteredCountry, filteredRegion])

    let countries = [];
    // let regions = [];
    // let regions_set = []
    if(!loading) {
        imageData.forEach(d => {
            if (d.country_db) countries.push(d.country_db)
            // let region = d.region ? d.region : d.country_db
            // regions.push(region)
        })
        countries = [...new Set(countries)].sort()
        // regions = [...new Set(regions)].sort()
        // regions.forEach(r => {
        //     let region_local = imageData.filter(d => d.region ? d.region === r : d.country_db === r)[0].region_local
        //     if (region_local && r) regions_set.push({"region": r, "region_local": region_local})
        //     else if (r && r !== ' ') regions_set.push({"region": r, "region_local": r})
        // })
    }

    let navigate = useNavigate();

    return (
        <div className='MenuBar'>
            {/*<div className='MenuBar-Left'>*/}
            {/*    <div className='MenuBar-Regions'>*/}
            {/*        {*/}
            {/*            regions_set.map(d => {*/}
            {/*                return (*/}
            {/*                    <div*/}
            {/*                        className='Filter-Country button-round-S'*/}
            {/*                        key={'filter-region-' + d.region}*/}
            {/*                        id={'filter-region-' + d.region}*/}
            {/*                        onMouseEnter={onHoverRegion}*/}
            {/*                        onMouseLeave={resetHoverRegion}*/}
            {/*                        onClick={() => navigate({*/}
            {/*                            pathname: '/filter',*/}
            {/*                            search: 'region=' + d.region*/}
            {/*                        })}*/}
            {/*                        style={{*/}
            {/*                            opacity: filteredCountry == null ? 1: filteredCountry === d.region ? 1: hoveredRegion === d.region? 1: 0.2,*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {  d.region_local ? d.region_local : d.region}*/}
            {/*                    </div>*/}
            {/*                )*/}
            {/*            })*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*    <div className= 'MenuBar-LeftRight'>*/}
            {/*        <div className='button-round-M button-dark'>*/}
            {/*            regions*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className='MenuBar-Right'>
                <div className= 'MenuBar-RightLeft'>
                    <div className='button-round-M button-dark'>
                        countries
                    </div>
                    {/*<div className='button-round-S'>*/}
                    {/*    {filteredCountry ? filteredCountry : null}*/}
                    {/*</div>*/}
                </div>
                <div className='MenuBar-Countries'>
                    {
                        countries.map((d, i) => {
                            return (
                                <div
                                    className='Filter-Country button-round-S'
                                    key={'filter-country-' + d}
                                    id={'filter-country-' + d}
                                    onClick={() => navigate({
                                        pathname: '/filter',
                                        search: 'country=' + d
                                    })}
                                    style={{
                                        opacity: filteredCountry == null ? 1: filteredCountry === d ? 1: hoveredRegion === d? 1: 0.2,
                                    }}
                                >
                                    {d === "United States of America" ? "United States": d }
                                </div>
                            )})
                    }
                </div>
            </div>
        </div>
    )
}

export default Filters
