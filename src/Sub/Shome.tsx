import { FC, useState, useRef, useEffect, ChangeEvent } from 'react';
import { IconTrash } from '@tabler/icons-react';
import '../Main/home.css';
import Snavbar from './Snavbar';

const Home: FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>('3PM');
  const [visibleDigit, setVisibleDigit] = useState<string | null>(null);
  const [numValue, setNumValue] = useState<string>('');
  const [numValue2, setNumValue2] = useState<string>('');
  const [numValue3, setNumValue3] = useState<string>('');
  const [countValue, setCountValue] = useState<string>(''); // Track count value for all digits
  const [tableRows, setTableRows] = useState<{ letter: string; num: string; count: string; amount: string }[]>([]); // Track letter, num, count, and amount
  const [setChecked, setSetChecked] = useState<boolean>(false); // Track the "Set" checkbox state
  const [isSaving] = useState<boolean>(false); // Track if saving is in progress

// Add this in your component's state:
const [countValue2, setCountValue2] = useState(''); // <-- New for Count2

  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const inputRef3 = useRef<HTMLInputElement | null>(null);
  const inputRef4 = useRef<HTMLInputElement | null>(null);

  const generatePermutations = (str: string) => {
    const results: string[] = [];
  
    const permute = (arr: string[], memo: string[] = []) => {
      if (arr.length === 0) {
        results.push(memo.join(''));
        return;
      }
  
      for (let i = 0; i < arr.length; i++) {
        const currArr = arr.slice();
        const next = currArr.splice(i, 1);
        permute(currArr, memo.concat(next));
      }
    };
  
    permute(str.split('')); // Convert string to array of characters
    return [...new Set(results)]; // Remove duplicates
  };
  
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log('Selected time:', time);
  };

  const handleButtonClick = (digit: string) => {
    setVisibleDigit(digit);
  };

  const generateTwoDigitPermutations = (str: string) => {
    const results: string[] = [];
  
    // Permute the 2 digits
    const permute = (arr: string[]) => {
      if (arr.length === 2) {
        // Create permutations by swapping the two digits
        results.push(arr.join(''));
      }
    };
  
    permute(str.split('')); // Split the string and generate permutations
    return [...new Set(results)]; // Remove duplicates (if any)
  };
  
  
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 1) value = value.slice(0, 1); // Ensure only one digit is allowed
    setNumValue(value);
  
    // If a digit has been entered, focus on the count input
    if (value.length === 1 && inputRef4.current) {
      inputRef4.current.focus(); // Focus on the count input when the digit is complete
    }
  };
  
  const handleNumChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 2) value = value.slice(0, 2);
    setNumValue2(value);


    if (value.length === 2 && inputRef4.current) inputRef4.current.focus();

    if (value.length === 2 && inputRef3.current) inputRef3.current.focus();
  };



  
  const handleNumChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 3) value = value.slice(0, 3);
    setNumValue3(value);

    if (value.length === 3 && inputRef4.current) inputRef4.current.focus();
  };
  useEffect(() => {
    switch (selectedTime) {
      case '1PM':
        document.body.style.backgroundColor = 'rgb(196, 190, 248)'; // Light yellow
        document.body.style.color = '#000';
        break;
      case '6PM':
        document.body.style.backgroundColor = 'rgb(243, 228, 204)'; // Deep purple
        break;
      case '8PM':
        document.body.style.backgroundColor = 'rgb(245, 173, 173)'; // Deep purple
        document.body.style.color = '#fff';
        break;
    }
  }, [selectedTime]);


  useEffect(() => {
    if (visibleDigit === 'digit1' && inputRef1.current) {
      inputRef1.current.focus(); // Focus on digit1 input
    } else if (visibleDigit === 'digit2' && inputRef2.current) {
      inputRef2.current.focus(); // Focus on digit2 input
    } else if (visibleDigit === 'digit3' && inputRef3.current) {
      inputRef3.current.focus(); // Focus on digit3 input
    }
  }, [visibleDigit]); // Effect runs when visibleDigit changes
  
  const handleDigit1ButtonClick = (value: string) => {
    if (value === 'All') {
      // Add A, B, and C to the table
      setTableRows((prevRows) => [
        ...prevRows,
        { letter: 'A', num: numValue, count: countValue, amount: (parseInt(countValue, 10) * 12).toString() },
        { letter: 'B', num: numValue, count: countValue, amount: (parseInt(countValue, 10) * 12).toString() },
        { letter: 'C', num: numValue, count: countValue, amount: (parseInt(countValue, 10) * 12).toString() },
      ]);
    } else {
      const count = parseInt(countValue, 10) || 0;
      const amount = count * 12;
  
      setTableRows((prevRows) => [
        ...prevRows,
        { letter: value, num: numValue, count: countValue, amount: amount.toString() },
      ]);
    }
  
    // Clear the inputs after adding to the table
    setNumValue('');
    setCountValue('');
  
    // Focus back on the 'Num' input after the button click
    if (inputRef1.current) inputRef1.current.focus(); // Set focus on 'numValue' input
  };
  
  const handleDigit2ButtonClick = (value: string) => {
    const count = parseInt(countValue, 10) || 0;
    const amount = count * 10;
    
    // Make sure `numValue2` is a valid number before processing
    if (!numValue2) {
      alert("Please enter a valid number");
      return;
    }
    
    // Generate permutations of numValue2
    const permutations = generateTwoDigitPermutations(numValue2);
    const uniquePerms = Array.from(new Set(permutations)); // Remove duplicates
    
    if (value === 'All') {
      if (setChecked) {
        // For each permutation, add entries for AB, AC, BC
        uniquePerms.forEach((perm) => {
          ['AB', 'AC', 'BC'].forEach((letter) => {
            setTableRows((prevRows) => [
              ...prevRows,
              { letter, num: perm, count: countValue, amount: amount.toString() },
            ]);
          });
        });
      } else {
        // If `setChecked` is not true, add the original number for each letter
        ['AB', 'AC', 'BC'].forEach((letter) => {
          setTableRows((prevRows) => [
            ...prevRows,
            { letter, num: numValue2, count: countValue, amount: amount.toString() },
          ]);
        });
      }
    } else {
      // If a specific letter is clicked
      if (setChecked) {
        uniquePerms.forEach((perm) => {
          setTableRows((prevRows) => [
            ...prevRows,
            { letter: value, num: perm, count: countValue, amount: amount.toString() },
          ]);
        });
      } else {
        setTableRows((prevRows) => [
          ...prevRows,
          { letter: value, num: numValue2, count: countValue, amount: amount.toString() },
        ]);
      }
    }
  
    // Clear the input fields
    setNumValue2('');
    setCountValue('');
  
    // Refocus the input field (if needed)
    if (inputRef2.current) inputRef2.current.focus();
  };
  
  
  const handleDigit3ButtonClick = (type: string, count: number) => {
    const amount = count * 10;
  
    const permutations = generatePermutations(numValue3);
    const uniquePerms = Array.from(new Set(permutations)); // Remove duplicates
  
    if (type === 'All') {
      // Add original number once for both SUPER and BOX
      setTableRows((prevRows) => [
        ...prevRows,
        { letter: 'SUPER', num: numValue3, count: count.toString(), amount: amount.toString() },
        { letter: 'BOX', num: numValue3, count: count.toString(), amount: amount.toString() },
      ]);
  
      if (setChecked) {
        uniquePerms.forEach((perm) => {
          setTableRows((prevRows) => [
            ...prevRows,
            { letter: 'SUPER', num: perm, count: count.toString(), amount: amount.toString() },
            { letter: 'BOX', num: perm, count: count.toString(), amount: amount.toString() },
          ]);
        });
      }
    } else {
      if (setChecked) {
        // Only permutations
        uniquePerms.forEach((perm) => {
          setTableRows((prevRows) => [
            ...prevRows,
            { letter: type, num: perm, count: count.toString(), amount: amount.toString() },
          ]);
        });
      } else {
        // Only original number
        setTableRows((prevRows) => [
          ...prevRows,
          { letter: type, num: numValue3, count: count.toString(), amount: amount.toString() },
        ]);
      }
    }
  
    // Clear input fields
    setNumValue3('');
    setCountValue('');
    setCountValue2('');
    if (inputRef3.current) inputRef3.current.focus();
  };
  
  
  
  
  
  
  
  // Function to handle clicking "any" checkbox


  // Function to delete a random row from the table
  const handleDeleteRandomRow = () => {
    const randomIndex = Math.floor(Math.random() * tableRows.length);
    setTableRows((prevRows) => prevRows.filter((_, index) => index !== randomIndex));
  };
  
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText(); // Read clipboard content
  
      // Match format `num=operationcount`, supporting operators like '=', '-', '*', etc.
      const matches = text.match(/(\d+)([=\-*/])(\d+)/g); // Match num=operationcount, num-4, num*4, etc.
  
      if (matches) {
        matches.forEach(match => {
          // Ensure the match is not null before calling .match()
          const matchParts = match.match(/(\d+)([=\-*/])(\d+)/);
  
          if (matchParts) {
            const [ num, operator, count] = matchParts; // Destructure the match result
            const numValue = parseInt(num, 10);
            const countValue = parseInt(count, 10);
  
            let amount = 0;
  
            // Perform the operation based on the operator
            switch (operator) {
              case '=':
                amount = 10 * countValue; // If `=` then multiply num by count
                break;
              case '-':
                amount = 10 * countValue; // If `-` then subtract count from num
                break;
              case '*':
                amount = 10 * countValue; // If `*` then multiply num by count
                break;
              default:
                console.error('Invalid operator:', operator);
                return;
            }
  
            // Only add to the table if count is greater than 0
            if (countValue > 0) {
              setTableRows(prevRows => [
                ...prevRows,
                { letter: 'Super', num: numValue.toString(), count: countValue.toString(), amount: amount.toString() }
              ]);
            }
          } else {
            console.error('Invalid match format:', match);
          }
        });
      } else {
        console.error('No valid data in clipboard or incorrect format');
      }
    } catch (error) {
      console.error('Failed to read clipboard data:', error);
    }
  };
  const saveData = async () => {
    try {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
  
      console.log(`currentTime: ${currentTime}`);
      console.log(`currentHour: ${currentHour}, currentMinute: ${currentMinute}`);
      console.log(`selectedTime: ${selectedTime}`);
  
      let timeBlock: string;
  
      // Time block condition checks
      if (selectedTime === '1PM' && (currentHour > 12 || (currentHour === 12 && currentMinute > 59))) {
        alert('Cannot save data after 12:59 PM for 1PM block!');
        return;
      } else if (selectedTime === '3PM' && (currentHour === 15 && currentMinute > 2)) {
        alert('Cannot save data after 3:02 PM for 3PM block!');
        return;
      } else if (selectedTime === '6PM' && (currentHour === 17 && currentMinute >= 59 && currentMinute <= 5)) {
        // Fix the 6PM block logic to allow exactly from 5:59 PM to 6:05 PM
        timeBlock = '6PM';
      } else if (selectedTime === '8PM' && (currentHour === 19 && currentMinute >= 59 && currentMinute <= 5)) {
        // Fix the 8PM block logic to allow exactly from 7:59 PM to 8:05 PM
        timeBlock = '8PM';
      } else {
        timeBlock = selectedTime;
      }
  
      console.log(`Final timeBlock: ${timeBlock}`);
  
      // Proceed with API call
      const username = localStorage.getItem('loggedInUser'); // Retrieve logged-in username
      if (!username) {
        alert("User not logged in!");
        return;
      }
  
      if (tableRows.length === 0) {
        alert("No data to save!");
        return;
      }
  
      console.log("Saving Data...");
      console.log("Username:", username);
      console.log("Selected Time:", selectedTime);
      console.log("Table Rows:", tableRows);
  
      // Generate a unique customId (if it's not generated by backend)
      // const customId = Date.now(); // Use current timestamp as unique customId
  
      // Modify all table rows to include the same customId
      const updatedTableRows = tableRows.map((row) => ({
        ...row,
        // customId, // Add the same customId to each row
      }));
  
      // Send an array of data to backend
      const response = await fetch('https://manu-netflix.onrender.com/addData', {  // Make sure to use the correct API URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          selectedTime: timeBlock,
          tableRows: updatedTableRows, // Send an array of table rows with the same customId
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Data saved successfully. Custom ID:', data.customId);
        alert(`Bill No: ${data.customId}`);
        setTableRows([]); // Reset table rows after saving
      } else {
        const errorData = await response.json();
        console.error('Error saving data:', errorData);
        alert('Error saving data: ' + errorData.message);
      }
  
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };
  
  
  
  
  
  
  
  
  
  
  const handleSetCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSetChecked(e.target.checked);
  
    if (e.target.checked) {
      let numToPermute = '';
  
      // Based on the currently visible digit, pick the right num value
      if (visibleDigit === 'digit1') numToPermute = numValue;
      if (visibleDigit === 'digit2') numToPermute = numValue2;
      if (visibleDigit === 'digit3') numToPermute = numValue3;
  
      if (numToPermute) {
        // Generate the permutations for the current num value
        const permutations = generatePermutations(numToPermute);
        console.log('Generated Permutations:', permutations);
  
        // Remove the original number (e.g., 123) from the table compulsorily
        const newTableRows = tableRows.filter(row => row.num !== numToPermute);
        setTableRows(newTableRows); // Remove the original number (e.g., 123) from the table
  
        // Add the permutations to the table
        permutations.forEach((perm) => {
          // Only add the permutation if it is not already in the table
          if (!newTableRows.some(row => row.num === perm)) {
            setTableRows((prevRows) => [
              ...prevRows,
            ]);
          }
        });
      }
    }
  };
  
  
  

  return (
    <>
      
            <Snavbar handlePaste={handlePaste} />

      <div className='drp'>
        <div className="dropdown">
          <a className="btn btn-light" href="#" data-bs-toggle="dropdown">
            {selectedTime}
          </a>
        
          <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#" onClick={() => handleTimeSelect('3PM')}>3PM</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleTimeSelect('1PM')}>1PM</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleTimeSelect('6PM')}>6PM</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleTimeSelect('8PM')}>8PM</a></li>
          </ul>
        </div>
        
        <div className="digits">
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-dark gray" onClick={() => handleButtonClick('digit1')}>1</button>
            <button type="button" className="btn btn-info" onClick={() => handleButtonClick('digit2')}>2</button>
            <button type="button" className="btn btn-success" onClick={() => handleButtonClick('digit3')}>3</button>
          </div>
        </div>
      </div>

      {visibleDigit === 'digit1' && (
  <div className="digit1">
    <div className="input1">
      <input
        className='inputs'
        type="number"
        placeholder="Num"
        value={numValue}
        onChange={handleNumChange}
        ref={inputRef1}
      />


   

      <input
        className='inputs'
        type="number"
        placeholder="Count"
        value={countValue}
        onChange={(e) => setCountValue(e.target.value)} // Update count value
        ref={inputRef4}
      />

 

      <div className='chckbx'>
        <label>
          Set
          <input type="checkbox" />
        </label>
        <label>
          Any
          <input type="checkbox" />
        </label>
      </div>
    </div>

    <div className="type">
      <button 
        type="button" 
        className="btn btn-dark gray" 
        onClick={() => {
          // Only add to table if numValue is filled and countValue is at least 1
          if (numValue.length > 0 && parseInt(countValue) >= 1) {
            handleDigit1ButtonClick('A');
          }
        }}
      >
        A
      </button>
      <button 
        type="button" 
        className="btn btn-dark gray" 
        onClick={() => {
          // Only add to table if numValue is filled and countValue is at least 1
          if (numValue.length > 0 && parseInt(countValue) >= 1) {
            handleDigit1ButtonClick('B');
          }
        }}
      >
        B
      </button>
      <button 
        type="button" 
        className="btn btn-dark gray" 
        onClick={() => {
          // Only add to table if numValue is filled and countValue is at least 1
          if (numValue.length > 0 && parseInt(countValue) >= 1) {
            handleDigit1ButtonClick('C');
          }
        }}
      >
        C
      </button>
      <button 
        type="button" 
        className="btn btn-dark gray" 
        onClick={() => {
          // Only add to table if numValue is filled and countValue is at least 1
          if (numValue.length > 0 && parseInt(countValue) >= 1) {
            handleDigit1ButtonClick('All');
          }
        }}
      >
        All
      </button>
    </div>

  </div>
)}

{visibleDigit === 'digit2' && (
  <div className="digit2">
    <div className="input2">
      <input className="inputs"
        type="number"
        placeholder="Num"
        value={numValue2}
        onChange={handleNumChange2}
        ref={inputRef2}
      />
      <input className="inputs"
        type="number"
        placeholder="Count"
        value={countValue}
        onChange={(e) => setCountValue(e.target.value)} // Update count value for digit2
        ref={inputRef4}
      />
      <div className="chckbx">
        <label> Set
          <input type="checkbox" /> 
        </label>
        <label>
          any 
          <input type="checkbox" /> 
        </label>
      </div>
    </div>

    <div className="type">
      {/* Modify button logic to ensure numValue2 and countValue are not empty */}
      <button 
        type="button" 
        className="btn btn-info" 
        onClick={() => numValue2.length > 0 && countValue.length > 0 && handleDigit2ButtonClick('AB')}
      >
        AB
      </button>


      <button 
        type="button" 
        className="btn btn-info" 
        onClick={() => numValue2.length > 0 && countValue.length > 0 && handleDigit2ButtonClick('AC')}
      >
        AC
      </button>

      <button 
        type="button" 
        className="btn btn-info" 
        onClick={() => numValue2.length > 0 && countValue.length > 0 && handleDigit2ButtonClick('BC')}
      >
        BC
      </button>
      
      <button 
        type="button" 
        className="btn btn-dark gray" 
        onClick={() => numValue2.length > 0 && countValue.length > 0 && handleDigit2ButtonClick('All')}
      >
        All
      </button>
    </div>
  </div>
)}
{visibleDigit === 'digit3' && (
  <div className="digit3">
    <div className="input3">
      <input 
        className="inputs"
        type="number"
        placeholder="Num"
        value={numValue3}
        onChange={handleNumChange3}
        ref={inputRef3}
      />

      <input
        className="inputs"
        type="number"
        placeholder="Count"
        value={countValue}
        onChange={(e) => setCountValue(e.target.value)}
        ref={inputRef4}
      />

      <input 
        className="inputs"
        type="number"
        placeholder="Count2"
        value={countValue2}
        onChange={(e) => setCountValue2(e.target.value)}
      />

      <div className="chckbx">
        <label>
          Set
          <input type="checkbox" onChange={handleSetCheckboxChange} />
        </label>
        <label>
          Any
          <input type="checkbox" />
        </label>
      </div>
    </div>

    <div className="type">
      <button 
        type="button" 
        className="btn btn-success" 
        onClick={() => {
          const count = parseInt(countValue);
          if (numValue3 && count >= 1) {
            handleDigit3ButtonClick('SUPER', count);
          }
        }}
      >
        SUPER
      </button>

   <button 
  type="button" 
  className="btn btn-success" 
  onClick={() => {
    const count = parseInt(countValue2) || parseInt(countValue); // Fallback to countValue if countValue2 is empty

    if (numValue3 && count >= 1) {
      handleDigit3ButtonClick('BOX', count);
    }
  }}
>
  BOX
</button>


      <button 
  type="button" 
  className="btn btn-dark gray" 
  onClick={() => {
    const count1 = parseInt(countValue);
    const count2 = parseInt(countValue2);

    if (numValue3.length === 0) return;

    if (count1 >= 1 && count2 >= 1) {
      // Both counts filled
      handleDigit3ButtonClick('SUPER', count1);
      handleDigit3ButtonClick('BOX', count2);
    } else if (count1 >= 1) {
      // Only count1 filled, use for both
      handleDigit3ButtonClick('SUPER', count1);
      handleDigit3ButtonClick('BOX', count1);
    } else if (count2 >= 1) {
      // Only count2 filled, use for both
      handleDigit3ButtonClick('SUPER', count2);
      handleDigit3ButtonClick('BOX', count2);
    }
  }}
>
  All
</button>

    </div>
  </div>
)}


  


{/* 
      <ul>
        <li> <Link to='/sales'>sales report</Link></li>
        <li> <Link to='/winning'>winning</Link></li>
        <li> <Link to='/more'>more</Link></li>
        <li> <Link to='/netpay'>net pay</Link></li>
        <li> <Link to='/pnl'>profit and loss</Link></li>
        <li> <Link to='/countreport'>count report</Link></li>

        

      </ul> */}

<button 
  className="btn-save" 
  onClick={saveData}
  disabled={isSaving}  // Disable the button while saving
>
  {isSaving ? 'Saving...' : 'Save'}
</button>

<div className="table-container-home">
  <h1 className="tamount">
    Total: {tableRows.reduce((total, row) => total + (parseInt(row.amount, 10) || 0), 0)}
  </h1>
  <table className="table">
    <tbody>
      {tableRows
        .slice() // Create a copy of the tableRows array
        .reverse() // Reverse the order of the rows
        .map((row, index) => (
          <tr
            key={index}
            style={
              row.num.length === 3
                ? { backgroundColor: 'green' }
                : row.num.length === 2
                ? { backgroundColor: 'blue' }
                : {}
            }
          >
            <td>{row.letter}</td>
            <td>{row.num}</td>
            <td>{row.count}</td>
            <td>{row.amount}</td>
            <td>
              <IconTrash stroke={2} onClick={handleDeleteRandomRow} />
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
     
    </>
  );
};

export default Home;
