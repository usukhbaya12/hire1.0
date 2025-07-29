import React, { useState } from "react";
import { api } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlarmBoldDuotone,
  Document1LineDuotone,
  Pen2BoldDuotone,
  TagBoldDuotone,
} from "solar-icons";
import Link from "next/link";
import { UserAddOutlined } from "@ant-design/icons";

const BlurImage = ({ src, alt }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative aspect-[1.5/1] overflow-hidden rounded-3xl bg-gray-200 w-full">
      <Image
        draggable={false}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        className={`
         object-cover
         duration-700 ease-in-out
         ${isLoading ? "scale-110 blur-lg" : "scale-100 blur-0"}
         transform transition-transform duration-500 group-hover:scale-110
       `}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const Assessment = ({ assessment }) => {
  const router = useRouter();
  const [titleRef, setTitleRef] = useState(null);
  const [isTitleTwoLines, setIsTitleTwoLines] = useState(false);

  React.useEffect(() => {
    if (titleRef) {
      const lineHeight = parseInt(window.getComputedStyle(titleRef).lineHeight);
      const titleHeight = titleRef.scrollHeight;
      const lines = Math.round(titleHeight / lineHeight);
      setIsTitleTwoLines(lines >= 2);
    }
  }, [titleRef, assessment?.data?.name]);

  return (
    <Link href={`/test/${assessment.data.id}`}>
      <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 border border-white/30 shadow-lg shadow-black/10 rounded-[28px] overflow-hidden transition-all duration-700 hover:shadow-xl hover:shadow-black/15 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="flex flex-col gap-3">
          <div className="relative z-10 p-2.5 space-y-5">
            <div className="relative">
              <BlurImage
                src={
                  assessment.data.icons
                    ? `${api}file/${assessment.data.icons}`
                    : "/placeholder.png"
                }
                alt={assessment.data.name}
              />
              <div className="absolute bottom-3 left-3 backdrop-blur-md bg-black/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                <div className="flex items-center gap-1.5">
                  <TagBoldDuotone width={14} />
                  {assessment.category.name}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 pb-7 px-7">
            <h3
              ref={setTitleRef}
              className="font-extrabold text-lg transition-colors duration-500 group-hover:text-main leading-5 line-clamp-2"
            >
              {assessment.data.name}
            </h3>

            <p
              className={`leading-5 text-justify text-gray-700 ${
                assessment.data.description
                  ? isTitleTwoLines
                    ? "line-clamp-3"
                    : "line-clamp-4"
                  : isTitleTwoLines
                  ? "sm:h-[3.75rem]"
                  : "sm:h-20"
              }`}
            >
              {assessment.data.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 px-3 py-1.5 rounded-3xl border border-orange-200">
                <Document1LineDuotone width={18} height={18} />
                <span className="font-semibold text-sm truncate max-w-[220px]">
                  {assessment.data.author}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <div
                  className={`px-3.5 py-1.5 rounded-full font-bold ${
                    assessment.data.price > 0
                      ? "bg-gradient-to-r from-main to-main/95 text-white shadow-lg shadow-secondary/30"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300"
                  }`}
                >
                  {assessment.data.price > 0
                    ? assessment.data.price.toLocaleString() + "₮"
                    : "Үнэгүй"}
                </div>

                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-3xl border border-blue-200">
                  <AlarmBoldDuotone width={18} height={18} />
                  <span className="font-semibold text-sm">
                    {assessment.data.duration} минут
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-secondary/5 to-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10" />
      </div>
    </Link>
  );
};

export default Assessment;
