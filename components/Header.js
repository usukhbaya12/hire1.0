import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";

const Header = ({ assessment }) => {
  const { data: session } = useSession();

  return (
    <nav className="px-6 md:pl-10 md:pr-8 py-5 relative shadow shadow-slate-200 sm:rounded-full bg-white/70 backdrop-blur-md">
      <div className="flex justify-between items-center gap-4">
        <div>
          <Image
            src="/hire-logo.png"
            alt="Hire logo"
            width={80}
            height={26}
            priority
            draggable={false}
          />
        </div>
        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5 justify-end">
            <div
              className={`w-8 h-8 rounded-full ${
                assessment ? "md:bg-main/30 bg-white" : "bg-main/30"
              } flex items-center justify-center`}
            >
              <span
                className={`font-bold pt-0.5 ${
                  assessment ? "md:text-main text-white" : "text-main"
                }`}
              >
                {session?.user?.name?.[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
