import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const LocationSelector = ({ edit, location, setLocation }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [isEditing, setIsEditing] = useState(edit);
  const [inputValue, setInputValue] = useState(location);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('https://countriesnow.space/api/v0.1/countries');
        const data = res.data.data;
        const cities = data.map((country) => country.cities.map((city) => `${city}, ${country.country}`)).flat();
        setLocations([...cities, "Other"]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    setIsEditing(edit);
  }, [edit]);

  const filterSuggestions = useCallback(
    debounce((value) => {
      if (value.length >= 2) {
        const filteredSuggestions = locations.filter((location) =>
          location.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : ["Other"]);
      } else {
        setSuggestions(["Other"]);
      }
    }, 300),
    [locations]
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    filterSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedLocation(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
    setLocation(suggestion);
  };

  return (
    <div>
      {!isEditing ? (
        <div className='flex items-center'>
          {selectedLocation}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className={`bg-transparent focus:border-b w-full focus:ring-0 focus:outline-none transition-all duration-50 ${isEditing ? "border-b border-gray-500" : ""}`}
          />
          {suggestions.length > 0 && (
            <ul style={{ position: 'absolute', border: '1px solid #ccc', marginTop: '0', padding: '0', listStyleType: 'none', width: '100%', backgroundColor: 'black' }}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ padding: '5px', cursor: 'pointer' }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
