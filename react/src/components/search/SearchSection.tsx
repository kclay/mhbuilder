import React from 'react'
import {SearchActiveFilters} from "./SearchActiveFilter";
import {SearchList} from "./SearchList";
import {SearchMenu} from "./SearchMenu";

export const SearchSection = () => {

    return <section className="search-section">
        <div className="container">
            <SearchMenu/>
            <SearchActiveFilters/>
            <SearchList/>
        </div>
    </section>
};