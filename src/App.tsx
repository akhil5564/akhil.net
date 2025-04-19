import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Main/Home';
import Login from './login/Login';
import Salesreport from './Main/Salesreport';
import Winning from './Main/Winning';
import More from './Admin/More';
import Netpay from './Main/Netpay';
import Pnl from './Main/Pnl';
import Countreport from './Main/Countreport';
import InUserManager from './Admin/InUserManager';
import CreateUser from './Admin/CreateUser';
import Usercommission from './Main/Usercommission';
import ResultEntry from './Admin/ResultEntry';
import Reporter from './Main/Reporter';
import Result from './Main/Result';
import Winner from './Main/Winner';
import InCount from './Main/InCount';
import Shome from './Sub/Shome';
import Snavbar from './Sub/Snavbar';
import Sreporter from './Sub/Sreporter';
import Ssales from './Sub/Ssales';
import Swinnwe from './Sub/Swinnwe';
import TotalAmountDisplay from './Main/TotalAmountDisplay';
import DateTimeFilter from './Sub/DateTimeFilter';
import ResultsPage from './Main/Result';
import SelectDateAndTime from './Main/SelectDateAndTime';
import Spnl from './Sub/Spnl';

// Create the router with createBrowserRouter
const App: React.FC = () => {
  // const [fromDate, setFromDate] = useState<string>('');
  // const [toDate, setToDate] = useState<string>('');
  // const [selectedTime, setSelectedTime] = useState<string>('');



  const handleSubmit = () => {
    // console.log('From Date:', fromDate);
    // console.log('To Date:', toDate);
    // console.log('Selected Time:', selectedTime);
  };

  // Create the router with the state passed to the routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/select-date-time",
      element: <SelectDateAndTime />,
    },
    {
      path: "/winning",
      element: <Winning onSubmit={handleSubmit} />,
    },
    {
      path: "/swinner",
      element: (
        <Swinnwe



        />
      ),
    },
    {
      path: "/datefilter",
      element: (
        <DateTimeFilter
        />
      ),
    },
    {
      path: "/counts",
      element: <InCount />, // Count Route
    },
    {
      path: "/shome",
      element: <Shome />, // Sub Home Page Route
    },
    {
      path: "/snavbar",
      element: <Snavbar handlePaste={function (): void {
        throw new Error('Function not implemented.');
      } } />, // Sub Navbar Route
    },
    {
      path: "/result",
      element: <Result />, // Result Route
    },
    {
      path: "/sales",
      element: <Salesreport />, // Sales Report Route
    },
    {
      path: "/winner",
      element: <Winner />, // Winner Route
    },
    {
      path: "/more",
      element: <More />, // More Route
    },
    {
      path: "/swinner",
      element: <Swinnwe />, // Sub Winner Route
    },
    {
      path: "/profitandloss",
      element: <Spnl />, // Sub Winner Route
    },
    {
      path: "/sreporter",
      element: <Sreporter />, // Sub Reporter Route
    },
    {
      path: "/ssales",
      element: <Ssales />, // Sub Sales Route
    },
    {
      path: "/tm",
      element: <TotalAmountDisplay />, // Total Amount Display Route
    },
    {
      path: "/results",
      element: <ResultsPage />, // Result Page for selected date and time
    },
    {
      path: "/reporter",
      element: <Reporter />, // Reporter Route
    },
    {
      path: "/netpay",
      element: <Netpay />, // Net Pay Route
    },
    {
      path: "/pnl",
      element: <Pnl />, // PnL Route
    },
    {
      path: "/countreport",
      element: <Countreport />, // Count Report Route
    },
    {
      path: "/newuser",
      element: <InUserManager />, // User Manager Route
    },
    {
      path: "/commission",
      element: <Usercommission />, // User Commission Route
    },
    {
      path: "/createuser",
      element: <CreateUser />, // Create User Route
    },
    {
      path: "/resulentry",
      element: <ResultEntry />, // Result Entry Route
    },

  ]);

  return <RouterProvider router={router} />;
};

export default App;
