import React, { useEffect } from "react";
import Ground from "./components/Ground/Ground";
import { useDispatch } from "react-redux";
import { fetchBlocks } from "./redux/groundSlice";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchBlocks());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center max-sm:p-4">
      {/* <div className="text-center">
        <h1 className="text-indigo-600 font-semibold text-2xl">
          Cricket ticket booking app
        </h1> */}
        <Ground />
      {/* </div> */}
      <Toaster />
    </div>
  );
};

export default App;
