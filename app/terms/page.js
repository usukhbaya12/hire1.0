"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { QuestionCircleBoldDuotone, ChatDotsBoldDuotone } from "solar-icons";
import { DropdownIcon } from "@/components/Icons";

const TermsPage = () => {
  return (
    <div>
      <title>Үйлчилгээний нөхцөл / Hire.mn</title>
      {/* <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div> */}

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3"
            >
              {/* <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
                <ChatDotsBoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div> */}
              <h2 className="text-3xl font-black bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]">
                Үйлчилгээний нөхцөл
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 md:p-8 text-justify">
              <section>
                <h3 className="font-extrabold uppercase mb-3">
                  1. Ерөнхий зүйл
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">1.1.</span> Hire.mn нь ажил
                    олгогч байгууллагууд болон хувь хэрэглэгч нарт зориулсан
                    хувь хүний зан төлөв, сэтгэлзүй, чадамж, мэргэжлийн болон
                    ерөнхий ур чадварын тестүүд болон өөрийн үнэлгээний
                    үйлчилгээний платформ. Энэхүү үйлчилгээний нөхцөл нь уг
                    платформыг шалгуулагч болон ажил олгогч байгууллагын хувиар
                    ашиглаж байгаа тохиолдолд үйлчлэх болно.
                  </p>
                  <p>
                    <span className="font-semibold">1.2.</span> Тестүүдийн
                    агуулга, тайлан, тооцооллын аргачлал, алгоритм нь Hire.mn
                    болон тест нийлүүлэгчдийн оюуны өмч бөгөөд төрөл бүрийн
                    байдлаар хуулбарлах, уг платформоос гадуур дахин ашиглахыг
                    хатуу хориглоно.
                  </p>
                  <div>
                    <p>
                      <span className="font-semibold">1.3.</span> Hire.mn
                      платформ нь дараах төрлийн тест, өөрийн үнэлгээг санал
                      болгоно.
                    </p>
                    <ul className="list-disc ml-7 mt-2 space-y-1">
                      <p>
                        <span className="font-semibold">1.3.1.</span> Хувь хүний
                        зан төлөвийн тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.2.</span> Сэтгэлзүйн
                        болон психометрик тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.3.</span> Мэргэжлийн
                        мэдлэг шалгах тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.4.</span> Тодорхой
                        албан тушаал, ажлын байрны тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.5.</span> Ерөнхий ур
                        чадварын тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.6.</span> Ерөнхий
                        чадамжийн тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.7.</span> Төрөл
                        бүрийн өөрийн үнэлгээ
                      </p>
                      <p>
                        <span className="font-semibold">1.3.8.</span> Компани,
                        ажил олгогчийн өөрсдийн боловсруулсан тест
                      </p>
                      <p>
                        <span className="font-semibold">1.3.9.</span> Бусад
                        гэсэн ангилалтай байна.
                      </p>
                    </ul>
                  </div>
                  <p>
                    <span className="font-semibold">1.4.</span> Тестүүд болон
                    өөрийн үнэлгээнүүдийг Hire.mn болон тус платформтой хамтран
                    ажиллагч судлаачид нээлттэй эх үүсвэрээс орчуулах, шинээр
                    зохиох, Монголын нөхцөлд тохируулан өөрчилсөн болно.
                  </p>
                  <p>
                    <span className="font-semibold">1.5.</span> Тестүүд болон
                    өөрийн үнэлгээний агуулга, хүчинтэй байдал, дүгнэлт, тайлан
                    нь тухайлсан нөхцөл, шалгуулагчийн шударга байдлаас
                    шалтгаалан бодит байдлаас зөрүүтэй гарч магадгүй тул тест,
                    үнэлгээнээс үүдэн гарах ямар нэгэн бодит болон бодит бус
                    хохиролыг Hire.mn платформ, түүний хөрөнгө оруулагчид,
                    хамтран ажиллагч нар хүлээхгүй болно.
                  </p>
                  <p>
                    <span className="font-semibold">1.6.</span> Сэтгэлзүй,
                    психометрик, зан төлөвийн тестүүдийн тайлан нь сэтгэцийн
                    эмгэгийн оношилгоонд зориулагдаагүй бөгөөд шаардлагатай
                    тохиолдолд та мэргэжлийн сэтгэлзүйч, байгууллагад хандана
                    уу.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  2. Шалгуулагчийн эрх, үүрэг
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">2.1.</span> Шалгуулагч өөрөө
                    бие даан болон Ажил олгогчоос илгээсэн тест, өөрийн үнэлгээг
                    хөндлөнгийн нөлөөгүйгээр өгөх, тайланг хүлээн авах.
                  </p>
                  <p>
                    <span className="font-semibold">2.2.</span> Тестийн талаар
                    санал хүсэлтээ Hire.mn болон ажил олгогч руу илгээх эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">2.3.</span> Бусад хүмүүсийн
                    нэрийн өмнөөс тест болон өөрийн үнэлгээнд оролцохыг
                    хориглоно.
                  </p>
                  <p>
                    <span className="font-semibold">2.4.</span> Сэтгэлзүй,
                    психометрик, зан төлөвийн тестүүдийн тайлан нь сэтгэцийн
                    эмгэгийн оношилгоонд зориулагдаагүй болно. Хэрвээ
                    шаардлагтай гэж үзвэл мэргэжлийн сэтгэлзүйч, байгууллагад
                    хандана уу.
                  </p>
                </div>
              </section>

              {/* 3 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  3. Байгууллагын хэрэглэгчийн эрх, үүрэг
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">3.1.</span> Байгууллагын
                    хэрэглэгч нь өөрийн ажилтнууд болон ажил горилогчдоос
                    Hire.mn-ээс санал болгож буй тестүүдийг авах, тайланг нь
                    хүлээн авах эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">3.2.</span> Тест болон
                    өөрийн үнэлгээний талаар санал хүсэлтээ Hire.mn рүү илгээх
                    эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">3.3.</span> Тест, өөрийн
                    үнэлгээнд оролцож буй ажилтнууд, ажил горилогчдын хариултанд
                    нөлөөлөхгүйгээр хяналт тавих эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">3.4.</span> Бусад хүмүүсийн
                    нэрийн өмнөөс тест болон өөрийн үнэлгээнд оролцохгүй байхыг
                    шалгуулагч нараас шаардах эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">3.5.</span> Сэтгэлзүй,
                    психометрик, зан төлөвийн тестүүдийн тайлан нь сэтгэцийн
                    эмгэгийн оношилгоонд зориулагдаагүй болно. Хэрвээ
                    шаардлагтай гэж үзвэл мэргэжлийн сэтгэлзүйч, мэргэжилтнүүд
                    рүү хандана уу.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  4. Hire.mn-ийн эрх, үүрэг
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">4.1.</span> Платформ дээрх
                    бүх төрлийн тест, өөрийн үнэлгээг тасралтгүй сайжруулах,
                    хөгжүүлэх, өөрчлөх эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">4.2.</span> Платформ дээр
                    байгаа бүх төрлийн тест, өөрийн үнэлгээ нь сайн дурын үндсэн
                    дээр хийгдэж байгаа тул шалгуулагч болон ажил олгогч
                    байгууллагын өмнөөс Hire.mn нь ямар нэгэн хариуцлага
                    хүлээхгүй болно.
                  </p>
                  <p>
                    <span className="font-semibold">4.3.</span> Шалгуулагч болон
                    ажил олгогч байгууллагаас хүрэлцэн ирсэн санал гомдлыг
                    хүлээн авах, шийдвэрлэх.
                  </p>
                  <p>
                    <span className="font-semibold">4.4.</span> Зориулалтын
                    бусаар платформыг ашиглах, тус платформын оюуны өмч, нэр
                    хүндэд халдсан шалгуулагч болон ажил олгогч байгууллагын
                    нэвтрэх, ашиглах эрхийг түр болон хугацаагүйгээр хязгаарлах,
                    цуцлах эрхтэй.
                  </p>
                  <p>
                    <span className="font-semibold">4.5.</span> Шалгуулагч болон
                    байгууллагын мэдээллийн аюулгүй байдлыг хангаж хэрэглэгчийн
                    зөвшөөрөлгүйгээр 3 дагч этгээдэд шилжүүлэхгүй байх үүрэгтэй.
                  </p>
                </div>
              </section>

              {/* 5 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  5. Үр дүн, зөвлөмжийн хариуцлага
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">5.1.</span> Hire.mn-ээс
                    санал болгож буй тест, өөрийн үнэлгээний үр дүн, тайлан нь
                    зөвлөмжийн шинж чанартай тул үүдэн гарах үр дүнд ямар нэгэн
                    хариуцлагыг Hire.mn хүлээхгүй болно.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  6. Төлбөр төлөлт
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">6.1.</span> Платформ дээрх
                    тест, өөрийн үнэлгээ нь онцлогоосоо шалтгаалан төлбөртэй
                    эсвэл төлбөргүй байна.
                  </p>
                  <p>
                    <span className="font-semibold">6.2.</span> Төлбөр төлөгдсөн
                    тохиолдолд буцаан олголт хийгдэхгүй.
                  </p>
                  <p>
                    <span className="font-semibold">6.3.</span> Hire.mn-ээс
                    үүдсэн техникийн шалтгаанаар тест өгөх боломжгүй тохиолдолд
                    нөхөн тест өгөх эрх олгоно.
                  </p>
                  <p>
                    <span className="font-semibold">6.4.</span> Тестийн эрхийг
                    бусдад дамжуулах, худалдахыг хориглоно.
                  </p>
                </div>
              </section>

              {/* 7 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  7. Маргаан шийдвэрлэх
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">7.1.</span> Үйлчилгээтэй
                    холбоотой үүссэн аливаа маргааныг талууд зөвшилцлөөр
                    шийдвэрлэхийг эрмэлзэнэ. Хэрвээ зөвшилцлөөр шийдэгдэхгүй
                    тохиолдолд Монгол Улсад хүчин төгөлдөр үйлчилж буй хууль,
                    эрхзүйн актын хүрээнд шийдвэрлэнэ.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  Холбоо барих хаяг
                </h3>
                <div className="space-y-1">
                  <p>Hire.mn</p>
                  <p>
                    Утас:{" "}
                    <a
                      href="tel:+97675111111"
                      className="underline hover:text-main"
                    >
                      7511-1111
                    </a>
                    ,{" "}
                    <a
                      href="tel:+97699099371"
                      className="underline hover:text-main"
                    >
                      9909-9371
                    </a>
                  </p>
                  <p>
                    И-мэйл:{" "}
                    <a
                      href="mailto:info@axiominc.mn"
                      className="underline hover:text-main"
                    >
                      info@axiominc.mn
                    </a>
                  </p>
                  <p>
                    Вэбсайт:{" "}
                    <a
                      href="https://www.hire.mn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-main"
                    >
                      www.hire.mn
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TermsPage;
