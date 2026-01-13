"use client";

import { useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";

interface LinkRecord {
  id: string;
  slug: string;
  destination: string;
  title: string | null;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function LinksTable({
  initialLinks,
  isAdmin,
}: {
  initialLinks: LinkRecord[];
  isAdmin: boolean;
}) {
  const [links, setLinks] = useState(initialLinks);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLinks = links.filter(
    (link) =>
      link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/shortlinks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setLinks(
          links.map((link) =>
            link.id === id ? { ...link, isActive: !currentStatus } : link
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle link status:", error);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/shortlinks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Links</h1>
          <p className="text-sm text-bodydark">
            Manage all your shortened links
          </p>
        </div>
        <Link
          href="/dashboard/shortner"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90"
        >
          Create New Link
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 fill-bodydark"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
            />
          </svg>
        </div>
      </div>

      {/* Links Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Link
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Destination
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Clicks
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Owner
                  </th>
                )}
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Created
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-4 py-5 text-center"
                  >
                    <p className="text-bodydark">
                      {searchTerm ? "No links found" : "No links yet. Create your first link!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {link.title || link.slug}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-bodydark">click.aiesec.my/{link.slug}</p>
                            <CopyButton
                              value={`https://click.aiesec.my/${link.slug}`}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="truncate max-w-xs text-sm text-bodydark">
                        {link.destination}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {link.clickCount}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <button
                        onClick={() => toggleActive(link.id, link.isActive)}
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          link.isActive
                            ? "bg-success bg-opacity-10 text-success"
                            : "bg-danger bg-opacity-10 text-danger"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    {isAdmin && (
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-sm text-black dark:text-white">
                          {link.user?.name || link.user?.email || "Unknown"}
                        </p>
                      </td>
                    )}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/links/${link.id}`}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16.1999 9.30001H15.2571C15.0796 9.30001 14.9246 9.45501 14.9246 9.63251V13.725C14.9246 14.5275 14.2671 15.185 13.4646 15.185H2.8421C2.0396 15.185 1.3821 14.5275 1.3821 13.725V3.10251C1.3821 2.30001 2.0396 1.64251 2.8421 1.64251H6.9346C7.1121 1.64251 7.2671 1.48751 7.2671 1.31001V0.367507C7.2671 0.190007 7.1121 0.0350065 6.9346 0.0350065H2.8421C1.1946 0.0350065 -0.200104 1.47001 -0.200104 3.07751V13.725C-0.200104 15.3325 1.23115 16.7675 2.8421 16.7675H13.4646C15.0796 16.7675 16.5071 15.3325 16.5071 13.725V9.63251C16.5071 9.45501 16.3521 9.30001 16.1999 9.30001Z" />
                            <path d="M10.5751 1.31001L5.66385 6.20251C5.59885 6.26751 5.55635 6.35501 5.53885 6.45001L4.87385 9.41251C4.83885 9.58251 4.88885 9.76001 5.0051 9.87626C5.09885 9.97001 5.22635 10.0225 5.35385 10.0225C5.38885 10.0225 5.42385 10.0188 5.45885 10.0113L8.45635 9.36001C8.55135 9.34251 8.63885 9.30001 8.70385 9.23501L13.6226 4.34251L13.6676 4.29751C14.3251 3.63251 14.3251 2.56501 13.6676 1.90001L12.4176 0.649507C11.7601 -0.00799278 10.6926 -0.00799278 10.0351 0.649507C10.0126 0.672007 9.98635 0.694507 9.9676 0.717007L10.5751 1.31001Z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="hover:text-danger"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                            <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" />
                            <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" />
                            <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
