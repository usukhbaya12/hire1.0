import { Divider } from "antd";
import Image from "next/image";
import {
  HeadphonesRoundBoldDuotone,
  LetterBoldDuotone,
  PhoneBold,
  PhoneCallingRoundedBoldDuotone,
} from "solar-icons";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const items = [
    { key: "1", label: "Тестийн сан", link: "/#tests" },
    { key: "2", label: "Онцлох", link: "/#starred" },
    { key: "3", label: "Шинээр нэмэгдсэн", link: "/#new" },
    { key: "4", label: "Эрэлттэй", link: "/#popular" },
  ];
  const knowledge = [
    { key: "1", label: "Блог, зөвлөмжүүд", link: "/news" },
    { key: "2", label: "Нэр томьёоны тайлбар", link: "/glossary" },
  ];
  const support = [
    { key: "1", label: "Түгээмэл асуултууд", link: "/faq" },
    { key: "2", label: "Үйлчилгээний нөхцөл", link: "/terms" },
    { key: "3", label: "Нууцлалын бодлого", link: "/privacy" },
    // { key: "4", label: "Гарах", link: "signout" },
  ];
  const link = [
    { key: "1", label: "Бидний тухай", link: "/about" },
    { key: "2", label: "Бидэнтэй холбогдох", link: "/contact" },
    { key: "3", label: "Өгсөн тестүүд", link: "/me" },
    { key: "4", label: "Миний бүртгэл", link: "/me/account" },
  ];

  const handleLinkClick = (link) => {
    if (link) {
      router.push(link);
    }
  };

  const handleScrollToSection = (sectionId) => {
    if (window.location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerHeight =
          sectionId === "tests" ? 5 : sectionId === "starred" ? 0 : 20;
        const y = section.offsetTop - headerHeight;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      router.push(`/?scrollTo=${sectionId}`);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border-t border-slate-200 pt-12 pb-8 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6">
        <div className="flex flex-col gap-4 col-span-2">
          <div>
            <Image
              src="/hire-2.png"
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
            <a
              href="tel:75111111"
              className="text-gray-700 flex items-center gap-2 hover:underline"
            >
              <PhoneCallingRoundedBoldDuotone width={18} />
              7511-1111
            </a>
            <a
              href="tel:99099371"
              className="text-gray-700 flex items-center gap-2 hover:underline"
            >
              <PhoneCallingRoundedBoldDuotone width={18} />
              9909-9371
            </a>
          </div>
          <div className="text-gray-700 flex items-center gap-2">
            <a
              href="mailto:info@axiominc.mn"
              className="text-gray-700 flex items-center gap-2 hover:underline"
            >
              <LetterBoldDuotone width={18} />
              info@axiominc.mn
            </a>
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-4 md:pl-10 lg:pl-4">
          <div className="font-extrabold text-base">Тестүүд</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {items.map((item) => (
              <div className="pt-1" key={item.key}>
                <span
                  className="text-gray-700 hover:text-black hover:underline transition duration-300 cursor-pointer"
                  onClick={() => {
                    if (item.key === "1") {
                      handleScrollToSection("tests");
                    } else if (item.key === "2") {
                      handleScrollToSection("starred");
                    } else if (item.key === "3") {
                      handleScrollToSection("new");
                    } else if (item.key === "4") {
                      handleScrollToSection("popular");
                    } else {
                      handleLinkClick(item.link);
                    }
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-4 md:hidden lg:block">
          <div className="font-extrabold text-base">Мэдлэгийн сан</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {knowledge.map((item) => (
              <div className="pt-1" key={item.key}>
                <span
                  className="text-gray-700 hover:text-black hover:underline transition duration-300 cursor-pointer"
                  onClick={() => handleLinkClick(item.link)}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-16 md:pl-4 lg:pl-16">
          <div className="font-extrabold text-base">Холбоос</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {link.map((item) => (
              <div className="pt-1" key={item.key}>
                <span
                  className="text-gray-700 hover:text-black hover:underline transition duration-300 cursor-pointer"
                  onClick={() => handleLinkClick(item.link)}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:text-end">
          <div className="font-extrabold text-base">Тусламж</div>
          <div className="pt-2 sm:pt-4 text-gray-700">
            {support.map((item) => (
              <div className="pt-1" key={item.key}>
                <span
                  className="text-gray-700 hover:text-black hover:underline transition duration-300 cursor-pointer"
                  onClick={() => handleLinkClick(item.link)}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-2 pt-6 sm:pt-2">
        <Divider />
      </div>
      <div className="flex justify-between">
        <div className="w-2/3 sm:w-full text-gray-700">
          ©{" "}
          {new Date().getFullYear() === 2025
            ? "2025"
            : `2025-${new Date().getFullYear()}`}{" "}
          <span className="hover:underline cursor-pointer">
            <a
              href="https://axiominc.mn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Аксиом Инк ХХК.
            </a>
          </span>{" "}
          Бүх эрх хуулиар хамгаалагдсан.
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=61582780914037"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform"
          >
            <Image
              src="/facebook.png"
              alt="Facebook icon"
              width={20}
              height={20}
              priority
              className="filter grayscale brightness-125 hover:grayscale-0 hover:brightness-100 transition duration-300"
            />
          </a>
          <a
            href="https://www.instagram.com/hire.mn"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform"
          >
            <Image
              src="/instagram.png"
              alt="Instagram icon"
              width={20}
              height={20}
              priority
              className="filter grayscale brightness-125 hover:grayscale-0 hover:brightness-100 transition duration-300"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/axiom-inc-mongolia/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform"
          >
            <Image
              src="/linkedin.png"
              alt="LinkedIn icon"
              width={19}
              height={19}
              priority
              className="filter grayscale brightness-125 hover:grayscale-0 hover:brightness-100 transition duration-300"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
