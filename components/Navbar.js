"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button, Divider, Dropdown } from "antd";
import { DropdownIcon, HamburgerIcon, XIcon } from "./Icons";
import { Login3BoldDuotone } from "solar-icons";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const knowledge = [
    {
      key: "1",
      label: "Блог",
      href: "/news",
    },
    { key: "2", label: "Зөвлөмжүүд" },
    { key: "3", label: "Нэр томьёоны тайлбар" },
  ];

  const handleKnowledgeClick = (item) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const profile = [
    {
      key: "userInfo",
      label: (
        <div className="px-2 py-1" onClick={() => router.push("/me")}>
          <div className="font-bold">
            {session?.user.role === 30
              ? session?.user?.name
              : session?.user?.lastname?.[0] + "." + session?.user?.firstname}
          </div>
          <div className="text-gray-700 font-medium">
            {session?.user?.email}
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "signout",
      label: (
        <div
          onClick={handleSignOut}
          className="text-red-500 cursor-pointer px-2 font-semibold flex items-center gap-1.5"
        >
          <Login3BoldDuotone width={18} height={18} />
          Гарах
        </div>
      ),
    },
  ];

  const onExpand = () => {
    setIsExpanded(!isExpanded);
    setDropdown(null);
  };

  const toggleDropdown = (type) => {
    setDropdown(dropdown === type ? null : type);
  };

  return (
    <nav className="w-full px-6 md:px-10 py-5 relative shadow shadow-slate-200 sm:rounded-full bg-white/70 backdrop-blur-md">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center">
            <button onClick={onExpand}>
              {isExpanded ? <XIcon /> : <HamburgerIcon />}
            </button>
          </div>
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/hire-logo.png"
              alt="Hire logo"
              width={80}
              height={26}
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex space-x-8 items-center">
            <div>
              <div className="relative py-1">
                <button
                  className="font-bold"
                  onClick={() => {
                    router.push("/#tests");
                    // Smooth scroll with offset
                    const element = document.getElementById("tests");
                    if (element) {
                      const yOffset = -100; // Adjust this value for desired spacing
                      const y =
                        element.getBoundingClientRect().top +
                        window.pageYOffset +
                        yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  Тестүүд
                </button>
                {/* Active indicator for Tests section */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                    pathname === "/" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            </div>

            <Dropdown
              menu={{
                items: knowledge,
                onClick: ({ key }) => {
                  const item = knowledge.find((k) => k.key === key);
                  handleKnowledgeClick(item);
                },
              }}
              trigger={["hover"]}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center gap-1.5 cursor-pointer">
                <div className="relative py-1">
                  <span className="font-bold">Мэдлэгийн сан</span>
                  {/* Active indicator for Blog page */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                      pathname === "/news" ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </div>
                <div>
                  <DropdownIcon width={15} height={15} color={"#94a3b8"} />
                </div>
              </div>
            </Dropdown>

            <div>
              <button
                onClick={() => router.push("/contact")}
                className="font-bold"
              >
                Бидэнтэй холбогдох
              </button>
            </div>
          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-3 justify-end">
            {session?.user ? (
              <div>
                <Dropdown
                  arrow
                  menu={{
                    items: profile,
                  }}
                  trigger={["hover"]}
                  placement="bottomRight"
                >
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-main/30 flex items-center justify-center">
                      <span className="text-main font-bold pt-0.5">
                        {session?.user?.name?.[0]}
                      </span>
                    </div>
                    <span className="hidden sm:block font-bold pt-0.5">
                      {session?.user.role === 20
                        ? session?.user?.name?.split(" ")[0]
                        : session?.user?.name}
                    </span>
                    <div className="pt-0.5">
                      <DropdownIcon width={15} height={15} color={"#94a3b8"} />
                    </div>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="nav-btn shadow-lg shadow-orange-600/50"
                >
                  Нэвтрэх
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3 mt-4 px-[6px]">
          <div>
            <div className="flex items-center gap-[6px] cursor-pointer">
              <span className="font-bold">Тестүүд</span>
            </div>
          </div>
          <Divider className="no-margin" />
          <div>
            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={() => toggleDropdown("knowledge")}
            >
              <span className="font-bold">Мэдлэгийн сан</span>
              <DropdownIcon
                width={15}
                height={15}
                color={"#94a3b8"}
                rotate={dropdown === "knowledge" ? 180 : 0}
              />
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                dropdown === "knowledge" ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="mt-3 px-5 flex flex-col gap-3">
                {knowledge.map((item) => (
                  <div
                    key={item.key}
                    className={`transition-all duration-200 hover:translate-x-1 cursor-pointer font-semibold ${
                      pathname === "/news" && item.href === "/news"
                        ? "text-main"
                        : ""
                    }`}
                    onClick={() => handleKnowledgeClick(item)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Divider className="no-margin" />
          <div className="cursor-pointer font-bold">Бидэнтэй холбогдох</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
