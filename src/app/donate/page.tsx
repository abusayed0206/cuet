"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";
import ParticleBackground from "@/components/ui/Particle";

export default function Payment() {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0); // State to hold payment amount
  const [loading, setLoading] = useState(false); // State to handle loading status

  const handleBkashPayment = async () => {
    setLoading(true); // Start loading animation
    const amountAsString = paymentAmount.toString();

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amountAsString }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.bkashURL;
      } else {
        console.error("Failed to initiate Bkash payment");
      }
    } catch (error) {
      console.error("Error occurred during Bkash payment initiation", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  const toggleBankDetails = () => {
    setShowBankDetails(!showBankDetails);
  };

  const bankDetails = {
    accountName: "MD ABU SAYED",
    accountNumber: "1053518970001",
    bankName: "BRAC Bank PLC",
    branchAddress: "CDA AVENUE BRANCH",
    routingNumber: "060151481",
    swiftCode: "BRAKBDDH",
  };

  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-2">
              <Link href="/" className="px-3 py-1 text-white mb-2 md:mb-0">
                প্রথম পাতা/HomePage
              </Link>
            </div>
          </nav>
          <div className="w-full max-w-4xl mx-auto">
            <Card className="bg-white text-black mx-5 overflow-y-auto max-h-[80vh]">
              <CardHeader className="flex flex-col items-center pt-6">
                <CardTitle className="text-center text-xl font-bold">
                  Donate via bKash(bKash Payment)
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Please input the amount you want to pay via bKash Payment.
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex flex-col md:flex-row justify-around items-center py-2">
                <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-x-4 w-full md:w-auto">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(parseFloat(e.target.value))
                    }
                    className="w-28 md:w-32 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full outline-none focus:scale-110 transition"
                    placeholder="Enter the amount you want to donate"
                  />
                  <button
                    onClick={handleBkashPayment}
                    className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Donate Now"
                    )}
                  </button>
                </div>
              </CardFooter>

              <CardHeader className="flex flex-col items-center pt-6">
                <CardTitle className="text-center text-xl font-bold">
                  Donate via bKash App
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Please use the below QR code to scan from your bKash App and
                  donate.
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-around py-2">
                <Image
                  src="/qr.png"
                  alt="bKash QR Code"
                  width={200}
                  height={200}
                />
              </CardFooter>

              <CardHeader className="flex flex-col items-center pt-6">
                <CardTitle className="text-center text-xl font-bold">
                  Bank Payment
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  You can donate via bank transfer using the details below. For a
                  smooth transaction, please use EFT instead of NPSB channel. 
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-around py-2">
                <p className="mt-4 text-xl group bg-gray-900 text-white px-7 py-3 inline-flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition ml-4">
                  <button onClick={toggleBankDetails}>Bank Account Details</button>
                </p>
              </CardFooter>
              {showBankDetails && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <p>
                    <strong>Account Holder Name:</strong>{" "}
                    {bankDetails.accountName}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {bankDetails.accountNumber}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {bankDetails.bankName}
                  </p>
                  <p>
                    <strong>Bank Branch:</strong> {bankDetails.branchAddress}
                  </p>
                  <p>
                    <strong>SWIFT Code:</strong> {bankDetails.swiftCode}
                  </p>
                  <p>
                    <strong>Routing Number:</strong> {bankDetails.routingNumber}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
