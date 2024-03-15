import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react'
import './MenuBar.css'

const Filters = (props) => {
    /** states **/
    // const [loading, setLoading] = useState(true);
    const [filteredCountry, setFilteredCountry] = useState(null);
    // TODO: set year filter to global state
    const [filteredYear, setFilteredYear] = useState(null);
    // const [filteredRegion, setFilteredRegion] = useState(null);
    const [countries, setCountries] = useState([]);
    // let regions = [];
    // let regions_set = []
    useEffect(() => {
        let countries = [];
        if (props.data) {
            props.data.forEach(d => {
                // TODO: multiple countries
                if (d.country_db && !d.country_db.includes("&")) countries.push(d.country_db)
                // let region = d.region ? d.region : d.country_db
                // regions.push(region)
            })
            countries = [...new Set(countries)].sort()
            setCountries(countries)
        }
    }, [props.data])

    // let navigate = useNavigate();

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
                                    onClick={() => {
                                        if (d == filteredCountry) {
                                            setFilteredCountry(null)
                                            props.onCountryChange(null)
                                        }
                                        else {
                                            setFilteredCountry(d)
                                            props.onCountryChange(d)
                                        }
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
                            }}
                        >{d}</div>
                    })
                }
            </div>
        </div>
    )
}

export default Filters
