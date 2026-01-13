import { Metadata } from "next";
import ShortnerForm from "@/components/Dashboard/ShortnerForm";

export const metadata: Metadata = {
  title: "Create Short Link | click.aiesec.my",
  description: "Create a new short link",
};

export default function ShortnerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Create Short Link
        </h1>
        <p className="text-sm text-bodydark">
          Create a branded short link for your destination URL
        </p>
      </div>

      <ShortnerForm />
    </div>
  );
}
