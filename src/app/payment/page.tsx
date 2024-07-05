"use client";
import React, { useState } from "react";
import { GrLinkedin } from "react-icons/gr";
import { VscGithubInverted } from "react-icons/vsc";
import { ImProfile } from "react-icons/im";
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

  const handleBkashPayment = async () => {
    const amountAsString = paymentAmount.toString();

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
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
              <Link
                href="/"
                className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
              >
                প্রথম পাতা/HomePage
              </Link>
            </div>
          </nav>
          <div className="mx-6 rounded-2xl max-w-screen-md bg-white text-black">
            <Card className="bg-white text-black ">
              <CardHeader className="flex flex-col items-center pt-6">
                <CardTitle className="text-center text-xl font-bold">
                  bKash Payment(Manual Payment)
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Please input the amount you want to pay via bKash Payment or
                  use the below QR code to scan from your bKahs App and pay.
                  Also, you can transfer the amount to the below bank account.
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
              <CardFooter className="flex flex-col md:flex-row justify-around items-center py-2">
                <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-x-4 w-full md:w-auto">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(parseFloat(e.target.value))
                    }
                    className="w-28 md:w-32 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full outline-none focus:scale-110 transition"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={handleBkashPayment}
                    className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Pay Now
                  </button>
                </div>
              </CardFooter>

              <CardFooter className="flex justify-around py-2">
                <p className="mt-4 text-xl group bg-gray-900 text-white px-7 py-3 inline-flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition ml-4">
                  <button onClick={toggleBankDetails}>Bank Transfer</button>
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
