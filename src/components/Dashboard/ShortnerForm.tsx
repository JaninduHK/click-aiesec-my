"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CopyButton from "./CopyButton";

export default function ShortnerForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    slug: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const generateSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    setFormData({ ...formData, slug: randomSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Generate random slug if not provided
      const slugToUse = formData.slug || Math.random().toString(36).substring(2, 8);

      const response = await fetch("/api/shortlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: slugToUse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      setCreatedLink(`https://click.aiesec.my/${data.slug}`);
      setFormData({ destination: "", slug: "", title: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      {/* Form */}
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Link Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {error && (
                <div className="mb-4 rounded-md bg-danger bg-opacity-10 p-4">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              {createdLink && (
                <div className="mb-6 rounded-md border border-success bg-success bg-opacity-10 p-4">
                  <p className="mb-2 text-sm font-medium text-success">
                    Link created successfully!
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={createdLink}
                      readOnly
                      className="flex-1 rounded-md border border-stroke bg-white px-4 py-2 text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                    <CopyButton value={createdLink} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/links")}
                      className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                      View All Links
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatedLink(null)}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Destination URL <span className="text-meta-1">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/your-long-url"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Custom Slug (Optional)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bodydark">
                      /
                    </span>
                    <input
                      type="text"
                      placeholder="custom-slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-8 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="rounded border border-stroke bg-gray px-4 py-2 text-sm font-medium text-black hover:shadow-1 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  >
                    Generate
                  </button>
                </div>
                <p className="mt-1 text-xs text-bodydark">
                  Leave empty to auto-generate a random slug
                </p>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="My Campaign Link"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.destination}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Short Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
