import { useNavigate } from 'react-router-dom';
import './DateTimeFilter.css';

// ✅ Explicit interface with proper types
interface DateTimeFilterProps {
  fromDate: string;
  toDate: string;
  selectedTime: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onSubmit: () => void;
}

const DateTimeFilter: React.FC<DateTimeFilterProps> = ({
  fromDate,
  toDate,
  selectedTime,
  onFromDateChange,
  onToDateChange,
  onTimeChange,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    onSubmit();
    navigate('/swinner');
  };

  return (
    <div className="filter-container">
      <h2 className="filter-title">Filter Results</h2>
      <div className="filter-fields">
        <label className="filter-label">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="filter-input"
          />
        </label>

        <label className="filter-label">
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="filter-input"
            min={fromDate}
          />
        </label>

        <label className="filter-label">
          Time:
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="filter-input"
          >
            <option value="">Select Time</option>
            <option value="all">All Times</option>
            <option value="1pm">1 PM</option>
            <option value="3pm">3 PM</option>
            <option value="6pm">6 PM</option>
            <option value="8pm">8 PM</option>
          </select>
        </label>
      </div>

      <button className="filter-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default DateTimeFilter;
