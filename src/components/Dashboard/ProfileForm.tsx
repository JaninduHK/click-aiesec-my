"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  lc?: string | null;
  designation?: string | null;
}

export default function ProfileForm({ user }: { user?: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lc: user?.lc || "",
    designation: user?.designation || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Update local state with the response data to sync the "Current Information" widget
      if (data.user) {
        setFormData({
          name: data.user.name || "",
          lc: data.user.lc || "",
          designation: data.user.designation || "",
        });
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9 lg:grid-cols-2">
      {/* Profile Form */}
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Personal Information
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {message && (
                <div
                  className={`mb-4 rounded-md p-4 ${
                    message.type === "success"
                      ? "bg-success bg-opacity-10 text-success"
                      : "bg-danger bg-opacity-10 text-danger"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Full Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded border-[1.5px] border-stroke bg-whiter px-5 py-3 font-medium outline-none dark:border-form-strokedark dark:bg-form-input"
                />
                <p className="mt-1 text-xs text-bodydark">
                  Email cannot be changed
                </p>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  LC (Local Committee)
                </label>
                <input
                  type="text"
                  placeholder="e.g., AIESEC in Malaysia"
                  value={formData.lc}
                  onChange={(e) =>
                    setFormData({ ...formData, lc: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g., Vice President Marketing"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Current Information
            </h3>
          </div>
          <div className="p-6.5">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg
                    className="fill-primary dark:fill-white"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 14C17.866 14 21 10.866 21 7C21 3.13401 17.866 0 14 0C10.134 0 7 3.13401 7 7C7 10.866 10.134 14 14 14Z" />
                    <path d="M14 16.625C8.31878 16.625 3.71875 20.5781 3.71875 25.375C3.71875 26.2719 4.44685 27 5.34375 27H22.6562C23.5531 27 24.2812 26.2719 24.2812 25.375C24.2812 20.5781 19.6812 16.625 14 16.625Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-bodydark">Name</p>
                  <p className="font-medium text-black dark:text-white">
                    {formData.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg
                    className="fill-primary dark:fill-white"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.625 4.8125H4.375C3.16406 4.8125 2.1875 5.78906 2.1875 7V21C2.1875 22.2109 3.16406 23.1875 4.375 23.1875H23.625C24.8359 23.1875 25.8125 22.2109 25.8125 21V7C25.8125 5.78906 24.8359 4.8125 23.625 4.8125ZM23.625 7L14 13.5625L4.375 7H23.625ZM23.625 21H4.375V9.625L14 16.1875L23.625 9.625V21Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-bodydark">Email</p>
                  <p className="font-medium text-black dark:text-white">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg
                    className="fill-primary dark:fill-white"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 0C8.47715 0 4 4.47715 4 10C4 16.25 14 28 14 28C14 28 24 16.25 24 10C24 4.47715 19.5228 0 14 0ZM14 13.5C12.067 13.5 10.5 11.933 10.5 10C10.5 8.067 12.067 6.5 14 6.5C15.933 6.5 17.5 8.067 17.5 10C17.5 11.933 15.933 13.5 14 13.5Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-bodydark">Local Committee</p>
                  <p className="font-medium text-black dark:text-white">
                    {formData.lc || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                  <svg
                    className="fill-primary dark:fill-white"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 4H20V2C20 1.44772 19.5523 1 19 1H17C16.4477 1 16 1.44772 16 2V4H12V2C12 1.44772 11.5523 1 11 1H9C8.44772 1 8 1.44772 8 2V4H4C2.89543 4 2 4.89543 2 6V24C2 25.1046 2.89543 26 4 26H24C25.1046 26 26 25.1046 26 24V6C26 4.89543 25.1046 4 24 4ZM24 24H4V10H24V24ZM24 8H4V6H8V7C8 7.55228 8.44772 8 9 8H11C11.5523 8 12 7.55228 12 7V6H16V7C16 7.55228 16.4477 8 17 8H19C19.5523 8 20 7.55228 20 7V6H24V8Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-bodydark">Designation</p>
                  <p className="font-medium text-black dark:text-white">
                    {formData.designation || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
