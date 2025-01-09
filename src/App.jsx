import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

const InputPage = ({ addResult }) => {
  const [formData, setFormData] = useState({
    rollNo: '',
    subject1: '',
    subject2: '',
    subject3: '',
    subject4: '',
    subject5: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const obtained = Object.keys(formData)
      .filter(key => key.startsWith('subject'))
      .reduce((sum, key) => sum + parseInt(formData[key] || 0), 0);

    if (obtained > 500) {
      alert('Total marks cannot exceed 500');
      return;
    }

    const percentage = (obtained / 500) * 100;
    addResult({ 
      rollNo: formData.rollNo,
      obtained: obtained.toString(),
      maximum: '500',
      percentage,
      subjects: {
        subject1: formData.subject1,
        subject2: formData.subject2,
        subject3: formData.subject3,
        subject4: formData.subject4,
        subject5: formData.subject5
      }
    });
    setFormData({
      rollNo: '',
      subject1: '',
      subject2: '',
      subject3: '',
      subject4: '',
      subject5: '',
    });
    navigate('/results');
  };

  const totalMarks = Object.keys(formData)
    .filter(key => key.startsWith('subject'))
    .reduce((sum, key) => sum + parseInt(formData[key] || 0), 0);

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
        {['English', 'Math', 'Science', 'History', 'Geography'].map((subject, index) => (
          <div key={subject}>
            <label className="block mb-1">{subject} Marks (Max 100):</label>
            <input
              type="number"
              max="100"
              value={formData[`subject${index + 1}`]}
              onChange={(e) => setFormData({ ...formData, [`subject${index + 1}`]: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <div className="p-4 bg-gray-100 rounded">
          <p className="font-bold">Total Marks: {totalMarks}/500</p>
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