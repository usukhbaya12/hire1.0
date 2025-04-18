import React, { useState } from "react";
import { api } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlarmBoldDuotone, TagBoldDuotone } from "solar-icons";

const BlurImage = ({ src, alt }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-gray-200 max-h-[220px] min-h-[220px] w-full">
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        className={`
         object-cover
         duration-700 ease-in-out
         ${isLoading ? "scale-110 blur-lg" : "scale-100 blur-0"}
         transform transition-transform duration-500 group-hover:scale-110
         max-h-[220px] min-h-[220px]
       `}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-bg20 rounded-3xl overflow-hidden animate-pulse">
    <div className="min-h-[220px] max-h-[220px] bg-gray-200" />
    <div className="p-9 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-32" />
    </div>
  </div>
);

const Assessment = ({ assessment }) => {
  const router = useRouter();

  if (!assessment) {
    return <SkeletonCard />;
  }

  return (
    <div
      className="group bg-white backdrop-blur-md overflow-hidden transition-all duration-500 shadow shadow-slate-200 rounded-3xl cursor-pointer z-10"
      onClick={() => router.push(`/test/${assessment.data.id}`)}
    >
      <div className="flex flex-col gap-3">
        <BlurImage
          src={
            assessment.data.icons
              ? `${api}file/${assessment.data.icons}`
              : "/placeholder.png"
          }
          alt={assessment.data.name}
        />
        <div className="space-y-3 pb-5 pt-3 px-9">
          <h3 className="font-extrabold text-lg transition-colors duration-500 group-hover:text-main leading-5">
            {assessment.data.name}
          </h3>
          <p className="leading-6 text-justify text-gray-700 line-clamp-4">
            {assessment.data.description}
          </p>
          <div className="font-semibold flex items-center text-gray-800">
            {assessment.data.price > 0
              ? assessment.data.price.toLocaleString() + "₮"
              : "Үнэгүй"}
            <div className="flex items-center gap-1.5">
              <span className="pl-2 pr-1">•</span>
              <AlarmBoldDuotone width={16} height={16} />
              {assessment.data.duration} минут бөглөнө
            </div>
          </div>
          <div className="inline-flex gap-1.5 items-center bg-neutral/50 px-2 rounded-lg">
            <TagBoldDuotone width={16} />
            {assessment.category.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
