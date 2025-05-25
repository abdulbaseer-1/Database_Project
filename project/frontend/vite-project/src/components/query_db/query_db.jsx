import React, { useState } from 'react';

const SQLQueryForm = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute query');
      }

      const data = await response.json();
      setQueryResult(data.result);
      setError(null);
    } catch (err) {
      setQueryResult(null);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">SQL Query Executor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter your SQL query here"
          className="w-full p-2 border rounded"
          rows="5"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Execute Query
        </button>
      </form>
      <div className="mt-4">
        {error && <p className="text-red-500">Error: {error}</p>}
        {queryResult && (
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(queryResult, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default SQLQueryForm;
