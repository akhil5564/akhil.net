import { FC, useState, useEffect } from 'react';
import { IconZoomCode } from '@tabler/icons-react';
import '../Main/Salesreport.css';
import { Link } from 'react-router-dom';

interface salesReportProps {
  // You can add more props if needed for further customization
}

const SalesReport: FC<salesReportProps> = ({}) => {
  // States for form inputs
  const [number, setNumber] = useState<number | string>(''); // State for the number input
  const [selectedTime, setSelectedTime] = useState<string>(''); // State for time selection
  const [fromDate, setFromDate] = useState<string>(''); // State for from date
  const [toDate, setToDate] = useState<string>(''); // State for to date
  const [selectedUser, setSelectedUser] = useState<string>(''); // State for user selection

  // Set today's date in YYYY-MM-DD format as the default value for the date input
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setFromDate(formattedDate); // Set the formatted date as the default value for from date
    setToDate(formattedDate); // Set the formatted date as the default value for to date
  }, []);

  // Handlers for input changes
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  return (
    <div className="sales-report-container">
      <div className="form-group">
        {/* Time Dropdown */}
        <label className="form-label">Select Time</label>
        <select className="form-input" value={selectedTime} onChange={handleTimeChange}>
          <option value="1PM">1PM</option>
          <option value="3PM">3PM</option>
          <option value="6PM">6PM</option>
          <option value="8PM">8PM</option>
          <option value="All">All</option>
        </select>
      </div>

      {/* Date range selection */}
      <div className="form-group">
        <label className="form-label">From:</label>
        <input
          className="form-input"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
        />

        <label className="form-label">To:</label>
        <input
          className="form-input"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>

      {/* User dropdown */}
      <div className="form-group">
        <label className="form-label">Select User</label>
        <select className="form-input" value={selectedUser} onChange={handleUserChange}>
          <option value="">All</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>

      {/* Number input */}
      <div className="form-group">
        <label className="form-label">Number</label>
        <input
          className="form-input"
          type="number"
          value={number}
          onChange={handleNumberChange}
          placeholder="Enter a number"
        />
      </div>

      {/* Submit button to go to Reporter page with selected time as a query parameter */}
      <button className="submit-button">
        <Link
          to={`/reporter?time=${selectedTime}&fromDate=${fromDate}&toDate=${toDate}&user=${selectedUser}&number=${number}`}
        >
          <IconZoomCode stroke={2} />
        </Link>
      </button>
    </div>
  );
};

export default SalesReport;
