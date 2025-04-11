import  { FC, useState, useEffect } from 'react';
import '../Main/Salesreport.css'
import { IconZoomCode } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface salesReportProps {
  // You can add more props if needed for further customization
}

const SalesReport: FC<salesReportProps> = ({}) => {
  const [number, setNumber] = useState<number | string>(''); // State for the number input
  const [date, setDate] = useState<string>(''); // State for the calendar input
  const [selectedOption, setSelectedOption] = useState<string>(''); // State for dropdown selection

  // Set today's date in YYYY-MM-DD format as the default value for the date input
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setDate(formattedDate); // Set the formatted date as the default value
  }, []);

  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };


  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };


  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (


    <div className="sales-report-container">
      <div className="form-group">


   {/* Dropdown */}
   <div className="form-group">
        <label className="form-label"></label>
        <select
          className="form-input"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="option1">KERALA 3PM</option>
          <option value="option2">DEAR 1PM</option>
          <option value="option3">DEAR 6PM</option>
          <option value="option3">DEAR 8PM</option>
          <option value="option3">ALL</option>


        </select>
      </div>


      </div>

      <div className="form-group">
        <label className="form-label">From:</label>
        <input
          className="form-input"
          type="date"
          value={date}
          onChange={handleDateChange}
        />


<label className="form-label">To:</label>
        <input
          className="form-input"
          type="date"
          value={date}
          onChange={handleDateChange}
        />

<div className="form-group">
        <label className="form-label">User</label>
        <select
          className="form-input"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="option1">All</option>
          <option value="option2">User1</option>
          <option value="option3">User2</option>
          <option value="option3">User3</option>

        </select>
      </div>


      
   {/* Dropdown */}
   <div className="form-group">
        <label className="form-label">No of Digits</label>
        <select
          className="form-input"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="option1">ALL</option>
          <option value="option2">1</option>
          <option value="option3">2</option>
          <option value="option3">3</option>


        </select>
      </div>




      
   {/* Dropdown */}
   <div className="form-group">
        <label className="form-label">Ticket</label>
        <select
          className="form-input"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="option1">A</option>
          <option value="option2">B</option>
          <option value="option3">C</option>


        </select>
      </div>


<label className="form-label">Number:</label>
        <input
          className="form-input"
          type="number"
          placeholder="Enter number"
          value={number}
          onChange={handleNumberChange}
        />

      </div>

      


      <button className="submit-button"> <Link to='/counts'><IconZoomCode stroke={2} /></Link></button>
    </div>
  );
};

export default SalesReport;
