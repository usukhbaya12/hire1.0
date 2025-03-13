import Signup from "@/components/Signup";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="sm:min-h-screen sm:flex items-center justify-center px-6 sm:px-0 bg-gray-100">
      <title>Бүртгүүлэх – Hire.mn</title>

      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="absolute z-[1] left-0 bottom-0 hidden sm:block">
        <Image
          src="/quartercircle.png"
          width={600}
          height={10}
          alt="Half Circle Icon"
        />
      </div>
      <div className="z-[2] relative">
        <Signup />
      </div>
    </div>
  );
}
