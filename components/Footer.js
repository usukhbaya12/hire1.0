import { Divider } from "antd";
import Image from "next/image";

export default function Footer() {
  const items = [
    { key: "1", label: "Онцлох тестүүд" },
    { key: "2", label: "Эрэлттэй тестүүд" },
    { key: "3", label: "Тестийн сан" },
  ];
  const knowledge = [
    { key: "1", label: "Блог" },
    { key: "2", label: "Зөвлөмжүүд" },
    { key: "3", label: "Нэр томьёоны тайлбар" },
  ];
  return (
    <div className="bg-white mt-12 pt-10 pb-8 2xl:px-60 xl:px-24 lg:px-16 md:px-12 px-6">
      <div className="sm:grid grid-cols-4">
        <div className="flex flex-col gap-6">
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
          <div className="flex items-center gap-3">
            <Image
              src="/facebook.png"
              alt="Facebook icon"
              width={20}
              height={20}
              priority
            />
            <Image
              src="/youtube.png"
              alt="YouTube icon"
              width={20}
              height={20}
              priority
            />
            <Image
              src="/linkedin.png"
              alt="LinkedIn icon"
              width={20}
              height={20}
              priority
            />
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-8">
          <div className="font-bold">Тестүүд</div>
          <div className="pt-2 sm:pt-4">
            {items.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:pl-24">
          <div className="font-bold">Мэдлэгийн сан</div>
          <div className="pt-2 sm:pt-4">
            {knowledge.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 sm:pt-0 sm:text-end">
          <div className="font-bold">Бидэнтэй холбогдох</div>
          <div className="pt-2 sm:pt-4">
            {knowledge.map((item) => (
              <div className="pt-1" key={item.key}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Divider />
      <div>© 2025 Аксиом Инк. Бүх эрх хуулиар хамгаалагдсан.</div>
    </div>
  );
}
