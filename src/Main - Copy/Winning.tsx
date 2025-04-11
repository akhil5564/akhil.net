import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

interface DateTimePickerProps {
  onSubmit: (fromDate: string, toDate: string, time: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onSubmit }) => {
  const [selectedFromDate, setSelectedFromDate] = useState<string>('');
  const [selectedToDate, setSelectedToDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Track loading state

  const navigate = useNavigate();  // Initialize navigate

  const handleSubmit = () => {
    if (!selectedFromDate || !selectedToDate || !selectedTime) {
      alert('Please select both date range and time.');
      return;
    }

    // Ensure the "To" date is not earlier than the "From" date
    if (new Date(selectedToDate) < new Date(selectedFromDate)) {
      alert('To Date cannot be earlier than From Date');
      return;
    }

    setIsLoading(true);
    onSubmit(selectedFromDate, selectedToDate, selectedTime); // Pass the values back to the parent
    navigate('/swinnwe');  // Navigate to /swinnwe after submission
  };

  return (
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

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default DateTimePicker;
