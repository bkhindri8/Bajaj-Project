import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" }
];

const App = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [response, setResponse] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleSubmit = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            const res = await axios.post("http://localhost:8000/bfhl", parsedInput, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setResponse(res.data);
        } catch (error) {
            alert("Invalid JSON or server error");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h1>BFHL Challenge</h1>
            <textarea
                rows="3"
                style={{ width: "100%" }}
                placeholder='Enter JSON e.g. {"data": ["A", "1", "B", "5"]}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
            />
            <br />
            <button onClick={handleSubmit} style={{ margin: "10px 0", padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Submit
            </button>

            {response && (
                <div>
                    <h3>Multi Filter</h3>
                    <Select
                        isMulti
                        options={options}
                        onChange={(selected) => setSelectedFilters(selected.map(opt => opt.value))}
                    />

                    <h3>Filtered Response</h3>
                    <pre>
                        {selectedFilters.length > 0
                            ? JSON.stringify(
                                  Object.fromEntries(Object.entries(response).filter(([key]) => selectedFilters.includes(key))),
                                  null,
                                  2
                              )
                            : JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default App;
