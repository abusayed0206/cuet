"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const predefinedRoutes = ["/dark", "/got", "/advice", "/foryou"];
    const lastRoute = localStorage.getItem("lastRoute");

    // Remove the last route from the options
    const availableRoutes = predefinedRoutes.filter(route => route !== lastRoute);

    // Select a random route from the available routes
    const randomRoute = availableRoutes[Math.floor(Math.random() * availableRoutes.length)];

    // Store the current route as the last route for future visits
    localStorage.setItem("lastRoute", randomRoute);

    // Redirect to the selected route
    router.push(randomRoute);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        Redirecting to your destination/ আপনার গন্তব্যে পাঠানো হচ্ছে।
      </div>
    </div>
  );
};

export default RedirectPage;
