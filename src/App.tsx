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
import SelectDateAndTime from './Main/SelectDateAndTime';
import DateTimeFilter from './Sub/DateTimeFilter';
import ResultsPage from './Main/Result';

// Create the router with createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Login Page Route
  },
  {
    path: "/counts",
    element: <InCount />, // Count Route
  },
  {
    path: "/home",
    element: <Home />, // Home Page Route
  },
  {
    path: "/shome",
    element: <Shome />, // Sub Home Page Route
  },
  {
    path: "/snavbar",
    element: <Snavbar handlePaste={function (): void { throw new Error('Function not implemented.'); }} />, // Sub Navbar Route
  },
  {
    path: "/result",
    element: <Result />, // Result Route
  },
  {
    path: "/sdate",
    element: <Sdate />, // Result Route
  },
  {
    path: "/sales",
    element: <Salesreport />, // Sales Report Route
  },
  {
    path: "/winning",
    element: <Winning onSubmit={function (_fromDate: string, _toDate: string, _time: string): void {
      throw new Error('Function not implemented.');
    } } />, // Winning Report Route
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
    element: <Result />, // Result Page for selected date and time
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
    path: "/prof",
    element: <ResultsPage />, // Net Pay Route
  },
  {
    path: "/date",
    element: <Date />, // Net Pay Route
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
  {
    path: "/datefilter",
    element: <DateTimeFilter />, // DateTimeFilter component now in Sub folder
  },
  {
    path: "/select-date-time", // Page for selecting date and time
    element: <SelectDateAndTime />, // Select Date and Time Page
  },
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} /> // Using the router constant here
  );
};

export default App;
