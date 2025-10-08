import Link from "next/link";

export default function RootPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Link href="/signin">Sign In</Link>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
