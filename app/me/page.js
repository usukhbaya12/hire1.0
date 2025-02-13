"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  RoundDoubleAltArrowRightBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import Image from "next/image";

const Profile = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-60 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-16 z-[3]">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full relative p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-main/5"></div>
            <div className="absolute top-0 right-0 w-60 h-60">
              <Image
                src="/brain-home.png"
                width={128}
                height={128}
                alt="Brain decoration"
                className="w-full h-full object-contain opacity-10"
              />
            </div>

            <div className="relative flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-16 min-h-16 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5">
                    {session?.user?.name?.[0]}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {session?.user?.firstname}
                </div>
                <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                  <span className="font-medium">{session?.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
            <div className="relative flex justify-between items-center gap-4 sm:gap-5">
              <div className="relative flex items-center gap-4 sm:gap-5">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative min-w-16 min-h-16 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                    <div className="text-main pt-1.5">
                      <Wallet2BoldDuotone width={40} height={40} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Үлдэгдэл</span>
                  </div>
                  <div className="font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {session?.user?.wallet}₮
                  </div>
                </div>
              </div>
              <button className="relative group pl-5 pr-3.5 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-1">
                  <span>Цэнэглэх</span>
                  <RoundDoubleAltArrowRightBoldDuotone width={20} height={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
