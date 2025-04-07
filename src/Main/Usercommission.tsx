import { useState } from 'react';
import './Usercom.css';

interface TicketTableRow {
  ticket: string;
  comm: number;
}

const TicketTable: React.FC = () => {
  const initialRows: TicketTableRow[] = [
    { ticket: 'A', comm: 0.0 },
    { ticket: 'B', comm: 0.0 },
    { ticket: 'C', comm: 0.0 },
    { ticket: 'AB', comm: 0.0 },
    { ticket: 'BC', comm: 0.0 },
    { ticket: 'AC', comm: 0.0 },
    { ticket: 'Super', comm: 0.0 },
    { ticket: 'Box', comm: 0.0 },
  ];

  const [rows, setRows] = useState<TicketTableRow[]>(initialRows);

  const handleInputChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    const parsedValue = value ? parseFloat(value) : 0; // Set default value to 0
    updatedRows[index].comm = isNaN(parsedValue) ? 0 : parsedValue;
    setRows(updatedRows);
  };

  const getRowClassName = (ticket: string) => {
    if (['A', 'B', 'C'].includes(ticket)) {
      return 'black-row';
    } else if (['AB', 'BC', 'AC'].includes(ticket)) {
      return 'blue-row';
    }
    return 'transparent-row'; // default class for other tickets
  };

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Comm</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={getRowClassName(row.ticket)}
            >
              <td>{row.ticket}</td>
              <td>
                <input
                  className="comm-input"
                  type="number"
                  step="0.01"
                  value={row.comm}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
