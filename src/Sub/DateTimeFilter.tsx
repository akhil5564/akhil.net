import { FC, useState, useEffect } from 'react';
import { IconZoomCode } from '@tabler/icons-react';
import '../Main/Salesreport.css';
import { useNavigate } from 'react-router-dom';

interface SalesReportProps {
  // You can add more props if needed for further customization
}

const SalesReport: FC<SalesReportProps> = ({}) => {
  const [number, setNumber] = useState<number | string>(''); // State for the number input
  const [selectedTime, setSelectedTime] = useState<string>(''); // State for time selection
  const [fromDate, setFromDate] = useState<string>(''); // State for from date
  const [toDate, setToDate] = useState<string>(''); // State for to date
  const [selectedUser, setSelectedUser] = useState<string>(''); // State for user selection

  const navigate = useNavigate();

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

  // Handle form submission and validation
  const handleSubmit = () => {
    if (!selectedTime || !fromDate || !toDate) {
      alert('Please fill in all required fields.');
      return;
    }

    // Redirect to the results page with query parameters
    navigate(`/swinner?time=${selectedTime}&fromDate=${fromDate}&toDate=${toDate}&user=${selectedUser}&number=${number}`);
  };

  return (
    <div className="sales-report-container">
      <div className="form-group">
        <label className="form-label">Select Time</label>
        <select className="form-input" value={selectedTime} onChange={handleTimeChange}>
          <option value="">Select a time</option>
          <option value="1PM">1PM</option>
          <option value="3PM">3PM</option>
          <option value="6PM">6PM</option>
          <option value="8PM">8PM</option>
          <option value="All">All</option>
        </select>
      </div>

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

      <div className="form-group">
        <label className="form-label">Select User</label>
        <select className="form-input" value={selectedUser} onChange={handleUserChange}>
          <option value="">All</option>
          {/* Add other user options here */}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Number</label>
        <input
          className="form-input"
          type="number"
          value={number}
          onChange={handleNumberChange}
          placeholder="Enter a number"
          min="1"  // Add minimum value for number input
        />
      </div>

      {/* Submit button to go to Reporter page */}
      <button className="submit-button" onClick={handleSubmit}>
        <IconZoomCode stroke={2} />
        
      </button>
    </div>
  );
};

export default SalesReport;
