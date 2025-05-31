import React, { useState } from 'react';
import styles from './query_db.module.css';  // <-- import CSS module

const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('VITE_BACKEND_URL is not defined in the environment file');
}

const SQLQueryForm = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL}/api/queryRoutes/query`, {
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
    <div className={styles.container}>
      <h1 className={styles.title}>SQL Query Executor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter your SQL query here"
          className={styles.textarea}
          rows="5"
        />
        <button
          type="submit"
          className={styles.button}
        >
          Execute Query
        </button>
      </form>
      <div className={styles.resultArea}>
        {error && <p className={styles.error}>Error: {error}</p>}
        {queryResult && (
          <pre className={styles.resultBox}>{JSON.stringify(queryResult, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default SQLQueryForm;
