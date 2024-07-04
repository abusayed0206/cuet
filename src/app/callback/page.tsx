"use client";
import CallBackComponent from "@/components/ui/callback-component";
import React, { Suspense } from "react";

const CallBackPage = () => {
  return (
    <Suspense>
      <CallBackComponent />
    </Suspense>
  );
};

export default CallBackPage;
