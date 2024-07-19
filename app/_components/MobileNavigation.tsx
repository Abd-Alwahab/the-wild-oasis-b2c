"use client";

import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger icon
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import Link from "next/link";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

type Props = {
  session: Session | null;
};
function MobileNavigation({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-transparent w-fit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="text-gray-300 hover:text-white focus:outline-none z-20 fixed top-9 right-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <AiOutlineClose size={24} /> // Close icon when open
            ) : (
              <GiHamburgerMenu size={24} /> // Hamburger icon when closed
            )}
          </button>
        </div>

        {isOpen && (
          <div className=" mt-2 space-y-1 fixed top-0 left-0 w-screen h-screen bg-primary-900 z-10">
            <ul className="flex flex-col gap-8 h-full items-center justify-center">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent-400 transition-colors text-2xl"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/cabins"
                  className="hover:text-accent-400 transition-colors text-2xl"
                >
                  Cabins
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent-400 transition-colors text-2xl"
                >
                  About
                </Link>
              </li>
              <li>
                {session?.user ? (
                  <Link
                    href="/account"
                    className="hover:text-accent-400 transition-colors flex gap-4 justify-center"
                  >
                    <img
                      src={session.user.image ?? ""}
                      alt="user image"
                      className="w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                      width={32}
                      height={32}
                    />
                    <span className="text-2xl">Guest area</span>
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    className="hover:text-accent-400 transition-colors text-2xl"
                  >
                    Guest area
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default MobileNavigation;
