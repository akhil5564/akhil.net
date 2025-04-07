import  { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TotalAmountDisplay: React.FC = () => {
  const location = useLocation();
  const { totalAmount } = location.state || { totalAmount: 0 }; // Default to 0 if undefined

  // Ensure totalAmount is a valid number before calling toFixed
  const validTotalAmount = totalAmount || 0;

  // States for date and time
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('1pm');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [finalAmount, setFinalAmount] = useState<number>(0);

  // A sample mapping of date-time combinations to price and commission values
  const dateTimePriceCommissionMapping: { [key: string]: { price: number, commission: number } } = {
    '2025-04-06 1pm': { price: 100.0, commission: 20.0 },
    '2025-04-06 6pm': { price: 150.0, commission: 30.0 },
    '2025-04-06 3pm': { price: 120.0, commission: 25.0 },
    '2025-04-06 8pm': { price: 130.0, commission: 26.0 },
    // Add more mappings as needed
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the selected date is in the correct format (YYYY-MM-DD)
    const formattedDate = selectedDate?.toLocaleDateString('en-CA'); // Example: '2025-04-06'
    const dateTimeKey = `${formattedDate} ${selectedTime}`;

    // Retrieve the price and commission for the selected date and time from the mapping
    const priceCommission = dateTimePriceCommissionMapping[dateTimeKey] || { price: 0, commission: 0 };

    // Calculate the final amount (price + commission)
    const amountForSelectedDateTime = priceCommission.price + priceCommission.commission;

    // Set the final amount and submitted state
    setFinalAmount(amountForSelectedDateTime);
    setSubmitted(true);
  };

  return (
    <div className="total-amount-display">
      <h3>Total Amount: {validTotalAmount.toFixed(2)}</h3>

      {/* Form for date and time selection */}
      <form onSubmit={handleSubmit}>
        {/* Date Picker */}
        <div>
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select a date"
          />
        </div>

        {/* Time Selector */}
        <div>
          <label>Select Time:</label>
          <select value={selectedTime} onChange={handleTimeChange}>
            <option value="1pm">1 PM</option>
            <option value="6pm">6 PM</option>
            <option value="3pm">3 PM</option>
            <option value="8pm">8 PM</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>

      {/* Display the selected date, time, and the corresponding total amount after form submission */}
      {submitted && (
        <div>
          <p>Selected Date: {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}</p>
          <p>Selected Time: {selectedTime}</p>
          <h3>Total Amount for Selected Date and Time: ${finalAmount.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default TotalAmountDisplay;
