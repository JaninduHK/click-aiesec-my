import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Click AIESEC Malaysia",
  description: "Learn more about the AIESEC Malaysia link management platform.",
};

export default function AboutPage() {
  return (
    <section className="bg-[#F4F7FF] py-16 dark:bg-dark">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white px-8 py-12 text-center shadow-md dark:bg-dark-2">
          <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white">
            About
          </h1>
          <p className="text-base text-body-color dark:text-dark-6">
            This page is coming soon. We&apos;re building resources to share how
            AIESEC Malaysia shortens and tracks campaign links.
          </p>
        </div>
      </div>
    </section>
  );
}
