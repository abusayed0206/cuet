"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ui/Particle";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CopyToClipboardButton from "@/components/ui/CopyToClipboardButton";

export default function Component() {
  const router = useRouter();

  const [domain, setDomain] = useState<boolean>(false);
  const [cv, setCv] = useState<boolean>(false);
  const [blog, setBlog] = useState<boolean>(false);
  const [sourceCode, setSourceCode] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<boolean>(false);
  const [shortName, setShortName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [feeUsd, setFeeUsd] = useState<number>(0);
  const [feeBdt, setFeeBdt] = useState<number>(0);
  const [paid, setPaid] = useState<boolean>(false);

  const basePrice = 20;
  const cvPrice = cv ? 3 : 0;
  const blogPrice = blog ? 5 : 0;
  const sourceCodePrice = sourceCode ? 5 : 0;
  const maintenancePrice = maintenance ? 12 : 0;
  const totalPrice =
    basePrice + cvPrice + blogPrice + sourceCodePrice + maintenancePrice;
  const totalPriceInBDT = totalPrice * 120;

  useEffect(() => {
    setFeeUsd(totalPrice);
    setFeeBdt(totalPriceInBDT);
  }, [cv, blog, sourceCode, maintenance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.from("portfolio_requests").insert([
      {
        domain,
        cv,
        blog,
        source_code: sourceCode,
        maintenance,
        short_name: shortName,
        whatsapp_number: whatsappNumber,
        fee_usd: feeUsd,
        fee_bdt: feeBdt,
        paid: false,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
      // Show success message and payment options
      showSuccessMessage();
    }
  };

  const showSuccessMessage = () => {
    // Scroll to top of the page after form submission
    window.scrollTo(0, 0);
    // Display success message
    setSubmitted(true);
  };

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<any>({
    accountName: "MD ABU SAYED",
    accountNumber: "1053518970001",
    bankName: "BRAC Bank PLC",
    branchAddress: "CDA AVENUE BRANCH",
    routingNumber: "060151481",
    swiftCode: "BRAKBDDH",
  });

  const handleBkashPayment = async (amount: number) => {
    // Convert amount to string before sending
    const amountAsString = amount.toString();

    // Handle Bkash payment logic here
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amountAsString }), // Send amount as string
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = data.bkashURL; // Redirect to Bkash payment URL
    } else {
      console.error("Failed to initiate Bkash payment");
    }
  };

  const toggleBankDetails = () => {
    setShowBankDetails(!showBankDetails);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
          <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
            <Link
              href="/en"
              className="whitespace-nowrap px-3 py-1 rounded-full transform transition duration-300 ease-in-out hover:scale-110"
            >
              Home
            </Link>
            <Link
              href="/about_en"
              className="whitespace-nowrap px-3 py-1 rounded-full transform transition duration-300 ease-in-out hover:scale-110"
            >
              About
            </Link>
            <Link
              href="/blog_en"
              className="whitespace-nowrap px-3 py-1 rounded-full transform transition duration-300 ease-in-out hover:scale-110"
            >
              Blog
            </Link>
            <Link
              href="/contact_en"
              className="whitespace-nowrap px-3 py-1 rounded-full transform transition duration-300 ease-in-out hover:scale-110"
            >
              Contact
            </Link>
          </div>
        </nav>
        <div className="w-full max-w-4xl mx-auto">
          <Card className="bg-white text-black mx-5 overflow-y-auto max-h-[80vh]">
            <div className="p-4 md:p-6 lg:p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-center">
                    Portfolio Website Development Service
                  </h2>
                  <h3 className="text-sm md:text-base text-center italic">
                    I will create a professional portfolio website to showcase
                    your achievements, research papers, CV, blog, and more. I
                    utilize the NextJS framework and Tailwind CSS for a modern,
                    customizable design. Besides I can design website by
                    Wordpress but you may need external paid hosting service.
                  </h3>

                  <div className="mb-4 text-center">
                    <label className="block text-xl text-gray-700 font-bold mb-2">
                      Domain
                    </label>
                    <p className="text-sm md:text-base mb-2">
                      I will buy domain for you and it will be billed
                      separately. I will purchase the domain for you and provide
                      full access. You will be responsible for renewals after
                      the first year.
                    </p>
                    <select
                      value={domain ? "with" : "without"}
                      onChange={(e) => setDomain(e.target.value === "with")}
                      className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-full text-center"
                    >
                      <option value="with">
                        With custom domain (e.g., yourname.com, yourname.me)
                      </option>
                      <option value="without">
                        Without custom domain (e.g., yourname.vercel.app, yourname.github.io)
                      </option>
                    </select>
                  </div>

                  <div className="mb-4 text-center">
                    <label className="block text-xl text-gray-700 font-bold mb-2">
                      CV
                    </label>
                    <p className="text-center mb-2">
                      I will create a professional CV using MS Word, LaTeX, or
                      your preferred format.
                    </p>
                    <select
                      value={cv ? "with" : "without"}
                      onChange={(e) => setCv(e.target.value === "with")}
                      className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                    >
                      <option value="with">With CV (PDF) – $3</option>
                      <option value="without">Without CV – $0</option>
                    </select>
                  </div>

                  <div className="mb-4 text-center ">
                    <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                      Blog
                    </label>
                    <p>
                      I will integrate your blog(Hosted on Hahsnode:free, any
                      other platform) seamlessly into your website (without
                      Hashnode branding) and enable automatic backups to GitHub.
                    </p>
                    <select
                      value={blog ? "with" : "without"}
                      onChange={(e) => setBlog(e.target.value === "with")}
                      className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                    >
                      <option value="with">With blog function – $5</option>
                      <option value="without">
                        Without blog function – $0
                      </option>
                    </select>
                  </div>

                  <div className="mb-4 text-center ">
                    <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                      Source Code
                    </label>
                    <p>
                      {`I will transfer the website's source code to your GitHub/GitLab account (either as a repository or zip file).`}
                    </p>

                    <select
                      value={sourceCode ? "with" : "without"}
                      onChange={(e) => setSourceCode(e.target.value === "with")}
                      className="px-3 py-2 bordeFr border-gray-300 rounded-full text-center min-w-fit"
                    >
                      <option value="with">Yes – $5</option>
                      <option value="without">No – $0</option>
                    </select>
                  </div>

                  <div className="mb-4 text-center ">
                    <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                      Annual Maintenance
                    </label>
                    <p>
                      I will provide annual maintenance services, including
                      domain renewals reminder, security updates.
                    </p>
                    <select
                      value={maintenance ? "with" : "without"}
                      onChange={(e) =>
                        setMaintenance(e.target.value === "with")
                      }
                      className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                    >
                      <option value="with">Yes – $12</option>
                      <option value="without">No – $0</option>
                    </select>
                  </div>

                  <div className="mb-4 text-center ">
                    <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                      placeholder="Enter your short name"
                      required
                    />
                  </div>

                  <div className="mb-4 text-center">
                    <label className="block text-xl text-gray-700 font-bold mb-2">
                      WhatsApp Number
                    </label>
                    <p className="text-center mb-2">Where I can reach you.</p>

                    <div className="flex items-center justify-center">
                      {" "}
                      <span className="mr-2">+88</span>
                      <input
                        type="number"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                        placeholder="015555555555"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-bold">
                      Total Charge: ${totalPrice} [Tk {totalPriceInBDT}]
                    </h3>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-3 py-2 rounded-full text-center min-w-fit"
                    >
                      Submit Order
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Your order has been placed successfully.
                  </h2>
                  <p className="text-lg">
                    Fee: ${totalPrice} (Tk {totalPriceInBDT})
                  </p>
                  <p className="mt-4">Payment Options</p>
                  <p className="text-center py-4">
                    <Button
                      onClick={() => handleBkashPayment(totalPriceInBDT)}
                      className="mr-2"
                    >
                      <Image
                        src="/bkash.png"
                        alt="bKash Payment"
                        width={200}
                        height={50}
                        priority={true}
                      />
                    </Button>
                  </p>
                  <p className="mt-4 text-xl group bg-gray-900 text-white px-7 py-3 inline-flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition ml-4">
                    <Button onClick={toggleBankDetails}>Bank Transfer</Button>
                  </p>
                  <p className="mt-4">
                    <strong>Payment Instructions</strong>
                    <p>
                      For overseas clients, please use the bank transfer option.{" "}
                    </p>
                  </p>

                  {showBankDetails && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                      <p>
                        <strong>Account Holder Name:</strong>{" "}
                        {bankDetails.accountName}
                      </p>
                      <p>
                        <strong>
                          Account Number: 1053518970001
                          <CopyToClipboardButton
                            text={bankDetails.accountNumber}
                          />
                        </strong>
                        <strong>Bank Name:</strong> {bankDetails.bankName}
                      </p>
                      <p>
                        <strong>Bank Branch:</strong>{" "}
                        {bankDetails.branchAddress}
                      </p>
                      <p>
                        <strong>SWIFT Code:</strong> {bankDetails.swiftCode}
                      </p>
                      <p>
                        <strong>Routing Number:</strong>{" "}
                        {bankDetails.routingNumber}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
