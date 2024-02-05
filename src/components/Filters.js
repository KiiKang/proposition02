import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react'
import './MenuBar.css'
import axios from "axios";
import {tsvToArray} from "../helpers";

const Filters = (props) => {
    /** states **/
    const [loading, setLoading] = useState(true);
    const [imageData, setImageData] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState('Seoul');
    const [filteredCountry, setFilteredCountry] = useState(null);
    // TODO: set year filter to global state
    const [filteredYear, setFilteredYear] = useState(null);
    // const [filteredRegion, setFilteredRegion] = useState(null);
    const { search } = useLocation();

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                setImageData(tsvToArray(response.data));
            } catch (err) {
                console.error(err.message);
                setImageData(null);
            } finally {
                setLoading(false);
                if (search) {
                    let [query, value] = search.split("?")[1].split("=")
                    if (query === 'country') {
                        setFilteredCountry(value.replace('%20', ' '));
                    }
                }
            }
        }
        getData();
    }, [search, filteredCountry])

    let countries = [];
    // let regions = [];
    // let regions_set = []
    if(!loading) {
        imageData.forEach(d => {
            // TODO: multiple countries
            if (d.country_db && !d.country_db.includes("&")) countries.push(d.country_db)
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
            <div className='MenuBar-Right '>
                <div className= 'MenuBar-RightLeft'>
                    <div className='text-4xl mr-4 cursor-pointer font-sans mt-2'>
                        countries
                    </div>
                </div>
                <div className='MenuBar-Countries text-xl tracking-tighter cursor-pointer pt-1.5 font-sans'>
                    {
                        countries.map((d, i) => {
                            return (
                                <div
                                    className='w-fit hover:underline'
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
            <div className="fixed bottom-12 flex justify-between left-1/2 min-w-[70%] -translate-x-1/2 justify-self-center m-auto">
                {
                        Array.from({ length: (1955 - 1945) + 1 }, (_, i) => 1945 + i).map((d) => {
                        return <div
                            className='text-2xl cursor-pointer font-sans hover:underline'
                            style={{
                                opacity: filteredYear === null ? 1 : d == filteredYear ? 1 : 0.2
                            }}
                            onClick={() => {
                                if (d == filteredYear) {
                                    setFilteredYear(null)
                                    props.onYearChange(null)
                                }
                                else {
                                    setFilteredYear(d)
                                    props.onYearChange(d)
                                }
                            }
                            }
                        >{d}</div>
                    })
                }
            </div>
        </div>
    )
}

export default Filters
