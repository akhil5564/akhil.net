import { FC } from 'react';

interface TimeAdjustmentProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;  // Function to set the time
}

const TimeAdjustment: FC<TimeAdjustmentProps> = ({ selectedTime, setSelectedTime }) => {
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div>
      <h3>Selected Time: {selectedTime}</h3>
      <div className="dropdown">
        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          {selectedTime}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a className="dropdown-item" href="#" onClick={() => handleTimeChange('1PM')}>1PM</a></li>
          <li><a className="dropdown-item" href="#" onClick={() => handleTimeChange('3PM')}>3PM</a></li>
          <li><a className="dropdown-item" href="#" onClick={() => handleTimeChange('6PM')}>6PM</a></li>
          <li><a className="dropdown-item" href="#" onClick={() => handleTimeChange('8PM')}>8PM</a></li>
        </ul>
      </div>
    </div>
  );
};

export default TimeAdjustment;
