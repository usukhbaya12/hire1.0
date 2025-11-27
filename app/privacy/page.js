"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { QuestionCircleBoldDuotone, ChatDotsBoldDuotone } from "solar-icons";
import { DropdownIcon } from "@/components/Icons";

const PrivacyPage = () => {
  return (
    <div>
      <title>Нууцлалын бодлого / Hire.mn</title>
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
                Нууцлалын бодлого
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
                    <span className="font-semibold">1.1.</span> Hire.mn платформ
                    нь өөрийн хэрэглэгч болох шалгуулагч болон ажил олгогч
                    байгууллагын хувийн нууц, мэдээллийн аюулгүй байдлыг
                    чухалчлан авч үздэг бөгөөд таны мэдээллийг хамгаалах үүрэг
                    хүлээнэ.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  2. Платформыг ашиглах явцад цуглуулах мэдээлэл
                </h3>
                <div className="space-y-3">
                  <div>
                    <p>
                      <span className="font-semibold">2.1.</span> Дараах
                      мэдээллүүдийг Hire.mn үйлчилгээг үзүүлэхтэй холбоотойгоор
                      цуглуулж байна. Үүнд:
                    </p>
                    <p className="ml-7 mt-2 space-y-1">
                      <span className="font-semibold">2.1.1. </span>{" "}
                      Шалгуулагчийн хувийн мэдээлэл
                    </p>
                    <ul className="list-disc ml-14 mt-2 space-y-1">
                      <p>
                        <span className="font-semibold">2.1.1.1.</span> Овог,
                        нэр
                      </p>
                      <p>
                        <span className="font-semibold">2.1.1.2.</span> И-мэйл
                        хаяг
                      </p>
                      <p>
                        <span className="font-semibold">2.1.1.3.</span> Утасны
                        дугаар
                      </p>
                      <p>
                        <span className="font-semibold">2.1.1.4.</span>{" "}
                        Ашигласан тестийн төрөл
                      </p>
                    </ul>
                    <p className="ml-7 mt-2 space-y-1">
                      <span className="font-semibold">2.1.2. </span> Ажил олгогч
                      байгууллагын мэдээлэл
                    </p>
                    <ul className="list-disc ml-14 mt-2 space-y-1">
                      <p>
                        <span className="font-semibold">2.1.2.1.</span>{" "}
                        Байгууллагын регистрийн дугаар
                      </p>
                      <p>
                        <span className="font-semibold">2.1.2.2.</span>{" "}
                        Байгууллагын нэр
                      </p>
                      <p>
                        <span className="font-semibold">2.1.2.3.</span>{" "}
                        Байгууллагын аккуант ашиглаж буй ажилтны овог, нэр
                      </p>
                      <p>
                        <span className="font-semibold">2.1.2.4.</span>{" "}
                        Байгууллагын аккуант ашиглаж буй ажилтны и-мэйл хаяг
                      </p>
                      <p>
                        <span className="font-semibold">2.1.2.5.</span>{" "}
                        Байгууллагын аккуант ашиглаж буй ажилтны утасны дугаар
                      </p>
                      <p>
                        <span className="font-semibold">2.1.2.6.</span>{" "}
                        Байгууллагаас илгээсэн тестийн төрөл
                      </p>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  3. Мэдээллийг хэрхэн ашиглах вэ?
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">3.1.</span> Цуглуулсан
                    мэдээллийг зөвхөн нэгдсэн байдлаар үйлчилгээний статистик
                    зорилгоор ашиглана.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  4. Мэдээлэл хадгалах хугацаа
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">4.1.</span> Таны мэдээллийг
                    зөвхөн хэрэглэгч байх хугацаанд хадгалах бөгөөд холбогдох
                    бүртгэлээ хаасан тохиолдолд устгах болно.
                  </p>
                </div>
              </section>

              {/* 5 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  5. Мэдээллийн аюулгүй байдал
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">5.1.</span> HМэдээллийн
                    аюулгүй байдлыг хангах зорилгоор SSL шифрлэл, эрхийн
                    хязгаарлалт, мэдээллийн нөөцлөлт зэрэг хамгаалалтыг
                    хэрэглэнэ.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  6. Хэрэглэгчийн эрх
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">6.1.</span> Хэрэглэгч өөрийн
                    хувийн мэдээлэл бүртгэлээ хянах, засварлах эрхтэй
                  </p>
                </div>
              </section>

              {/* 7 */}
              <section>
                <h3 className="font-extrabold uppercase mt-3 mb-3">
                  7. Нууцлалын бодлогын өөрчлөлт
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">7.1.</span> Нууцлалын
                    бодлогыг шинэчлэх, өөрчлөх эрхийг Hire.mn платформ эзэмших
                    ба өөрчлөлтийн мэдээллийг платформ дээр байршуулах болно.
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
                      href="https://hire.mn"
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

export default PrivacyPage;
