import { FC, useState, useEffect } from 'react';
import '../Main/reporter.css';  // CSS for styling
import { IconTrash } from '@tabler/icons-react';  // Trash icon
import axios from 'axios';  // Axios for making API calls
import { useLocation } from 'react-router-dom';  // To access query parameters in the URL

// Define the structure of the data
interface TableData {
  username: string;
  type: string;
  tableRows: {
    id: string;
    _id: number;
    letter: string;
    num: string;
    count: string;
    amount: string;
    time: string;  // Store time in 12-hour format (e.g., '1PM')
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
  const [errorMessage, setErrorMessage] = useState<string>(''); // To store the error message when trying to delete after cutoff time
  const [user, setUser] = useState<string>(''); // Store the logged-in user (e.g., 'kjp')

  // Access URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTime = queryParams.get('time'); // e.g., '1PM'
  const fromDate = queryParams.get('fromDate');
  const toDate = queryParams.get('toDate');

  // Define cutoff times for each time slot (in 24-hour format)
  const cutoffTimes: { [key: string]: string } = {
    '1pm': '12:56',
    '3pm': '15:00',
    '6pm': '17:56',
    '8pm': '19:56',
  };

  // Function to get the current time in HH:MM format (24-hour)
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Ensure 2 digits
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits
    return `${hours}:${minutes}`;
  };

  // Function to check if the delete button should be disabled for a specific row based on its time
  const shouldDisableDelete = (timeSlot: string): boolean => {
    const currentTime = getCurrentTime();
    const cutoffTime = cutoffTimes[timeSlot.toLowerCase()]; // Get the cutoff time for the selected time slot
    return currentTime > cutoffTime; // If the current time is greater than the cutoff, disable delete
  };

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on the selected time, fromDate, and toDate
// Filter data based on the selected time, fromDate, toDate, and user
useEffect(() => {
  const loggedInUser = localStorage.getItem('loggedInUser'); // Get logged-in user from localStorage
  if (!loggedInUser) return; // If no user is logged in, do nothing

  setUser(loggedInUser); // Store logged-in user in state
  

  const filtered = tableData.filter((data) => {
    // Filter by selected time (from query params) for the entire report
    const timeMatches = selectedTime === 'All' || data.selectedTime === selectedTime;

    // Filter by date range (if present)
    const date = new Date(data.createdAt).toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const withinDateRange = (!fromDate || date >= fromDate) && (!toDate || date <= toDate);

    // Filter by logged-in user dynamically (username in DB == logged-in user)
    const userMatches = data.username === loggedInUser;

    // Combine all the filters: time, date range, and user
    return timeMatches && withinDateRange && userMatches;
  });

  setFilteredData(filtered);
}, [selectedTime, fromDate, toDate, tableData]);

  // Loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  const handleDeleteContainer = async (containerId: string) => {
    if (shouldDisableDelete(selectedTime || '')) {
      setErrorMessage(`Cannot delete data for ${selectedTime}. The cutoff time has passed.`);
      return; // Prevent deletion if time has passed
    }
  
    try {
      // Send a DELETE request to the backend to remove the container data
      const response = await axios.delete(`https://manu-netflix.onrender.com/deleteContainer/${containerId}`);
  
      if (response.status === 200) {
        // If the delete is successful, update the local state to remove the container from UI
        const updatedData = filteredData.filter((data) => data._id !== containerId);
        setFilteredData(updatedData);
      } else {
        setErrorMessage('Failed to delete the container data.');
      }
    } catch (error) {
      console.error('Error deleting container:', error);
      setErrorMessage('Error occurred while deleting the container.');
    }
  };
  
  // Handle Delete Row Action (delete an individual row)
  const handleDeleteRow = (rowId: number) => {
    if (shouldDisableDelete(selectedTime || '')) {
      setErrorMessage(`Cannot delete data for ${selectedTime}. The cutoff time has passed.`);
      return; // Prevent deletion if time has passed
    }

    const updatedData = filteredData.map((data) => ({
      ...data,
      tableRows: data.tableRows.filter((row) => row._id !== rowId),
    }));
    setFilteredData(updatedData);
  };

  // Function to calculate the total based on count and num length
  const calculateTotal = (count: string, num: string): string => {
    const countNum = parseInt(count, 10);
    const numLength = num.length;

    let total = 0;

    if (numLength === 1) {
      total = countNum * 11;  // 1-digit num: count * 11
    } else if (numLength > 1) {
      total = countNum * 8.5;  // More than 1-digit num: count * 8.5
    }

    return total.toFixed(2);  // Return total with 2 decimal places
  };

  // Calculate the total count, total amount, and total of totals for all rows in all containers
  const calculateFooterTotals = () => {
    let totalCount = 0;
    let totalAmount = 0;
    let totalOfTotals = 0;

    // Loop through all filtered data to calculate the total values
    filteredData.forEach((data) => {
      data.tableRows.forEach((row) => {
        totalCount += parseInt(row.count, 10); // Sum of count
        totalAmount += parseFloat(row.amount); // Sum of amount
        if (user === 'kjp') {
          totalOfTotals += parseFloat(calculateTotal(row.count, row.num)); // Sum of totals for kjp only
        }
      });
    });

    return {
      totalCount,
      totalAmount,
      totalOfTotals,
    };
  };

  // Get totals for the common footer
  const { totalCount, totalAmount, totalOfTotals } = calculateFooterTotals();

  return (
    <div className="table-containers">
      {filteredData.length === 0 ? (
        <p>No data available for the selected time and date range</p>
      ) : (
        <>
          {/* Display error message if delete is not allowed */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Data Tables */}
          {filteredData.map((data) => (
            <div className="table-wrapper" key={data._id}>
              <table className="reporter-table">
                <thead>
                  <tr>
                    <th colSpan={8} className="bill-infos">
                      Bill No: {data.customId}
                      {new Date(data.createdAt).toLocaleString()}

                      <button
                        className="delete-container-btn"
                        onClick={() => handleDeleteContainer(data._id)} // Delete entire container
                      >
                        <IconTrash
                          stroke={2}
                          style={shouldDisableDelete(data.selectedTime) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                        />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
  {data.tableRows.map((row, index) => (
    <tr key={row._id}>
      <td>{index + 1}</td> {/* Sequential ID */}
      <td>{row.num}</td>
      <td>{row.letter}</td>
      <td>{row.count}</td>
      <td>{row.amount}</td>
      <td>{user === 'kjp' ? calculateTotal(row.count, row.num) : ''}</td> {/* Show total only for kjp */}
      <td>
        <IconTrash
          className="icon-trash"
          onClick={() => handleDeleteRow(row._id)} // Handle delete for row
          stroke={2}
          style={shouldDisableDelete(selectedTime || '') ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
        />
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          ))}

          {/* Common Footer at the bottom */}
          <div className="footer">
            <div className="footer-content">
              <strong> Count: {totalCount}</strong>
              <strong>Amount: {totalAmount.toFixed(2)}</strong>
              {user === 'kjp' && <strong>Total Commission: {totalOfTotals.toFixed(2)}</strong>} {/* Show commission only for kjp */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reporter;
