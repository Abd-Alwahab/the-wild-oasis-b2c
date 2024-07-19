import Navigation from "@/app/_components/Navigation";
import Logo from "@/app/_components/Logo";
import MobileNavigation from "./MobileNavigation";
import { auth } from "../_lib/auth";

async function Header() {
  const session = await auth();
  return (
    <header className="border-b border-primary-900 px-4 lg:px-8 py-5">
      <div className="flex justify-start items-center max-w-7xl mx-auto lg:justify-between">
        <Logo />

        <div className="hidden lg:block z-10">
          <Navigation />
        </div>

        <div className="block lg:hidden z-20 relative">
          <MobileNavigation session={session} />
        </div>
      </div>
    </header>
  );
}

export default Header;
