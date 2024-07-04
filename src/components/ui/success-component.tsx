"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const SuccessComponent = () => {
  useEffect(() => {
    toast.success("Congress");
  }, []);
  return (
    <p className="bg-green-700 text-white px-4 py-2 rounded-lg">
      Payment successful
    </p>
  );
};

export default SuccessComponent;
