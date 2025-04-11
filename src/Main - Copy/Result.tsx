import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './result.css';

interface Result {
  ticket: string;
  result: string;
  date: string;
  time: string;
}

interface Data {
  customId: number;
  selectedTime: string;
  tableRows: { letter: string; num: string; count: string; amount: string }[];
}

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const selectedDate = queryParams.get('date') || '';
  const selectedTime = queryParams.get('time') || '';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getresult');
        const sortedResults = response.data.sort((a: Result, b: Result) =>
          parseInt(a.ticket, 10) - parseInt(b.ticket, 10)
        );
        setResults(sortedResults);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getData');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch table data');
      }
    };

    fetchResults();
    fetchData();
  }, []);

  const filteredResults = results.filter(
    (result) => result.date === selectedDate && result.time === selectedTime
  );

  const getMatchedData = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter(
        (row) => row.num === result || (row.letter === 'A' && row.num === '5')
      )
    );
  };

  const winningResults = filteredResults.filter((result) => getMatchedData(result.result).length > 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="results-container">
      <h3>Results for {selectedDate} at {selectedTime}</h3>

      {winningResults.length > 0 && (
        <div className="winning-results">
          <h3>Winning Results</h3>
          <table className="results-table">
            <tbody>
              {winningResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.ticket} : {result.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Optionally, you can display Group 1 and Group 2 if needed */}
    </div>
  );
};

export default ResultsPage;
