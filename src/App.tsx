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

// Create the router with createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Login Page Route
  },
    {
      path: "/counts",
      element: <InCount />, // Login Page Route
    },
  {
    path: "/home",
    element: <Home />, // Home Page Route
  },
  {
    path: "/shome",
    element: <Shome />, // Home Page Route
  },
  {
    path: "/snavbar",
    element: <Snavbar handlePaste={function (): void {
      throw new Error('Function not implemented.');
    } } />, // Home Page Route
  },
  {
    path: "/result",
    element: <Result/>, // Home Page Route
  },
  {
    path: "/sales",
    element: <Salesreport />, // Sales Report Route
  },
  
  {
    path: "/winning",
    element: <Winning  />, // Winner's Report Route
  },
  {
    path: "/winner",
    element: <Winner  />, // Winner's Report Route
  },

  {
    path: "/more",
    element: <More />, // More Route
  },
 
  {
    path: "/swinner",
    element: <Swinnwe />, // More Route

  },
  {
    path: "/sreporter",
    element: <Sreporter />, // More Route
  },
  {
    path: "/ssales",
    element: <Ssales />, // More Routed TotalAmountDisplay
  },
  {
    path: "/tm",
    element: <TotalAmountDisplay />, // More Route
  },
  {
    path: "/reporter",
    element: <Reporter />, // More Route
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
    element: <InUserManager />, // Net Pay Route
  },

  
  {
    path: "/comssission",
    element: <Usercommission />, // Net Pay Route
  },
  {
    path: "/createuser",
    element: <CreateUser />, // Net Pay Route
  },
  {
    path: "/resulentry",
    element: <ResultEntry />, // Net Pay Route
  },
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} /> // Using the router constant here
  );
};

export default App;
