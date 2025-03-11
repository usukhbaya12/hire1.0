import { Divider } from "antd";
import Image from "next/image";
import {
  HeadphonesRoundBoldDuotone,
  LetterBoldDuotone,
  PhoneBold,
  PhoneCallingRoundedBoldDuotone,
} from "solar-icons";

export default function Footer() {
  const items = [
    { key: "1", label: "Тестийн сан" },
    { key: "2", label: "Онцлох" },
    { key: "3", label: "Эрэлттэй" },
  ];
  const knowledge = [
    { key: "1", label: "Блог, зөвлөмжүүд" },
    { key: "2", label: "Нэр томьёоны тайлбар" },
  ];
  const support = [
    { key: "1", label: "Түгээмэл асуултууд" },
    { key: "2", label: "Үйлчилгээний нөхцөл" },
    { key: "3", label: "Нууцлалын бодлого" },
  ];
  return (
    <div className="bg-white/70 backdrop-blur-md mt-12 pt-14 pb-8 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
      <div className="sm:grid grid-cols-5">
        <div className="flex flex-col gap-4 col-span-2">
          <div>
            <Image
              src="/hire-logo.png"
              alt="Hire logo"
              width={100}
              height={26}
              priority
              draggable={false}
            />
          </div>
          <div className="pt-2">
            <div className="text-gray-700">СЭЗИС, Б байр, 7-р давхар</div>
            <div className="text-gray-700">
              Энхтайвны өргөн чөлөө-5, Баянзүрх дүүрэг
            </div>
            <div className="text-gray-700">Улаанбаатар хот 13381</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-700 flex items-center gap-2">
              <PhoneCallingRoundedBoldDuotone width={18} />
              7511-1111
            </div>
            <div className="text-gray-700 flex items-center gap-2">
              <PhoneCallingRoundedBoldDuotone width={18} />
              9909-9371
            </div>
          </div>
          <div className="text-gray-700 flex items-center gap-2">
            <LetterBoldDuotone width={18} />
            support@hire.mn
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-8">
          <div className="font-extrabold text-base">Тестүүд</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {items.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-24">
          <div className="font-extrabold text-base">Мэдлэгийн сан</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {knowledge.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:text-end">
          <div className="font-extrabold text-base">Тусламж</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {support.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-2">
        <Divider />
      </div>
      <div className="flex justify-between">
        <div className="w-2/3 sm:w-full">
          © 2025 Аксиом Инк. Бүх эрх хуулиар хамгаалагдсан.
        </div>
        <div className="flex items-center gap-3">
          <Image
            src="/facebook.png"
            alt="Facebook icon"
            width={16}
            height={16}
            priority
          />
          <Image
            src="/youtube.png"
            alt="YouTube icon"
            width={16}
            height={16}
            priority
          />
          <Image
            src="/linkedin.png"
            alt="LinkedIn icon"
            width={16}
            height={16}
            priority
          />
        </div>
      </div>
    </div>
  );
}
