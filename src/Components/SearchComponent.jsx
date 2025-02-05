// import { useEffect } from 'react';
import React, { useEffect, useState, useCallback } from "react";
import dbDataRaw from './../db.txt';
import './SearchComponent.css'; 

function SearchComponent() {

    const [showDropdown, setShowDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [suggestionData, setSuggestionData] = useState([]);
    const [dbData, setDbData] = useState([]);

    useEffect(() => {
        loadFile();
    }, []);

    // function debounce (fn, delay) {
    //     let timer;
    //     return function (...args) {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => {
    //             fn(...args);
    //         }, delay);
    //     }
    // }

    // updated debounce function to prevent search results from showing if the search is canceled
    function debounce(fn, delay) {
        let timer;
        let currentPromiseReject;
      
        return function (...args) {
          const later = () => {
            clearTimeout(timer);
            currentPromiseReject = null;
            fn(...args);
          };
      
          if (currentPromiseReject) {
            currentPromiseReject({ canceled: true });
          }
      
          clearTimeout(timer);
          timer = setTimeout(later, delay);
      
          return new Promise((resolve, reject) => {
            currentPromiseReject = reject;
            later();
          });
        };
      }

    const loadFile = async () => {
        console.log('loadfile called');

        await fetch(dbDataRaw)
            .then(response => response.text())
            .then(text => {
                // console.log(text);
                setDbData(text.split('\n'));
            })
            .catch(error => {
                console.log(error);
            });

        console.log('dbData', dbData);
    }

    // const handleSearch = (e) => {
    //     console.log(e.target.value);
    //     setSearchText(e.target.value);
    //     const suggestions = dbData.filter((item) => {
    //         return item.toLowerCase().includes(e.target.value.toLowerCase());
    //     });
    //     console.log('dbData', dbData);
    //     console.log('suggest', suggestions);
    //     setSuggestionData(suggestions);
    //     if (e.target.value.length > 0 && suggestions.length > 0) {
    //         setShowDropdown(true);
    //     } else {
    //         setShowDropdown(false);
    //     }
    // }

    const debouncedSearch = useCallback(
      debounce((value) => {
        const suggestions = dbData.filter((item) => {
          return item.toLowerCase().includes(value.toLowerCase());
        });
        setSuggestionData(suggestions);
        setShowDropdown(value.length > 0 && suggestions.length > 0);
      }, 300),
      [dbData]
    );

    const handleSearch = (e) => {
      setSearchText(e.target.value);
      debouncedSearch(e.target.value);
    };


    return (
        <div className="search">
            <input  type="text" placeholder="Search..." onChange={handleSearch}/>

            {showDropdown && (
                <div className="dropdown">
                    {suggestionData.map((item, index) => (
                        <div key={index} className="item">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchComponent;