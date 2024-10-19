import { Button } from "@/components/button";
import Link from "next/link";
import { signOut } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

const Navbar = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="bg-gray-900 text-white py-4 rounded-md shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        {/* Flex container for large devices */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          {/* CUET Logo */}
          <div className="flex justify-center lg:justify-start items-center">
            <Link href="/">
              <Image
                src="/CUET_logo.png" // Replace with your actual logo path
                alt="CUET Logo"
                width={50}
                height={50}
                className="mr-2"
              />
            </Link>
            <span className="text-xl font-bold">CUET Profile</span>
          </div>

          {/* Profile button always visible with dropdown for actions */}
          <div className="flex justify-center lg:justify-end space-x-4">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    Profile
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent sideOffset={5}>
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href="/profile">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0" asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-sm w-full"
                          type="button" // Prevent form submission
                          onClick={signOut}
                        >
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link className="cursor-pointer" href="/login">
                        Login
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Display Logout button directly on larger screens */}
            {user && (
              <div className="hidden lg:flex">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={signOut}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
