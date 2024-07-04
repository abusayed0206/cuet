"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ui/Particle";
import { supabase } from "@/lib/supabaseClient";

export default function Component() {
  const [domain, setDomain] = useState<string>("without");
  const [cv, setCv] = useState<string>("without");
  const [blog, setBlog] = useState<string>("without");
  const [sourceCode, setSourceCode] = useState<string>("no");
  const [maintenance, setMaintenance] = useState<string>("no");
  const [shortName, setShortName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");

  const basePrice = 20;
  const cvPrice = cv === "with" ? 3 : 0;
  const blogPrice = blog === "with" ? 5 : 0;
  const sourceCodePrice = sourceCode === "yes" ? 5 : 0;
  const maintenancePrice = maintenance === "yes" ? 12 : 0;
  const totalPrice =
    basePrice + cvPrice + blogPrice + sourceCodePrice + maintenancePrice;

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
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-auto">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
              <Link
                href="/"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                হোম
              </Link>
              <Link
                href="/about"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                সম্পর্কে
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                ব্লগ
              </Link>
              <Link
                href="/contact"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                যোগাযোগ
              </Link>

              <Link
                href="/about_en"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                English
              </Link>
            </div>
          </nav>
          <Card className="max-w-lg mx-4 bg-white text-black p-6 rounded-lg shadow-lg overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-center">
                Portfolio Website Development Service
              </h2>
              <h3 className="text-sm md:text-base text-center italic">
                I will create a professional portfolio website to showcase your
                achievements, research papers, CV, blog, and more. I utilize the
                Next.js framework and Tailwind CSS for a modern, customizable
                design.
              </h3>

              <div className="mb-4 text-center ">
                <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                  Domain
                </label>
                <p>
                  I will buy domain for you and it will be billed separately. I
                  will purchase the domain for you and provide full access. You
                  will be responsible for renewals after the first year.
                </p>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                >
                  <option value="custom">
                    With custom domain (e.g., yourname.com, yourname.me)
                  </option>
                  <option value="without">Without custom domain</option>
                </select>
              </div>

              <div className="mb-4 text-center">
                <label className="block text-xl text-gray-700 font-bold mb-2">
                  CV
                </label>
                <p className="text-center mb-2">
                  I will create a professional CV using MS Word, LaTeX, or your
                  preferred format.
                </p>
                <select
                  value={cv}
                  onChange={(e) => setCv(e.target.value)}
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
                  I will integrate your Hashnode blog seamlessly into your
                  website (without Hashnode branding) and enable automatic
                  backups to GitHub.
                </p>
                <select
                  value={blog}
                  onChange={(e) => setBlog(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                >
                  <option value="with">With blog function – $5</option>
                  <option value="without">Without blog function – $0</option>
                </select>
              </div>

              <div className="mb-4 text-center ">
                <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                  Source Code
                </label>
                <p>
                  I will transfer the website's source code to your GitHub
                  account (either as a repository or zip file).
                </p>
                <select
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                >
                  <option value="yes">Yes – $5</option>
                  <option value="no">No – $0</option>
                </select>
              </div>

              <div className="mb-4 text-center ">
                <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                  Annual Maintenance
                </label>
                <p>
                  I will provide annual maintenance services, including domain
                  renewals reminder, security updates.
                </p>
                <select
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                >
                  <option value="yes">Yes – $12</option>
                  <option value="no">No – $0</option>
                </select>
              </div>

              <div className="mb-4 text-center ">
                <label className="block text-center text-xl text-gray-700 font-bold mb-2">
                  Short Name
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
                  WhatsApp Phone Number
                </label>
                <p className="text-center mb-2">Where I can reach you.</p>

                <div className="flex items-center justify-center">
                  {" "}
                  <span className="mr-2">+88</span>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-full text-center min-w-fit"
                    placeholder="09696563931"
                    required
                  />
                </div>
              </div>

              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold">
                  Total Price: ${totalPrice}
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
          </Card>
        </div>
      </div>
    </>
  );
}
