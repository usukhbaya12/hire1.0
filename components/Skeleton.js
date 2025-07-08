import React from "react";

export default function AssessmentSkeleton() {
  return (
    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 border border-white/30 shadow-lg shadow-black/10 rounded-[28px] overflow-hidden animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="relative z-10 p-2.5 space-y-5">
          <div className="relative aspect-[1.5/1] overflow-hidden rounded-3xl bg-gray-200 w-full" />
        </div>
        <div className="space-y-3 pb-7 px-7">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <div className="h-8 bg-gray-200 rounded-full w-36" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <div className="h-8 bg-gray-200 rounded-full w-20" />
              <div className="h-8 bg-gray-200 rounded-full w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
