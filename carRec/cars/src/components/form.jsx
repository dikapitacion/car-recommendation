"use client"
import React, { useState, useEffect} from 'react';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const marked = require('marked');

const RecommendationCard = ({ title, content }) => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <div className="space-y-2">
          {content}
        </div>
      </div>
    );
  };
const CarForm = () => {
    const [budget, setBudget] = useState(500000);
    const [fuelType, setFuelType] = useState('');
    const [brandPreference, setBrandPreference] = useState('');
    const [carType, setCarType] = useState('');
    const [mileagePriority, setMileagePriority] = useState('');
    const [safetyPriority, setSafetyPriority] = useState('');
    const [submitted,setSubmitted] = useState(false);
    const [carList,setCarList] = useState('');
    const formatResponse = (text) => {
        // Remove any extra quotes at the start and end
        const cleanText = text.replace(/^"|"$/g, '');
        
        // Split the text into sections based on double asterisks
        const sections = cleanText.split('**').filter(Boolean);
        
        return (
            <div className="max-w-3xl mx-auto space-y-6 p-6 text-white">
                {sections.map((section, index) => {
                    // Check if this is a heading (doesn't start with *)
                    if (!section.startsWith('*')) {
                        const parts = section.split('***').filter(Boolean);
                        return (
                            <div key={index} className="mb-6">
                                <h2 className="text-2xl font-bold mb-4">{parts[0]}</h2>
                                <div className="space-y-2">
                                    {parts.slice(1).map((part, idx) => {
                                        const [title, description] = part.split(':').map(s => s.trim());
                                        return description ? (
                                            <div key={idx} className="ml-4">
                                                <span className="font-semibold">{title}:</span>
                                                <span className="ml-2">{description}</span>
                                            </div>
                                        ) : (
                                            <div key={idx} className="ml-4">{part}</div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    async function fetchData(e) {
        e.preventDefault(); // Prevent the form from submitting and reloading the page
        let prompt = `give recommendation for a car available in india whose budget is under ${budget} , fuel type is ${fuelType}, it is preffered if the brand is ${brandPreference}, the car should be an ${carType}, mileage of the car is of ${mileagePriority} and safety of the car is of ${safetyPriority}`;
        if (brandPreference === '') {
            prompt = `give recommendation for a car available in india whose budget is under ${budget} , fuel type is ${fuelType}, the car should be a ${carType}, mileage of the car is of ${mileagePriority} and safety of the car is of ${safetyPriority}`;
        }
        setSubmitted(true);
        // Here, you can make an API call or perform any other desired actions
        console.log(prompt);
        try {
            // const response = await fetch('https://api.gemini.google.com/v1/generate-text', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     // Add your API key or authorization token here if required
            //     'Authorization': 'AIzaSyA39NIHMvMTc93hZ4sWRYH8z4YkQUzg0bA'
            //   },
            //   body: JSON.stringify({
            //     prompt: prompt,
            //     // Other parameters as needed, such as temperature, max_tokens, etc.
            //     // Refer to Gemini API documentation for specific options
            //   })
            // });
        
            // const data = await response.json();
            // console.log(data); // Process the response from the API
            console.log(process.env.NEXT_PUBLIC_API_KEY)
        
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
            console.log(genAI)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            setCarList('Loading...');
            const result = await model.generateContent(prompt);
            console.log(result.response.candidates[0].content.parts[0].text)
            const responseText = result.response.candidates[0].content.parts[0].text;
            setCarList(formatResponse(responseText));
            //getting this as markdown, need to parse it to display it properly
            //parse markdown to html         
            console.log(typeof result)

          } catch (error) {
            setCarList('Error fetching data: ',error);
            console.log('Error fetching data:', error);
            // Handle errors appropriately, such as displaying an error message to the user
          }
    }


    return (


        <div className="flex flex-col items-center justify-center h-max  bg-gradient-form">
            <form className="shadow-2xl shadow-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="budget">
                        Budget: ₹ {budget}
                    </label>
                    <div className="flex items-center">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="range"
                            min="500000"
                            max="10000000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                        <input
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline ml-4"
                            type='text'
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="fuelType">
                        Fuel Type:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="electric">Electric</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="brandPreference">
                        Brand Preference:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={brandPreference}
                        onChange={(e) => setBrandPreference(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="carType">
                        Car Type:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={carType}
                        onChange={(e) => setCarType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="sedans">Sedans</option>
                        <option value="suvs">SUVs</option>
                        <option value="hatchbacks">Hatchbacks</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="mileagePriority">
                        Mileage and Fuel Efficiency:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={mileagePriority}
                        onChange={(e) => setMileagePriority(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="high">High Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="safetyPriority">
                        Safety:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={safetyPriority}
                        onChange={(e) => setSafetyPriority(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="high">High Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>

                <div className="flex justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={fetchData}
                    >
                        Submit
                    </button>
                </div>
            </form>
            {submitted && (
                <div className='w-full max-w-4xl mx-auto p-4'>
                    <h1 className='text-2xl font-bold text-white mb-6'>Recommended Cars:</h1>
                    <div className="bg-black shadow-2xl shadow-white rounded-lg p-6">
                        {carList}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarForm;