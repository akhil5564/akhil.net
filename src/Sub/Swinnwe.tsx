import { useState, useEffect } from 'react';
import axios from 'axios';
import './swin.css';
import { useLocation } from 'react-router-dom';

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
  amount: number;
}

interface Data {
  createdAt: string | number | Date;
  customId: number;
  selectedTime: any;
  tableRows: TableRow[];
  username: string;
}

const areDigitsEqual = (a: string, b: string) => {
  return a.split('').sort().join('') === b.split('').sort().join('');
};

const ResultsComponent: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const location = useLocation();
  const { fromDate, toDate, selectedTime } = location.state || {};
  console.log("dataaaaaaaaaaaa",location.state );
  
  const getLoggedInUser = (): string => {
    const user = localStorage.getItem('loggedInUser');
    return user ? user : 'defaultUser';
  };

  const loggedInUser = getLoggedInUser();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getresult');
        setFilteredResults(response.data);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://manu-netflix.onrender.com/getData?username=${loggedInUser}`);           
        const filteredData = response.data.filter((item: Data) => {
          const createdAt = new Date(item?.createdAt);    
          // Normalize dates to YYYY-MM-DD only
          const createdDateOnly = createdAt.toISOString().split("T")[0];
          const from = fromDate ? new Date(fromDate).toISOString().split("T")[0] : null;
          const to = toDate ? new Date(toDate).toISOString().split("T")[0] : null;    
          const matchesDate = (() => {
            if (from && to) {
              return createdDateOnly >= from && createdDateOnly <= to;
            }
            if (from) {
              return createdDateOnly >= from;
            }
            if (to) {
              return createdDateOnly <= to;
            }
            return true; // no date filter applied
          })();

          const matchesTime =
            !selectedTime ||
            selectedTime.toLowerCase() === "all" ||
            item.selectedTime?.toLowerCase() === selectedTime.toLowerCase();
    
          return (
            item.username === loggedInUser &&
            matchesDate &&
            matchesTime
          );
        });
        console.log("responseresponseresponse1",filteredData);
        setData(filteredData);
      } catch (err) {
        setError('Failed to fetch table data');
      }
    };

    fetchResults();
    fetchData();

  }, [loggedInUser]);

  const getABMatches = (result: string) =>
    data.flatMap(item => item.tableRows.filter(row => row.letter === 'AB' && row.num === result.slice(0, 2)));

  const getBCMatches = (result: string) =>
    data.flatMap(item => item.tableRows.filter(row => row.letter === 'BC' && row.num === result.slice(1, 3)));

  const getACMatches = (result: string) =>
    data.flatMap(item => item.tableRows.filter(row => row.letter === 'AC' && row.num === result[0] + result[2]));

  const getThreeDigitMatches = (result: string) =>
    data.flatMap(item => item.tableRows.filter(row => row.num === result));

  const getABCMatches = (result: string) =>
    data.flatMap(item =>
      item.tableRows.filter(row =>
        (row.letter === 'A' && row.num === result[0]) ||
        (row.letter === 'B' && row.num === result[1]) ||
        (row.letter === 'C' && row.num === result[2])
      )
    );

  const getPrize = (ticket: string, count: number, letter: string, num: string, result: string) => {
    if (letter === 'BOX') {
      const isExactMatch = num === result; // Exact match (same order)
      const isValidBoxNumber = /^[0-9]{3}$/.test(num); // Ensure it's a valid 3-digit number
      const isPermutation = areDigitsEqual(num, result); // Check if digits are equal (any order)

      if (isValidBoxNumber && isExactMatch) {
        return 3000 * count; // Prize 3000 per count for exact match
      } else if (isValidBoxNumber && isPermutation) {
        return 800 * count; // Prize 800 per count for a valid permutation
      }
    }

    if (letter === 'SUPER') return 5000 * count;

    switch (ticket) {
      case '1': return 5000 * count;
      case '2': return 500 * count;
      case '3': return 250 * count;
      case '4': return 100 * count;
      case '5': return 50 * count;
      default: return 20 * count;
    }
  };

  const getCommission = (ticket: string, count: number, letter: string, num: string, result: string) => {
    if (letter === 'BOX') {
      const isExactMatch = num === result; // Exact match (same order)
      const isPermutation = areDigitsEqual(num, result); // Check if digits are equal (any order)

      if (isExactMatch) {
        return 300 * count; // Commission 300 per count for exact match
      } else if (isPermutation) {
        return 30 * count; // Commission 30 per count for permutation match
      }
    }

    switch (ticket) {
      case '1': return 400 * count;
      case '2': return 50 * count;
      case '3': return 20 * count;
      case '4': return 20 * count;
      case '5': return 20 * count;
      default: return 10 * count;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const winningResults = filteredResults.filter(
    result =>
      getThreeDigitMatches(result.result).length > 0 ||
      getABCMatches(result.result).length > 0 ||
      data.some(item =>
        item.tableRows.some(row => row.letter === 'BOX' && areDigitsEqual(row.num, result.result))
      )
  );

  const totalPrize = winningResults.reduce((total, result) => {
    const threeDigitMatches = getThreeDigitMatches(result.result);
    const abcMatches = getABCMatches(result.result);
    const boxMatches = data.flatMap(item =>
      item.tableRows.filter(row => row.letter === 'BOX' && areDigitsEqual(row.num, result.result))
    );

    let prize = 0;

    threeDigitMatches.forEach(match => {
      const count = parseInt(match.count, 10);
      prize += getPrize(result.ticket, count, match.letter, match.num, result.result); // Pass result for comparison
    });

    if (result.ticket === '1') {
      abcMatches.forEach(match => {
        const count = parseInt(match.count, 10);
        prize += count * (['AB', 'BC', 'AC'].includes(match.letter) ? 700 : 100);
      });
    }

    boxMatches.forEach(match => {
      const count = parseInt(match.count, 10);
      prize += getPrize(result.ticket, count, 'BOX', match.num, result.result); // Pass result for comparison
    });

    return total + prize;
  }, 0);

  const totalCommission = winningResults.reduce((total, result) => {
    const threeDigitMatches = getThreeDigitMatches(result.result);
    const abcMatches = getABCMatches(result.result);

    let commission = 0;

    threeDigitMatches.forEach(match => {
      const count = parseInt(match.count, 10);
      commission += getCommission(result.ticket, count, match.letter, match.num, result.result); // Pass result for comparison
    });

    if (result.ticket === '1') {
      abcMatches.forEach(match => {
        const count = parseInt(match.count, 10);
        commission += count * (['AB', 'BC', 'AC'].includes(match.letter) ? 30 : 0);
      });
    }

    return total + commission;
  }, 0);

  const totalAmount = totalPrize + totalCommission;

  const totalInputAmount = data.reduce((sum, item) => {
    return sum + item.tableRows.reduce((acc, row) => acc + (row.amount || 0), 0);
  }, 0);

  const profitOrLoss = totalInputAmount - totalAmount;

  return (
    <div className="results-container">

      <table className="results-table">
      {winningResults.length > 0 && (
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
)}

        <tbody>
          {winningResults.flatMap((result, index) => {
            const abcMatches = getABCMatches(result.result);
            const abMatches = getABMatches(result.result);
            const bcMatches = getBCMatches(result.result);
            const acMatches = getACMatches(result.result);
            const threeDigitMatches = getThreeDigitMatches(result.result);
            const boxMatches = data.flatMap(item =>
              item.tableRows.filter(row =>
                row.letter === 'BOX' && areDigitsEqual(row.num, result.result)
              )
            );

            const formattedRows: any[] = [];

            threeDigitMatches.forEach(match => {
              const count = parseInt(match.count, 10);
              formattedRows.push({
                ticket: result.ticket,
                num: result.result,
                count: match.count,
                letter: match.letter,
                prize: getPrize(result.ticket, count, match.letter, match.num, result.result),
                commission: getCommission(result.ticket, count, match.letter, match.num, result.result),
              });
            });

            if (result.ticket === '1') {
              [...abcMatches, ...abMatches, ...bcMatches, ...acMatches].forEach(match => {
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

            boxMatches.forEach(match => {
              const count = parseInt(match.count, 10);
              formattedRows.push({
                ticket: result.ticket,
                num: ` ${match.num}`,
                letter: 'BOX',
                count: match.count,
                prize: getPrize(result.ticket, count, 'BOX', match.num, result.result),
                commission: getCommission(result.ticket, count, 'BOX', match.num, result.result),
              });
            });

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

      <div className="footer">
        <div className="footer-left">
          <div> Sale: ₹{totalInputAmount.toFixed(2)}</div>
          <div>Prize: ₹{totalPrize.toFixed(2)}</div>
          <div>Commission: ₹{totalCommission.toFixed(2)}</div>
        </div>
        <div className="footer-right">
          <div>Winning: ₹{totalAmount.toFixed(2)}</div>
          <div style={{ color: profitOrLoss >= 0 ? 'green' : 'red' }}>
            Profit / Loss: ₹{profitOrLoss.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
