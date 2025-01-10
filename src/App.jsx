// Previous imports remain the same, but remove the Lucide import
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
const InputPage = ({ addResult }) => {
  const [rollNo, setRollNo] = useState('');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Subject 1', obtained: '', maximum: '' }
  ]);
  const navigate = useNavigate();

  // Define the missing functions
  const addSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects([...subjects, { 
      id: newId, 
      name: `Subject ${newId}`, 
      obtained: '', 
      maximum: '' 
    }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    } else {
      alert('You must have at least one subject');
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    for (let subject of subjects) {
      if (parseInt(subject.obtained) > parseInt(subject.maximum)) {
        alert(`${subject.name}: Obtained marks cannot exceed maximum marks`);
        return;
      }
      if (!subject.name.trim()) {
        alert('All subjects must have names');
        return;
      }
    }

    const totalObtained = subjects.reduce((sum, subj) => sum + parseInt(subj.obtained || 0), 0);
    const totalMaximum = subjects.reduce((sum, subj) => sum + parseInt(subj.maximum || 0), 0);
    const percentage = (totalObtained / totalMaximum) * 100;

    addResult({
      rollNo,
      obtained: totalObtained.toString(),
      maximum: totalMaximum.toString(),
      percentage,
      subjects: subjects.reduce((acc, subj) => {
        acc[subj.id] = subj;
        return acc;
      }, {})
    });

    // Reset form
    setRollNo('');
    setSubjects([{ id: 1, name: 'Subject 1', obtained: '', maximum: '' }]);
    navigate('/results');
  };

  const totalObtained = subjects.reduce((sum, subj) => sum + parseInt(subj.obtained || 0), 0);
  const totalMaximum = subjects.reduce((sum, subj) => sum + parseInt(subj.maximum || 0), 0);


  // Rest of the code remains the same until the return statement

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Progressive Convent School</h1>
        <button 
          onClick={addSubject}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Subject
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="block mb-1">Roll No:</label>
          <input
            type="number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-4 ">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-4 border rounded bg-white  box-sub">
              <div className="flex justify-between items-start mb-4">
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                  className="font-bold text-lg border-b border-dashed border-gray-300 focus:border-gray-500 focus:outline-none"
                  placeholder="Subject Name"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSubject(subject.id)}
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Obtained Marks:</label>
                  <input
                    type="number"
                    value={subject.obtained}
                    onChange={(e) => updateSubject(subject.id, 'obtained', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Maximum Marks:</label>
                  <input
                    type="number"
                    value={subject.maximum}
                    onChange={(e) => updateSubject(subject.id, 'maximum', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p className="font-bold">Total Marks: {totalObtained}/{totalMaximum}</p>
          {totalMaximum > 0 && (
            <p className="text-gray-600">
              Current Percentage: {((totalObtained / totalMaximum) * 100).toFixed(2)}%
            </p>
          )}
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
  const [expandedRow, setExpandedRow] = useState(null);
  
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
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...results]
              .sort((a, b) => a.rollNo - b.rollNo)
              .map((result) => (
                <React.Fragment key={result.rollNo}>
                  <tr>
                    <td className="p-2 border">{result.rollNo}</td>
                    <td className="p-2 border">{result.obtained}</td>
                    <td className="p-2 border">{result.maximum}</td>
                    <td className="p-2 border">{result.percentage.toFixed(2)}%</td>
                    <td className="p-2 border">{getRank(result.rollNo)}</td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedRow(expandedRow === result.rollNo ? null : result.rollNo)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          {expandedRow === result.rollNo ? 'Hide' : 'Details'}
                        </button>
                        <button
                          onClick={() => deleteResult(result.rollNo)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === result.rollNo && (
                    <tr>
                      <td colSpan="6" className="p-4 border bg-gray-50">
                        <div className="grid grid-cols-3 gap-4">
                          {Object.values(result.subjects).map((subject) => (
                            <div key={subject.id} className="p-2 border rounded bg-white">
                              <h4 className="font-bold">{subject.name}</h4>
                              <p>Obtained: {subject.obtained}</p>
                              <p>Maximum: {subject.maximum}</p>
                              <p>Percentage: {((subject.obtained / subject.maximum) * 100).toFixed(2)}%</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// App component remains exactly the same
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
        <div className="flex space-x-4 navlink-div">
          <Link to="/" className="text-white hover:text-gray-300 navlink-a">Input</Link>
          <Link to="/results" className="text-white hover:text-gray-300 navlink-a">Results</Link>
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