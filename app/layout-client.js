"use client";

import { usePathname } from "next/navigation";
import Zoom from "@/components/Zoom";
import { Provider } from "@/components/Provider";
import Navbar from "@/components/Navbar";
import { AssessmentProvider } from "./utils/providers";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/auth/") || pathname.includes("/exam/");

  return (
    <>
      <Zoom />
      <Provider>
        {!hideNavbar && (
          <div className="fixed top-0 sm:top-4 w-full 2xl:px-72 xl:px-24 lg:px-16 md:px-12 z-[100]">
            <Navbar />
          </div>
        )}
        <div className={`relative ${!hideNavbar ? "top-16" : ""}`}>
          <AssessmentProvider>{children}</AssessmentProvider>
        </div>
      </Provider>
    </>
  );
}
