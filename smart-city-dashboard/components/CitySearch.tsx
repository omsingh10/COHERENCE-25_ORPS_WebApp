import { useState } from 'react';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyCsmtI4xx4hI1qEpOVKj67poTYfEgNqGqY';

export default function CitySearch({ onCityData }: { onCityData: (data: any) => void }) {
  const [city, setCity] = useState('');

  const handleSearch = async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${GOOGLE_API_KEY}`
      );
      const cityData = response.data;
      onCityData(cityData);
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md w-1/2"
      />
      <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white rounded-md">
        Search
      </button>
    </div>
  );
}