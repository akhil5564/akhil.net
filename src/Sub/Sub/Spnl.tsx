import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResultsComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);  // Data from API
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const selectedDate = params.get('date') || '';  // Capture selected date from URL
  const selectedTimes = params.get('times') || '';  // Capture selected times (e.g., "1,3,6,8")

  const userToken = localStorage.getItem('userToken');  // Assuming user token is stored in local storage

  // Fetch data with selected date, time, and logged-in user information
  const fetchData = async () => {
    try {
      // Ensure the user token and necessary parameters are included in the request
      const response = await axios.get('https://manu-netflix.onrender.com/getData', {
        params: {
          date: selectedDate,  // Include selected date
          times: selectedTimes,  // Include selected times
          userToken: userToken,  // Include logged-in user token
        },
      });

      setData(response.data);  // Set the fetched data
    } catch (err) {
      setError('Failed to fetch table data');
    } finally {
      setLoading(false);  // Stop loading once data is fetched
    }
  };

  // Fetch data on component mount and when parameters change
  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedTimes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="results-container">
      <h1>Results</h1>
      <table className="results-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Num</th>
            <th>Count</th>
            <th>Letter</th>
            <th>Prize</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, index) => (
            <tr key={index}>
              <td>{result.ticket}</td>
              <td>{result.num}</td>
              <td>{result.count}</td>
              <td>{result.letter}</td>
              <td>{result.prize}</td>
              <td>{result.commission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsComponent;
