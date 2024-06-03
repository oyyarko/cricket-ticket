import React, { useEffect, useState } from "react";
import Ground from "./components/Ground/Ground";
import { useDispatch } from "react-redux";
import { fetchBlocks } from "./redux/groundSlice";
import { Toaster } from "react-hot-toast";
import socket from "./services/socket";

const App = () => {
  const dispatch = useDispatch();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.on("userCountUpdate", (count) => {
      setUserCount(count);
    });
    
    return () => {
      socket.off("userCountUpdate");
    };
  }, []);

  useEffect(() => {
    dispatch(fetchBlocks());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center max-sm:p-4">
      <div className="text-center">
        <h1 className="text-indigo-600 z-20 font-medium text-2xl">
          Currently Active User : {userCount}
        </h1>
        <Ground />
      </div>
      <Toaster />
    </div>
  );
};

export default App;
