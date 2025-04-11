import { useState, useEffect } from 'react';

const FilterCommonData = () => {
  const [results, setResults] = useState<any[]>([]);
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [commonData, setCommonData] = useState<any[]>([]);

  // Fetch result data
  const fetchResultData = async () => {
    try {
      const response = await fetch('https://manu-netflix.onrender.com/getresult');
      const data = await response.json();
      console.log('Result Data:', data); // Log result data to ensure structure
      setResults(data);
    } catch (error) {
      console.error('Error fetching result data:', error);
    }
  };

  // Fetch sales report data
  const fetchSalesReport = async () => {
    try {
      const response = await fetch('https://manu-netflix.onrender.com/getData');
      const data = await response.json();
      console.log('Sales Report Data:', data); // Log sales data to ensure structure
      setSalesReport(data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  useEffect(() => {
    fetchResultData();
    fetchSalesReport();
  }, []);

  // Find common data between results and sales report
  useEffect(() => {
    if (results.length > 0 && salesReport.length > 0) {
      const commonTickets = results.filter(result =>
        salesReport.some(sale => sale.num === result.ticket)
      );

      console.log('Common Tickets:', commonTickets); // Log the common data for debugging
      setCommonData(commonTickets);
    }
  }, [results, salesReport]);

  // Log commonData structure to ensure you're accessing it correctly
  console.log('Common Data:', commonData);

  return (
    <div>
      <h2>Common Data</h2>
      {commonData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Letter</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {commonData.map((row, index) => {
              // Log each row to inspect the structure
              console.log('Row Data:', row);

              return (
                <tr key={index}>
                  <td>{row.ticket}</td>
                  <td>{row.letter}</td>
                  <td>{row.count}</td>
                  <td>{row.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No common data found.</p>
      )}
    </div>
  );
};

export default FilterCommonData;
