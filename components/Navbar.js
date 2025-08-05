"use client";

import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button, Divider, Dropdown, Spin } from "antd";
import { DropdownIcon, HamburgerIcon, XIcon } from "./Icons";
import {
  CheckCircleBoldDuotone,
  Login3BoldDuotone,
  MentionCircleBoldDuotone,
  NotesBoldDuotone,
  UserBlockBoldDuotone,
  UserCircleLineDuotone,
} from "solar-icons";
import Link from "next/link";

// Fallback component to show while Navbar is loading
function NavbarFallback() {
  return (
    <div className="w-full px-6 md:px-10 py-5 relative shadow shadow-slate-200 sm:rounded-full bg-white/70 backdrop-blur-md flex justify-between items-center">
      <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}

// The main navbar content component that uses hooks requiring Suspense
function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [isTestsSectionVisible, setIsTestsSectionVisible] = useState(false);

  useEffect(() => {
    if (pathname === "/" && searchParams.get("scrollTo") === "tests") {
      setTimeout(() => {
        scrollToTests();
      }, 500);
    }

    if (!searchParams.get("scrollTo") && pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsTestsVisible(false);
      return;
    }

    const testsSection = document.getElementById("tests");
    if (!testsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsTestsSectionVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(testsSection);

    return () => observer.disconnect();
  }, [pathname]);

  const knowledge = [
    {
      key: "1",
      label: "Блог, зөвлөмжүүд",
      href: "/news",
    },
    { key: "2", label: "Нэр томьёоны тайлбар", href: "/glossary" },
  ];

  const handleKnowledgeClick = (item) => {
    if (isExpanded) {
      setIsExpanded(false);
    }

    if (item.href) {
      router.push(item.href);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const profile = [
    {
      key: "profile",
      label: (
        <Link
          href="/me"
          className="cursor-pointer font-semibold flex items-center gap-1.5"
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false);
            }
          }}
        >
          <NotesBoldDuotone width={18} height={18} className="text-main" />
          {session?.user?.role === 30 ? "Миний тестүүд" : "Өгсөн тестүүд"}
        </Link>
      ),
    },
    {
      key: "info",
      label: (
        <Link
          href="/me/account"
          className="cursor-pointer font-semibold flex items-center gap-1.5"
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false);
            }
          }}
        >
          <MentionCircleBoldDuotone
            width={18}
            height={18}
            className="text-blue-500"
          />
          Миний бүртгэл
        </Link>
      ),
    },
    {
      key: "signout",
      label: (
        <div
          onClick={handleSignOut}
          className="text-red-500 cursor-pointer font-semibold flex items-center gap-1.5"
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

  const scrollToTests = () => {
    const testsElement = document.getElementById("tests");
    if (testsElement) {
      const headerHeight = 8;
      const y = testsElement.offsetTop - headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleTestsClick = () => {
    // Close mobile menu if open
    if (isExpanded) {
      setIsExpanded(false);
    }

    if (pathname === "/") {
      scrollToTests();
    } else {
      router.push("/?scrollTo=tests");
    }
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
          <Link
            href="/"
            className="cursor-pointer"
            onClick={() => {
              if (isExpanded) {
                setIsExpanded(false);
              }
            }}
          >
            <Image
              src="/hire-logo.png"
              alt="Hire logo"
              width={80}
              height={26}
              priority
              draggable={false}
            />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="flex items-center gap-7">
          <div className="hidden md:flex space-x-6 items-center">
            <div>
              <div className="relative py-1">
                <Link
                  href="/about"
                  className="font-bold"
                  onClick={() => {
                    if (isExpanded) {
                      setIsExpanded(false);
                    }
                  }}
                >
                  Бидний тухай
                </Link>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                    pathname === "/about" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="relative py-1">
                <button className="font-bold" onClick={handleTestsClick}>
                  Тестүүд
                </button>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                    pathname === "/" && isTestsSectionVisible
                      ? "scale-x-100"
                      : "scale-x-0"
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
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                      pathname === "/news" || pathname === "/glossary"
                        ? "scale-x-100"
                        : "scale-x-0"
                    }`}
                  />
                </div>
                <div>
                  <DropdownIcon width={15} height={15} color={"#94a3b8"} />
                </div>
              </div>
            </Dropdown>

            <div>
              <div className="relative py-1">
                <Link
                  href="/contact"
                  className="font-bold"
                  onClick={() => {
                    if (isExpanded) {
                      setIsExpanded(false);
                    }
                  }}
                >
                  Бидэнтэй холбогдох
                </Link>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                    pathname === "/contact" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
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
                    {session?.user?.profile ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={session?.user?.profile}
                          alt={session?.user?.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-main/30 flex items-center justify-center">
                        <span className="text-main font-bold pt-0.5">
                          {session?.user?.name?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      <span className="hidden sm:block font-bold pt-0.5">
                        {session?.user.role === 20
                          ? session?.user?.name?.split(" ")[0]
                          : session?.user?.name}
                      </span>
                      <div
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full transition-all duration-300 origin-left ${
                          pathname.startsWith("/me")
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </div>
                    <div className="pt-0.5">
                      <DropdownIcon width={15} height={15} color={"#94a3b8"} />
                    </div>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button
                  onClick={() => {
                    if (isExpanded) {
                      setIsExpanded(false);
                    }
                  }}
                  className="nav-btn shadow-lg shadow-orange-600/50"
                >
                  Нэвтрэх
                </Button>
              </Link>
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
            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={handleTestsClick}
            >
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
              <div className="mt-4 px-3 flex flex-col gap-4 mb-1">
                {knowledge.map((item) => (
                  <div
                    key={item.key}
                    className={`transition-all duration-200 hover:translate-x-1 cursor-pointer font-bold ${
                      (pathname === "/news" && item.href === "/news") ||
                      (pathname === "/glossary" && item.href === "/glossary")
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
          <Link
            href="/about"
            className="cursor-pointer font-bold"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            Бидний тухай
          </Link>
          <Divider className="no-margin" />
          <Link
            href="/contact"
            className="cursor-pointer font-bold"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            Бидэнтэй холбогдох
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Main component with Suspense boundary
export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  );
}
