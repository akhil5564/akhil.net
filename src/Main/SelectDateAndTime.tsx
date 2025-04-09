import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectDateAndTime.css'; // Import the CSS file for styling

const SelectDateAndTime: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      // Navigate to the results page with the selected date and time as query parameters
      navigate(`/results?date=${selectedDate}&time=${selectedTime}`);
    } else {
      alert('Please select both date and time.');
    }
  };

  return (
    <div className="select-date-time-container">
      <h1 className="page-title">Select Date and Time</h1>
      
      <div className="form-group">
        <label className="form-label">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Select Time:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="form-input"
        >
          <option value="">Select Time</option>
          <option value="1pm">1 PM</option>
          <option value="3pm">3 PM</option>
          <option value="6pm">6 PM</option>
          <option value="8pm">8 PM</option>
        </select>
      </div>

      <button className="submit-buttoned" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SelectDateAndTime;
