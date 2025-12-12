import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
      <Link href="/">
        <Image
          src="/assests/logo.png"
          alt="logo"
          height={48}
          width={48}
          className="h-12 w-auto"
        />
      </Link>
      <div className="hidden md:flex gap-8 items-center text-sm">
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/about" className="nav-link">
          About Us
        </Link>
        <div className="group relative">
          <button className="nav-link">Causes ▼</button>
          <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg">
            <Link
              href="/causes/animals"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Animals
            </Link>
            <Link
              href="/causes/education"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Education & Skills
            </Link>
            <Link
              href="/causes/environment"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Environment
            </Link>
            <Link
              href="/causes/food"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Food & Nutrition
            </Link>
          </div>
        </div>
        <Link href="/internship" className="nav-link">
          Social Internship
        </Link>
        <Link href="/gallery" className="nav-link">
          Gallery
        </Link>
        <Link href="/contact" className="nav-link">
          Contact
        </Link>
        <Link href="/donate" className="btn-primary text-sm px-5 py-2">
          Donate
        </Link>
      </div>
      <div className="md:hidden">
        <Link href="/donate" className="btn-primary text-sm px-4 py-2">
          Donate
        </Link>
      </div>
    </nav>
  );
}
