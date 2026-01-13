"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const { data: session } = useSession();

  const pathUrl = usePathname();

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const { theme, setTheme } = useTheme();

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${sticky
          ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
          : "absolute bg-transparent"
          }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full ${sticky ? "py-4" : "py-5"
                  } `}
              >
                {pathUrl !== "/" ? (
                  <>
                    <Image
                      src={`/images/logo/Blue-Logo.png`}
                      alt="logo"
                      width={400}
                      height={120}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={`/images/logo/White-Blue-Logo.png`}
                      alt="logo"
                      width={400}
                      height={120}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src={sticky ? "/images/logo/Blue-Logo.png" : "/images/logo/White-Blue-Logo.png"}
                      alt="logo"
                      width={320}
                      height={95}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={"/images/logo/White-Blue-Logo.png"}
                      alt="logo"
                      width={320}
                      height={95}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-end px-4">
              <div className="flex items-center gap-4">
                {pathUrl !== "/" && (
                  <button
                    aria-label="theme toggler"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-body-color duration-300 dark:text-white cursor-pointer border border-stroke/60 dark:border-dark-3"
                  >
                    <span>
                      <svg
                        viewBox="0 0 16 16"
                        className="hidden h-[20px] w-[20px] fill-current dark:block"
                      >
                        <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
                      </svg>

                      <svg
                        viewBox="0 0 23 23"
                        className={`h-[24px] w-[24px] fill-current text-dark dark:hidden ${!sticky && pathUrl === "/" && "text-white"
                          }`}
                      >
                        <g clipPath="url(#clip0_40_125)">
                          <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
                        </g>
                      </svg>
                    </span>
                  </button>
                )}

                {session?.user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`${pathUrl !== "/" || sticky
                        ? "rounded-lg border border-stroke px-5 py-3 text-base font-medium text-dark duration-300 hover:border-primary hover:text-primary dark:text-white dark:hover:text-primary"
                        : "rounded-lg border border-white/40 px-5 py-3 text-base font-medium text-white duration-300 hover:border-white"
                        }`}
                    >
                      Dashboard
                    </Link>
                    {pathUrl !== "/" || sticky ? (
                      <button
                        onClick={() => signOut()}
                        className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => signOut()}
                        className="rounded-lg bg-white/20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-white/30"
                      >
                        Sign Out
                      </button>
                    )}
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className={`${pathUrl !== "/" || sticky
                      ? "rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90"
                      : "rounded-lg bg-white/20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-white/30"
                      }`}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
