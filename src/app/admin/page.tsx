"use client"
// pages/admin-dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  domain: boolean;
  cv: boolean;
  blog: boolean;
  source_code: boolean;
  maintenance: boolean;
  short_name: string;
  whatsapp_number: string;
  fee_usd: number;
  fee_bdt: number;
  paid: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("portfolio_requests").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolio_requests").delete().eq("id", id);
    if (error) {
      console.error("Error deleting order:", error);
    } else {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    // Add edit functionality here
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>Short Name:</strong> {order.short_name}</p>
            <p><strong>WhatsApp Number:</strong> {order.whatsapp_number}</p>
            <p><strong>Domain:</strong> {order.domain ? "Yes" : "No"}</p>
            <p><strong>CV:</strong> {order.cv ? "Yes" : "No"}</p>
            <p><strong>Blog:</strong> {order.blog ? "Yes" : "No"}</p>
            <p><strong>Source Code:</strong> {order.source_code ? "Yes" : "No"}</p>
            <p><strong>Maintenance:</strong> {order.maintenance ? "Yes" : "No"}</p>
            <p><strong>Fee USD:</strong> ${order.fee_usd}</p>
            <p><strong>Fee BDT:</strong> ৳{order.fee_bdt}</p>
            <p><strong>Paid:</strong> {order.paid ? "Yes" : "No"}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <div className="flex justify-between mt-4">
              <Button onClick={() => handleEdit(order.id)}>Edit</Button>
              <Button onClick={() => handleDelete(order.id)} className="bg-red-500">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
