import { FC, useState, useEffect } from 'react';
import './reporter.css';
import { IconTrash, IconCopy } from '@tabler/icons-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface TableData {
  type: string;
  tableRows: {
    id: string;
    _id: number;
    letter: string;
    num: string;
    count: string;
    amount: string;
    time: string;
  }[];
  _id: string;
  customId: string;
  createdAt: string;
  selectedTime: string;
}

const Reporter: FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [copySuccess, setCopySuccess] = useState<string>(''); // Success message for copy action

  // Access URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTime = queryParams.get('time');
  const fromDate = queryParams.get('fromDate');
  const toDate = queryParams.get('toDate');

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getData');
        if (Array.isArray(response.data)) {
          setTableData(response.data);
        } else {
          setError('The received data format is invalid. Expected an array.');
        }
      } catch (err: any) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on the selected time, fromDate, and toDate
  useEffect(() => {
    const filtered = tableData.filter((data) => {
      const timeMatches = selectedTime === 'All' || data.selectedTime === selectedTime;
      const date = new Date(data.createdAt).toISOString().split('T')[0];
      const withinDateRange = (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
      return timeMatches && withinDateRange;
    });

    setFilteredData(filtered);
  }, [selectedTime, fromDate, toDate, tableData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Handle Delete Entire Bill
  const handleDeleteContainer = async (containerId: string) => {
    try {
      const response = await axios.delete(`https://manu-netflix.onrender.com/deleteData/${containerId}`);
      if (response.status === 200) {
        setFilteredData(filteredData.filter((data) => data._id !== containerId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Delete Row
  const handleDeleteRow = (rowId: number) => {
    const updatedData = filteredData.map((data) => ({
      ...data,
      tableRows: data.tableRows.filter((row) => row._id !== rowId),
    }));
    setFilteredData(updatedData);
  };

  // Handle Copy All Data
  const handleCopyAllData = () => {
    const formattedData = filteredData
      .flatMap((data) =>
        data.tableRows.map((row) => {
          const numFormatted = row.num.length <= 2 ? `${row.letter}=${row.num}=${row.count}` : `${row.num}=${row.count}`;
          return numFormatted;
        })
      )
      .join('\n');

    navigator.clipboard
      .writeText(formattedData)
      .then(() => setCopySuccess('Copied all data successfully!'))
      .catch(() => setCopySuccess('Failed to copy data.'));

    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className="table-containers">
      {/* Copy All Button */}
      {filteredData.length > 0 && (
        <button className="copy-all-btn" onClick={handleCopyAllData}>
          <IconCopy stroke={2} /> Copy All
        </button>
      )}
      {copySuccess && <p className="copy-success">{copySuccess}</p>}

      {filteredData.length === 0 ? (
        <p>No data available for the selected time and date range</p>
      ) : (
        <>
          {filteredData.map((data) => (
            <div className="table-wrapper" key={data._id}>
              <table className="reporter-table">
                <thead>
                  <tr>
                    <th colSpan={6} className="bill-infos">
                      Bill No: {data.customId}
                      {new Date(data.createdAt).toLocaleString()}
                      <button
                        className="delete-container-btn"
                        onClick={() => handleDeleteContainer(data._id)}
                        aria-label="Delete Container"
                      >
                        <IconTrash stroke={2} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.tableRows.map((row) => (
                    <tr key={row._id}>
                      <td>{row.num}</td>
                      <td>{row.letter}</td>
                      <td>{row.count}</td>
                      <td>{row.amount}</td>
                      <td>{row.time}</td>
                      <td>
                        <IconTrash
                          className="icon-trash"
                          onClick={() => handleDeleteRow(row._id)}
                          stroke={2}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Reporter;
