import { useState } from 'react';
import Result from '../Main/Result'; // Import the Result component
import './resultentry.css';

interface Ticket {
  ticket: string;
  result: string;
}

interface Row {
  tickets: Ticket[];
}

const TicketTable: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(''); // Selected date
  const [selectedTime, setSelectedTime] = useState<string>('1pm'); // Selected time slot
  const [rows, setRows] = useState<Row[]>([]); // Rows for the table

  // Generate random 3-digit result for tickets (if needed later for saving)

  // Generate rows for the top tickets (5 rows with 1 ticket each)
  const generateTopRows = (): Row[] => {
    return Array.from({ length: 5 }, (_, rowIndex) => ({
      tickets: [{ ticket: `${rowIndex + 1}`, result: '' }], // Start with empty results
    }));
  };

  // Generate rows for main tickets (10 rows with 3 tickets per row)
  const generateMainRows = (): Row[] => {
    return Array.from({ length: 10 }, (_, rowIndex) => ({
      tickets: Array.from({ length: 3 }, (_, colIndex) => {
        const ticketNumber = rowIndex * 3 + colIndex + 6; // Start from ticket 6 for the main rows
        return { ticket: ticketNumber.toString(), result: '' }; // Start with empty results
      }),
    }));
  };

  // Handle changes in the result input
  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = [...rows];
    const row = updatedRows[rowIndex];
    const ticket = row.tickets[colIndex];

    // Allow the value to be empty or match a number of 1 to 3 digits
    if (value === '' || /^[0-9]{1,3}$/.test(value)) {
      ticket.result = value; // Update the result with the valid value
    }

    setRows(updatedRows);
  };

  // Assign row classes based on ticket number
  const getRowClassName = (ticket: string): string => {
    if (parseInt(ticket) <= 5) {
      return 'top-ticket-row';
    }
    return 'main-ticket-row';
  };

  // Check if the save button should be disabled
  const isSaveButtonDisabled = () => {
    // Disable save button if there are any invalid results (non-empty, but not 1-3 digits)
    return rows.some((row) =>
      row.tickets.some((ticket) => ticket.result !== '' && !/^[0-9]{1,3}$/.test(ticket.result))
    );
  };

  // Handle saving results
  const handleSave = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    try {
      const resultsByDate = rows.reduce((acc: any, row) => {
        row.tickets.forEach((ticket) => {
          if (ticket.result && /^[0-9]{1,3}$/.test(ticket.result)) {
            if (!acc[selectedDate]) {
              acc[selectedDate] = [];
            }

            let timeSlotExists = acc[selectedDate].some((entry: { [x: string]: any }) => entry[selectedTime]);

            if (!timeSlotExists) {
              acc[selectedDate].push({ [selectedTime]: [] });
            }

            const timeSlotEntry = acc[selectedDate].find((entry: { [x: string]: any }) => entry[selectedTime]);

            timeSlotEntry[selectedTime].push({
              ticket: ticket.ticket,
              result: ticket.result,
            });
          }
        });
        return acc;
      }, {});

      console.log('Sending data:', resultsByDate);

      // Send data to server
      const response = await fetch('https://manu-netflix.onrender.com/addResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results: resultsByDate }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data saved successfully:', responseData);
        alert('Data saved successfully!');

        // Reset the rows after saving
        setRows([...generateTopRows(), ...generateMainRows()]);
      } else {
        const errorData = await response.json();
        console.error('Error from server:', errorData.message);
        alert(`Failed to save data: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {/* Top rows (first 5 rows with 1 ticket each) */}
          {rows.slice(0, 5).map((row, rowIndex) => (
            <tr key={rowIndex} className={getRowClassName(row.tickets[0].ticket)}>
              <td>{row.tickets[0].ticket}</td>
              <td>
                <input
                  className="result-input"
                  type="text"
                  value={row.tickets[0].result}
                  onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
                />
              </td>
            </tr>
          ))}

          {/* Main rows (next 10 rows with 3 tickets each) */}
          {rows.slice(5).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.tickets.map((ticket, colIndex) => (
                <td key={colIndex} className={getRowClassName(ticket.ticket)}>
                  <input
                    className="result-input"
                    type="text"
                    maxLength={3}
                    value={ticket.result}
                    onChange={(e) => handleInputChange(rowIndex + 5, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="date-time-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="1pm">1 PM</option>
          <option value="3pm">3 PM</option>
          <option value="6pm">6 PM</option>
          <option value="8pm">8 PM</option>
        </select>
      </div>

      <div className="save-container">
        <button onClick={handleSave} disabled={isSaveButtonDisabled()} className="save-button">
          Save
        </button>
      </div>

      {/* Render the Result component */}
      <Result />
    </div>
  );
};

export default TicketTable;
