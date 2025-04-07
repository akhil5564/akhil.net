import  { FC } from 'react';
import './more.css'
import { Link } from 'react-router-dom';

interface MoreProps {
  
}

const More: FC<MoreProps> = ({}) => {
  return (
    <>


      <div className='usermanage'>
        <h2> <Link to='/newuser'>USER MANAGE</Link></h2>
      </div>

<div  className='riskreport'>
    <h2>RISK REPORT</h2>
</div>



<div className='timesetting'>
    <h2>TIME SETTING</h2>
</div>

<div className='ticketlimits'>
   <h2>TICKET LIMITS</h2>
</div>

<div className='Outdealerfilters'>
    <h2>OUTDEALER FILTTERS</h2>
</div>

<div className='resultentry'>

    <Link to='/resulentry'>    <h2>RESULT ENTRY</h2>
    </Link>
</div>

    <div className='sendtooutdealer'>
        <h2>SEND TO OUTDEALER</h2>
    </div>

    <div className='outdealersales'>
        <h2>OUTDEALER SALES</h2>
    </div>

    <div className='outdealerwinning'>
        <h2>OUTDEALER WINNING</h2>
    </div>

    <div className='outdealerpnl'>
        <h2>OUTDEALER PROFIT AND LOSS</h2>
    </div>

    <div className='pofitreport'>
        <h2>PROFIT REPORT</h2>
    </div>
    </>
  );
};

export default More;