// import { useEffect } from 'react';
import React, { useEffect, useState } from "react";
import dbDataRaw from './../db.txt';
import './SearchComponent.css'; 

function SearchComponent() {

    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestionData, setSuggestionData] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [abortController, setAbortController] = useState(null);

    useEffect(() => {
        loadFile();
        
        // cleanup
        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, []);

    // debounce function
    function debounce (fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
            }, delay);
        }
    }

    const loadFile = async () => {
        try {
            const response = await fetch(dbDataRaw);
            const text = await response.text();
            setDbData(text.split('\n'));
        } catch (error) {
            console.error('Error loading file:', error);
        }
    };

    const searchOperation = async (value, signal) => {
        try {
            // simulate a delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            
            if (signal.aborted) {
                throw new Error('Aborted');
            }

            const suggestions = dbData.filter((item) => {
                return item.toLowerCase().includes(value.toLowerCase());
            });

            if (signal.aborted) {
                throw new Error('Aborted');
            }

            return suggestions;
        } catch (error) {
            console.error('Search operation failed:', error);
            return [];
        }
    };

    const handleSearch = async (value) => {
        console.log('searching:', value);
        if (!value.trim()) {
            setSuggestionData([]);
            return;
        }

        if (abortController) {
            abortController.abort();
        }

        const newController = new AbortController();
        setAbortController(newController);

        try {
            const suggestions = await searchOperation(value, newController.signal);
            console.log(`suggestions for ${value} : ${suggestions}`);
            setSuggestionData(suggestions);
            setShowDropdown(true);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleChange = (e) => {
        // debouncedHandleSearch(e.target.value);
        debounce(handleSearch(e.target.value), 300);
    };


    return (
        <div className="search">
            <input  type="text" placeholder="Search..." onChange={handleChange}/>

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