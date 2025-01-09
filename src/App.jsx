import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

const InputPage = ({ addResult }) => {
  const [formData, setFormData] = useState({ rollNo: '', obtained: '', maximum: '500' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(formData.obtained) > 500) {
      alert('Obtained marks cannot exceed 500');
      return;
    }
    const percentage = (parseInt(formData.obtained) / 500) * 100;
    addResult({ ...formData, maximum: '500', percentage });
    setFormData({ rollNo: '', obtained: '', maximum: '500' });
    navigate('/results');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enter Student Results</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Roll No:</label>
          <input
            type="number"
            value={formData.rollNo}
            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Obtained Marks (Max 500):</label>
          <input
            type="number"
            value={formData.obtained}
            max="500"
            onChange={(e) => setFormData({ ...formData, obtained: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Maximum Marks:</label>
          <input
            type="number"
            value="450"
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const ResultsPage = ({ results, deleteResult }) => {
  const sortedResults = [...results].sort((a, b) => b.percentage - a.percentage);
  
  const getRank = (rollNo) => {
    return sortedResults.findIndex(r => r.rollNo === rollNo) + 1;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Roll No</th>
              <th className="p-2 border">Obtained</th>
              <th className="p-2 border">Maximum</th>
              <th className="p-2 border">Percentage</th>
              <th className="p-2 border">Rank</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...results]
              .sort((a, b) => a.rollNo - b.rollNo)
              .map((result) => (
                <tr key={result.rollNo}>
                  <td className="p-2 border">{result.rollNo}</td>
                  <td className="p-2 border">{result.obtained}</td>
                  <td className="p-2 border">{result.maximum}</td>
                  <td className="p-2 border">{result.percentage.toFixed(2)}%</td>
                  <td className="p-2 border">{getRank(result.rollNo)}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => deleteResult(result.rollNo)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem('results');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  const addResult = (result) => {
    setResults([...results, result]);
  };

  const deleteResult = (rollNo) => {
    setResults(results.filter(r => r.rollNo !== rollNo));
  };

  return (
    <BrowserRouter>
      <nav className="bg-gray-800 p-4">
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Input</Link>
          <Link to="/results" className="text-white hover:text-gray-300">Results</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<InputPage addResult={addResult} />} />
        <Route path="/results" element={<ResultsPage results={results} deleteResult={deleteResult} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;