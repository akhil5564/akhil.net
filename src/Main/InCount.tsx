import { FC, useState, useEffect, ReactNode } from 'react';
import './reporter.css';
import { IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import React from 'react';

interface TableData {
  type: ReactNode;
  tableRows: {
    id: any;
    _id: number;
    letter: string;
    num: string;
    count: string;
    amount: string;
    time: string; // Ensure time exists in your data
  }[];
  _id: string;
  customId: string;
  createdAt: string;
  selectedTime: string; // Add the selectedTime property
}

const Reporter: FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]); // State for table data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(''); // Error state
  const [filteredData, setFilteredData] = useState<TableData[]>([]); // State for filtered data

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://manu-netflix.onrender.com/getData');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setTableData(response.data); // Correct state setter
        } else {
          setError('The received data format is invalid. Expected an array.');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch only once when component mounts

  // Filter the table rows based on count > 5 (without filtering by time)
  useEffect(() => {
    const filteredTableData = tableData.map((data) => ({
      ...data,
      tableRows: data.tableRows.filter((row) => parseInt(row.count, 10) > 5), // Filter rows with count > 5
    }));

    setFilteredData(filteredTableData); // Update state with the filtered rows
  }, [tableData]); // Re-run when tableData changes

  const [selectedRow, setSelectedRow] = useState<string | null>(null); // State for selected row
  const [longPress, setLongPress] = useState<boolean>(false); // State for detecting long press

  // Delete a specific container (table) and remove from state

  // Handle row click
  const handleClick = (_id: string): void => {
    setSelectedRow((prev) => (prev === _id ? null : _id)); // Toggle row selection
  };

  // Handle long press (right click or long tap)
  const handleLongPress = (_id: string) => {
    setLongPress(true);
    setSelectedRow(_id); // Highlight the row and show the delete button
  };

  // Delete a row
  const deleteRow = async (_id: string) => {
    try {
      // Send DELETE request for the specific row
      await axios.delete(`https://manu-netflix.onrender.com/deleteRow/${_id}`);
      
      // Remove the row from state after successful deletion
      setTableData((prevData) => {
        return prevData.map((data) => ({
          ...data,
          tableRows: data.tableRows.filter((row) => row.id !==_id)
        }));
      });
      alert("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error);
      alert("Failed to delete row. Please try again.");
    }
    setLongPress(false); // Hide the delete button after action
  };

  if (loading) return <p>Loading...</p>; // Show loading message

  if (error) return <p>{error}</p>; // Show error message if any

  return (
    <>
      {/* Container to hold both header and data */}
      <div className="table-containers">
        {filteredData.length === 0 ? (
          <p>No data available with count  5</p>
        ) : (
          filteredData.map((data) => (
            <div className="table-wrapper" key={data._id}>
              <table className="reporter-table">
                <thead>
                  {/* Display the Bill No and createdAt with the Delete button */}
                  <tr>
                   
                  </tr>
                </thead>
                <tbody>
                  {data.tableRows.map((row, index) => (
                    <tr
                      key={row._id || index}
                      onClick={() => handleClick(row.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleLongPress(row.id);
                      }} // Detect long press using right-click or long tap on mobile
                      style={{ backgroundColor: selectedRow === row.id ? '#f0f0f0' : 'white' }} // Highlight selected row
                    >
                      <td>{row.num}</td>
                      <td>{row.letter}</td>
                      <td>{row.count}</td>
                      <td>{row.amount}</td>
                      {selectedRow === row.id && longPress && (
                        <td>
                          <button 
                            className="delete-button" 
                            onClick={() => deleteRow(row.id)}
                          >
                            <IconTrash stroke={2} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Reporter;
