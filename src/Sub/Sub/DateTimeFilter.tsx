  import { useLocation, useNavigate } from 'react-router-dom';
  import './DateTimeFilter.css';
import { useState } from 'react';

  // ✅ Explicit interface with proper types

  const DateTimeFilter: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passedData = location.state?.to;
    console.log(passedData); 
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleSubmit = () => {
      if(passedData==="winners-report"){
      navigate('/swinner',{
      state:{ 
      fromDate,
      toDate,
      selectedTime,
    },
      });
    }else{
      navigate('/profitandloss',{
        state:{ 
        fromDate,
        toDate,
        selectedTime,
      },
        });
    }
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
              onChange={(e) => setFromDate(e.target.value)}
              className="filter-input"
            />
          </label>

          <label className="filter-label">
            To:
            {/* <input
              type="date"
              value={toDate ? new Date(toDate).toISOString().split("T")[0] : ""}
              onChange={(e) => onToDateChange(e.target.value)}
              className="filter-input"
              min={fromDate}
            /> */}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="filter-input"
              min={fromDate}
            />
          </label>

          <label className="filter-label">
            Time:
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
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
