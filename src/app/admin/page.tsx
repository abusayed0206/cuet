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

export default function SuperAdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from("portfolio_requests").select("*");
        if (error) throw error;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("portfolio_requests").delete().eq("id", id);
      if (error) throw error;
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Error deleting order");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
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
              <h2 className="text-xl md:text-2xl font-bold text-center">Super Admin Dashboard</h2>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg bg-gray-50">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Domain:</strong> {order.domain ? "Yes" : "No"}</p>
                    <p><strong>CV:</strong> {order.cv ? "Yes" : "No"}</p>
                    <p><strong>Blog:</strong> {order.blog ? "Yes" : "No"}</p>
                    <p><strong>Source Code:</strong> {order.source_code ? "Yes" : "No"}</p>
                    <p><strong>Maintenance:</strong> {order.maintenance ? "Yes" : "No"}</p>
                    <p><strong>Short Name:</strong> {order.short_name}</p>
                    <p><strong>WhatsApp Number:</strong> {order.whatsapp_number}</p>
                    <p><strong>Fee USD:</strong> ${order.fee_usd}</p>
                    <p><strong>Fee BDT:</strong> Tk {order.fee_bdt}</p>
                    <p><strong>Paid:</strong> {order.paid ? "Yes" : "No"}</p>
                    <div className="mt-4 flex justify-between">
                      <Button onClick={() => handleEdit(order.id)}>Edit</Button>
                      <Button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
