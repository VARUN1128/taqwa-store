import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const PaymentProcessLoadScreen = ({ completed, paymentloadscreenmessage,setLoading,setCompleted }) => {
  const [showTick, setShowTick] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (completed) {
      setTimeout(() => {
        setShowTick(true);
      }, 500); // Adjust the delay as needed
    }
  }, [completed]);

  const handleGoToOrders = () => {
    setCompleted(false);
    setLoading(false);
    navigate('/orders');
  };


  return (
    <div className={`fixed inset-0 flex w-screen items-center justify-center p-4 ${completed ? 'bg-green-600' : 'bg-black/70'} z-20 transition-all duration-500`}>
      <div className={`w-full max-w-lg min-h-40 rounded-2xl ${completed ? 'bg-green-600' : 'bg-[#F9F9F9]/20 backdrop-blur-2xl'} text-white transition-all duration-500`}>
        <div className="text-3xl font-bold text-center mt-4">
          {completed ? 'Payment Successful' : 'Processing Payment'}
        </div>
        <div className="text-center mt-4 text-xl">
          {completed ? 'Your payment has been processed successfully.' : paymentloadscreenmessage}
        </div>
        <div className="flex justify-center items-center gap-4 mt-8 mb-4">
          {completed ? (
            showTick && (
                <div className='flex flex-col justify-center items-center gap-4 mt-8 mb-4 w-full '>               
                    <CheckCircleIcon style={{ color: "#fff", fontSize: 85 }} />
                    <div className="mt-5 min-w-[95%] max-w-full min-h-[6vh] max-h-[7vh] border-white/50 border-2 mb-2 rounded-lg flex flex-col text-white/90 justify-center text-center bg-white/10 backdrop-blur-md shadow-2xl cursor-pointer overflow-hidden" onClick={handleGoToOrders}>
          <div className="productsans-regular opacity-90 text-xl flex flex-row justify-center w-[90%] self-center gap-4 z-50 ">
            <span>Go to Orders</span>
          </div>
        </div>
                </div>
            )
          ) : (
            <CircularProgress style={{ color: "#fff" }} size={24} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessLoadScreen;
