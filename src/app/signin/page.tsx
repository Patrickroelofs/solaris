import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@/components/patterns/sign-in";
import signinImage from "../../../public/000007460005.jpg";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            Solaris
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignIn />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image alt="" fill src={signinImage} className="object-cover" />
      </div>
    </div>
  );
}
