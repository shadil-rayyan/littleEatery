"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch logo path from data.json
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/data.json");
        const json = await res.json();
        setLogoSrc(json.images.logo);
      } catch (err) {
        console.error("Failed to load logo from data.json", err);
      }
    };

    fetchLogo();
  }, []);

  return (
    <nav className="w-full border-gray-200 bg-white relative z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto py-6 px-4 md:py-10">
        {/* Logo and Restaurant Name */}
        <div className="flex items-center font-poppins font-bold text-xl md:text-[26px] relative px-8 md:p-0 md:ml-0 ml-10">
          <div className="absolute left-[-45px] md:left-[-80px] -top-[22px]">
            {logoSrc && (
              <Image
                src={logoSrc}
                alt="Logo"
                width={70}
                height={70}
                objectFit="contain"
              />
            )}
          </div>
          <div className="font-montserrat">The Little Eatery</div>
        </div>

        {/* Desktop Menu Button */}
        <button className="hidden md:block">
          <div
            onClick={() => {
              router.push("./menu");
            }}
            className="w-[117px] h-[45px] bg-[#EA6D27] rounded-tl-lg rounded-br-lg text-white font-davidLibre flex items-center justify-center text-[15.5px] hover:bg-[#df631b] drop-shadow-lg"
          >
            MENU
          </div>
        </button>

        {/* Mobile Hamburger Button */}
        <button onClick={toggleMenu} className="md:hidden p-2 text-gray-600 ml-auto">
          <div
            onClick={() => {
              router.push("./menu");
            }}
            className="w-[117px] h-[45px] bg-[#EA6D27] rounded-tl-lg rounded-br-lg text-white font-davidLibre flex items-center justify-center text-[15.5px] hover:bg-[#df631b] drop-shadow-lg"
          >
            MENU
          </div>
        </button>
      </div>

      {/* Background Circles */}
      <div className="absolute -z-20 h-[750px] w-[750px] border border-[#101A2433] rounded-full -top-[353.58px] -left-[399.69px]"></div>
      <div
        className="absolute h-[750px] w-[750px] border border-[#101A2433] rounded-full -z-20 -top-[316.35px] -left-[483px]"
        style={{ transform: "rotate(17.41deg)" }}
      ></div>
      <div className="absolute -z-20 h-[750px] w-[750px] border border-[#101A2433] rounded-full -top-[326.58px] -left-[368.69px]"></div>
    </nav>
  );
};

export default Navbar;
