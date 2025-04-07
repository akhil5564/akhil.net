import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Main/result.css';

interface Result {
  ticket: string;
  result: string;
  date: string;
  time: string;
}

interface TableRow {
  letter: string;
  num: string;
  count: string;
  amount: string;
}

interface Data {
  customId: number;
  selectedTime: string;
  tableRows: TableRow[];
  username: string;
}

const ResultsComponent: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFromDate, setSelectedFromDate] = useState<string>(''); // From Date
  const [selectedToDate, setSelectedToDate] = useState<string>(''); // To Date
  const [selectedTime, setSelectedTime] = useState<string>('');  // Default is empty
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);

  const getLoggedInUser = (): string => {
    const user = localStorage.getItem('loggedInUser'); // Assuming 'loggedInUser' is the key in localStorage
    return user ? user : 'defaultUser';  // Return 'defaultUser' if no logged-in user is found
  };

  const loggedInUser = getLoggedInUser(); // Get logged-in user from localStorage

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getresult');
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://manu-netflix.onrender.com/getData?username=${loggedInUser}`);
        // Filter data by the logged-in user's username
        const filteredData = response.data.filter((item: Data) => item.username === loggedInUser);
        console.log(filteredData);

        setData(filteredData);
      } catch (err) {
        setError('Failed to fetch table data');
      }
    };

    fetchResults();
    fetchData();
  }, [loggedInUser]);

  const handleSubmit = () => {
    let filtered = results;

    // If "from" and "to" dates are selected, filter by both
    if (selectedFromDate && selectedToDate) {
      filtered = results.filter(
        (result) =>
          new Date(result.date) >= new Date(selectedFromDate) &&
          new Date(result.date) <= new Date(selectedToDate)
      );
    }
    // If only "from" date is selected
    else if (selectedFromDate) {
      filtered = results.filter((result) => new Date(result.date) >= new Date(selectedFromDate));
    }
    // If only "to" date is selected
    else if (selectedToDate) {
      filtered = results.filter((result) => new Date(result.date) <= new Date(selectedToDate));
    }

    // If time is selected, filter by time as well
    if (selectedTime && selectedTime !== 'all') {
      filtered = filtered.filter((result) => result.time === selectedTime);
    }

    setFilteredResults(filtered);
  };

  const getABMatches = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter((row) => row.letter === 'AB' && row.num === result.slice(0, 2))
    );
  };

  const getBCMatches = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter((row) => row.letter === 'BC' && row.num === result.slice(1, 3))
    );
  };

  const getACMatches = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter((row) => row.letter === 'AC' && row.num === result[0] + result[2])
    );
  };

  const getThreeDigitMatches = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter((row) => row.num === result)
    );
  };

  const getABCMatches = (result: string) => {
    return data.flatMap((item) =>
      item.tableRows.filter((row) =>
        (row.letter === 'A' && row.num === result[0]) ||
        (row.letter === 'B' && row.num === result[1]) ||
        (row.letter === 'C' && row.num === result[2])
      )
    );
  };

  const getPrize = (ticket: string, count: number, letter: string) => {
    // Check if 'letter' is "BOX"
    if (letter === 'BOX') {
      return 3000 * count;  // Prize is 3000 per count for "BOX"
    }

    // Check if 'letter' is "SUPER"
    if (letter === 'SUPER') {
      return 5000 * count;  // Prize is 5000 per count for "SUPER"
    }

    // Handle other cases based on ticket numbers
    switch (ticket) {
      case '1':
        return 5000 * count;
      case '2':
        return 500 * count;
      case '3':
        return 250 * count;
      case '4':
        return 100 * count;
      case '5':
        return 50 * count;
      default:
        return 20 * count; // Default prize for other ticket numbers
    }
  };

  const getCommission = (ticket: string, count: number) => {
    switch (ticket) {
      case '1':
        return 400 * count;
      case '2':
        return 50 * count;
      case '3':
        return 20 * count;
      case '4':
        return 20 * count;
      case '5':
        return 20 * count;
      default:
        return 10 * count;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const winningResults = filteredResults.filter(
    (result) =>
      getThreeDigitMatches(result.result).length > 0 || getABCMatches(result.result).length > 0
  );

  // Calculate total prize
  const totalPrize = winningResults.reduce((total, result) => {
    const threeDigitMatches = getThreeDigitMatches(result.result);
    const abcMatches = getABCMatches(result.result);
    let prize = 0;

    threeDigitMatches.forEach((match) => {
      const count = parseInt(match.count, 10);
      prize += getPrize(result.ticket, count, match.letter);
    });

    if (result.ticket === '1') {
      [...abcMatches].forEach((match) => {
        const count = parseInt(match.count, 10);
        prize += count * (['AB', 'BC', 'AC'].includes(match.letter) ? 700 : 100);
      });
    }

    return total + prize;
  }, 0);

  // Calculate total commission
  const totalCommission = winningResults.reduce((total, result) => {
    const threeDigitMatches = getThreeDigitMatches(result.result);
    const abcMatches = getABCMatches(result.result);
    let commission = 0;

    threeDigitMatches.forEach((match) => {
      const count = parseInt(match.count, 10);
      commission += getCommission(result.ticket, count);
    });

    if (result.ticket === '1') {
      [...abcMatches].forEach((match) => {
        const count = parseInt(match.count, 10);
        commission += count * (['AB', 'BC', 'AC'].includes(match.letter) ? 30 : 0);
      });
    }

    return total + commission;
  }, 0);

  const totalAmount = totalPrize + totalCommission;

  return (
    <div className="results-container">
      <div className="date-time-picker">
        <label>
          Select From Date:
          <input
            type="date"
            value={selectedFromDate}
            onChange={(e) => setSelectedFromDate(e.target.value)}
          />
        </label>

        <label>
          Select To Date:
          <input
            type="date"
            value={selectedToDate}
            onChange={(e) => setSelectedToDate(e.target.value)}
            min={selectedFromDate} // Make sure "To" date is not before "From" date
          />
        </label>

        <label>
          Select Time:
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="">Select Time</option>
            <option value="all">All Times</option>
            <option value="1pm">1 PM</option>
            <option value="3pm">3 PM</option>
            <option value="6pm">6 PM</option>
            <option value="8pm">8 PM</option>
          </select>
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </div>

      {winningResults.length > 0 && (
        <div className="winning-results">
          <div className="footer">
            <div>Total Prize: {totalPrize.toFixed(2)}</div>
            <div>Total Commission: {totalCommission.toFixed(2)}</div>
            <div>Total Amount: {totalAmount.toFixed(2)}</div>
          </div>

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
              {winningResults.flatMap((result, index) => {
                const abcMatches = getABCMatches(result.result);
                const abMatches = getABMatches(result.result);
                const bcMatches = getBCMatches(result.result);
                const acMatches = getACMatches(result.result);
                const threeDigitMatches = getThreeDigitMatches(result.result);

                const formattedRows: any[] = [];

                threeDigitMatches.forEach((match) => {
                  const count = parseInt(match.count, 10);
                  formattedRows.push({
                    ticket: result.ticket,
                    num: result.result,
                    count: match.count,
                    letter: match.letter,
                    prize: getPrize(result.ticket, count, match.letter),
                    commission: getCommission(result.ticket, count),
                  });
                });

                if (result.ticket === '1') {
                  [...abcMatches, ...abMatches, ...bcMatches, ...acMatches].forEach((match) => {
                    const count = parseInt(match.count, 10);
                    formattedRows.push({
                      ticket: '1',
                      num: `${match.letter} ${match.num}`,
                      letter: match.letter,
                      count: match.count,
                      prize: count * (['AB', 'BC', 'AC'].includes(match.letter) ? 700 : 100),
                      commission: count * (['AB', 'BC', 'AC'].includes(match.letter) ? 30 : 0),
                    });
                  });
                }

                return formattedRows.map((row, idx) => (
                  <tr key={`${index}-${idx}`}>
                    <td>{row.ticket}</td>
                    <td>{row.num}</td>
                    <td>{row.count}</td>
                    <td>{row.letter}</td>
                    <td>{row.prize.toFixed(2)}</td>
                    <td>{row.commission.toFixed(2)}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

    
    </div>
  );
};

export default ResultsComponent;
