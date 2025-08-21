"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "antd";
import Link from "next/link";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <title>404 | Hire.mn</title>
      {/* <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div> */}
      <div className="flex items-center justify-center relative z-10 px-6">
        <div className="max-w-xl w-full">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
          >
            <div className="relative w-[250px] h-[140px] sm:w-[320px] sm:h-[180px]">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30,200 Q200,120 370,200"
                  stroke="#f3642150"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <g transform="translate(200, 140)">
                  <circle cx="0" cy="0" r="40" fill="#f5f5f5" />
                  <path
                    d="M-15,-15 L15,15 M-15,15 L15,-15"
                    stroke="#f36421"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </g>
                <g transform="translate(80, 170)">
                  <circle cx="0" cy="0" r="15" fill="#f5f5f5" />
                  <path
                    d="M-5,-5 L5,5 M-5,5 L5,-5"
                    stroke="#f36421aa"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
                <g transform="translate(320, 170)">
                  <circle cx="0" cy="0" r="15" fill="#f5f5f5" />
                  <path
                    d="M-5,-5 L5,5 M-5,5 L5,-5"
                    stroke="#f36421aa"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
                <g transform="translate(40, 150)">
                  <circle cx="0" cy="0" r="8" fill="#f5f5f5" />
                  <path
                    d="M-3,-3 L3,3 M-3,3 L3,-3"
                    stroke="#f36421aa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
                <g transform="translate(360, 150)">
                  <circle cx="0" cy="0" r="8" fill="#f5f5f5" />
                  <path
                    d="M-3,-3 L3,3 M-3,3 L3,-3"
                    stroke="#f36421aa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </motion.div>
          <div className="flex justify-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-[100px] sm:text-[160px] font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent leading-tight tracking-tighter">
                404
              </div>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-xl font-black text-gray-800 mb-2">
              Хуудас олдсонгүй
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/" className="grid place-items-center">
              <Button className="grd-btn h-11 w-1/2 sm:w-1/3">
                Нүүр хуудас
              </Button>
            </Link>
          </motion.div>

          {/* Illustration */}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
