import { Divider } from "antd";
import Image from "next/image";
import {
  HeadphonesRoundBoldDuotone,
  LetterBoldDuotone,
  PhoneBold,
  PhoneCallingRoundedBoldDuotone,
} from "solar-icons";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Footer() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  const items = [
    { key: "1", label: "Тестийн сан", link: "/#tests" },
    { key: "2", label: "Шинээр нэмэгдсэн", link: "/#starred" },
    { key: "3", label: "Эрэлттэй", link: "/#popular" },
  ];
  const knowledge = [
    { key: "1", label: "Блог, зөвлөмжүүд", link: "/news" },
    { key: "2", label: "Нэр томьёоны тайлбар", link: "/glossary" },
  ];
  const support = [
    { key: "1", label: "Түгээмэл асуултууд", link: "/faq" },
    { key: "2", label: "Үйлчилгээний нөхцөл", link: "/" },
    { key: "3", label: "Нууцлалын бодлого", link: "/" },
    { key: "3", label: "Гарах", link: handleSignOut() },
  ];
  const link = [
    { key: "1", label: "Бидний тухай", link: "/about" },
    { key: "2", label: "Бидэнтэй холбогдох", link: "/" },
    { key: "3", label: "Өгсөн тестүүд", link: "/" },
    { key: "3", label: "Миний бүртгэл", link: "/" },
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
      <div className="grid grid-cols-2 sm:grid-cols-6">
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
        <div className="pt-8 sm:pt-0 sm:pl-4">
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
        <div className="pt-8 sm:pt-0 sm:pl-4">
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
        <div className="pt-8 sm:pt-0 sm:pl-16">
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
          © 2025 Аксиом Инк. Бүх эрх хуулиар хамгаалагдсан.
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/facebook.png"
              alt="Facebook icon"
              width={16}
              height={16}
              priority
            />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/youtube.png"
              alt="YouTube icon"
              width={16}
              height={16}
              priority
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/linkedin.png"
              alt="LinkedIn icon"
              width={16}
              height={16}
              priority
            />
          </a>
        </div>
      </div>
    </div>
  );
}
