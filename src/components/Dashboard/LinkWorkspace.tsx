"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";

type LinkOwner = {
  id?: string;
  name?: string | null;
  email?: string | null;
};

export type LinkRecord = {
  id: string;
  slug: string;
  destination: string;
  title?: string | null;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  user?: LinkOwner | null;
};

type Overview = {
  linkCount: number;
  totalClicks: number;
  clicksLast24h: number;
  topLinks?: { id: string; slug: string; title?: string | null; clickCount: number }[];
};

type Props = {
  initialLinks: LinkRecord[];
  overview: Overview;
  isAdmin?: boolean;
};

const shortDomain =
  process.env.NEXT_PUBLIC_SHORT_DOMAIN || "https://click.aiesec.my";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const LinkWorkspace = ({ initialLinks, overview, isAdmin }: Props) => {
  const [links, setLinks] = useState<LinkRecord[]>(initialLinks);
  const [stats, setStats] = useState<Overview>(overview);
  const [formState, setFormState] = useState({
    slug: "",
    destination: "",
    title: "",
  });
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { slug: string; destination: string; title: string; isActive: boolean }>
  >({});

  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + (link.clickCount || 0), 0),
    [links],
  );

  const refreshOverview = async () => {
    try {
      const res = await fetch("/api/analytics/overview", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.slug || !formState.destination) {
      toast.error("Slug and destination are required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/shortlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Could not create link.");
        return;
      }

      setLinks((prev) => [data, ...prev]);
      setFormState({ slug: "", destination: "", title: "" });
      toast.success("Short link created.");
      refreshOverview();
    } catch (error: any) {
      toast.error(error?.message || "Could not create link.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (link: LinkRecord) => {
    setEditingId(link.id);
    setDrafts((prev) => ({
      ...prev,
      [link.id]: {
        slug: link.slug,
        destination: link.destination,
        title: link.title || "",
        isActive: link.isActive,
      },
    }));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    await handleUpdate(id, draft);
    setEditingId(null);
  };

  const handleUpdate = async (id: string, payload: Partial<LinkRecord>) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/shortlinks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Update failed.");
        return;
      }

      setLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, ...data } : link)),
      );
      toast.success("Link updated.");
      refreshOverview();
    } catch (error: any) {
      toast.error(error?.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this short link?")) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/shortlinks/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || "Delete failed.");
        return;
      }

      setLinks((prev) => prev.filter((link) => link.id !== id));
      toast.success("Link deleted.");
      refreshOverview();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-body-secondary">Total links</p>
          <p className="text-3xl font-semibold text-dark dark:text-white">
            {stats.linkCount ?? links.length}
          </p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-body-secondary">Total clicks</p>
          <p className="text-3xl font-semibold text-dark dark:text-white">
            {stats.totalClicks ?? totalClicks}
          </p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-body-secondary">Clicks (24h)</p>
          <p className="text-3xl font-semibold text-dark dark:text-white">
            {stats.clicksLast24h ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 shadow-sm">
          <p className="text-sm text-primary">Top performer</p>
          {stats?.topLinks && stats.topLinks.length > 0 ? (
            <div className="mt-1">
              <p className="text-lg font-semibold text-dark">
                {stats.topLinks[0].title || stats.topLinks[0].slug}
              </p>
              <p className="text-sm text-body-secondary">
                {stats.topLinks[0].clickCount} clicks
              </p>
            </div>
          ) : (
            <p className="text-sm text-body-secondary">No clicks yet</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-dark dark:text-white">
                  Your short links
                </p>
                <p className="text-body-secondary text-sm">
                  Manage destinations, status, and analytics.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="rounded-lg border border-stroke px-3 py-2 text-sm text-body-secondary hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
              >
                Refresh
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stroke text-body-secondary dark:border-dark-3">
                    <th className="px-2 py-3">Slug</th>
                    <th className="px-2 py-3">Destination</th>
                    <th className="px-2 py-3">Clicks</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {links.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-2 py-4 text-center text-body-secondary"
                      >
                        No short links yet. Create your first one.
                      </td>
                    </tr>
                  )}
                  {links.map((link) => {
                    const draft =
                      drafts[link.id] || {
                        slug: link.slug,
                        destination: link.destination,
                        title: link.title || "",
                        isActive: link.isActive,
                      };

                    return (
                      <tr key={link.id} className="align-top">
                        <td className="px-2 py-3">
                          <div className="flex flex-col gap-1">
                            {editingId === link.id ? (
                              <input
                                value={draft.slug}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [link.id]: { ...draft, slug: e.target.value },
                                  }))
                                }
                                className="w-full rounded border border-stroke px-2 py-1 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                              />
                            ) : (
                              <span className="font-semibold text-primary">
                                {shortDomain.replace(/\/$/, "")}/{link.slug}
                              </span>
                            )}
                            {editingId === link.id ? (
                              <input
                                value={draft.title}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [link.id]: { ...draft, title: e.target.value },
                                  }))
                                }
                                placeholder="Add a title"
                                className="w-full rounded border border-stroke px-2 py-1 text-xs outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                              />
                            ) : (
                              <span className="text-xs text-body-secondary">
                                {link.title || "Untitled"}
                              </span>
                            )}
                            {isAdmin && link.user?.email && (
                              <span className="text-[11px] text-body-secondary">
                                Owner: {link.user.email}
                              </span>
                            )}
                            <span className="text-[11px] text-body-secondary">
                              Updated {formatDate(link.updatedAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          {editingId === link.id ? (
                            <textarea
                              value={draft.destination}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [link.id]: { ...draft, destination: e.target.value },
                                }))
                              }
                              rows={2}
                              className="w-full rounded border border-stroke px-2 py-1 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                            />
                          ) : (
                            <div className="max-w-[260px] break-words text-body-secondary">
                              {link.destination}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {link.clickCount}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <button
                            disabled={savingId === link.id}
                            onClick={() =>
                              handleUpdate(link.id, {
                                isActive: !link.isActive,
                              })
                            }
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${link.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-700 dark:bg-dark-3 dark:text-white"
                              }`}
                          >
                            {savingId === link.id ? "Saving..." : link.isActive ? "Active" : "Paused"}
                          </button>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${shortDomain.replace(/\/$/, "")}/${link.slug}`,
                                );
                                toast.success("Copied short link");
                              }}
                              className="rounded-lg border border-stroke px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
                            >
                              Copy
                            </button>
                            <Link
                              href={`/dashboard/links/${link.id}`}
                              className="rounded-lg border border-stroke px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
                            >
                              Analytics
                            </Link>
                            {editingId === link.id ? (
                              <>
                                <button
                                  onClick={() => saveEdit(link.id)}
                                  className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/90"
                                  disabled={savingId === link.id}
                                >
                                  Save changes
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="rounded-lg border border-stroke px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
                                  disabled={savingId === link.id}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startEdit(link)}
                                className="rounded-lg border border-stroke px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
                                disabled={savingId === link.id}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(link.id)}
                              className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                              disabled={savingId === link.id}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <p className="text-lg font-semibold text-dark dark:text-white">
              Create a short link
            </p>
            <p className="text-body-secondary text-sm">
              Use your own slug to get a branded link like{" "}
              {shortDomain.replace(/https?:\/\//, "")}/your-campaign
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
              <div>
                <label className="text-sm text-dark dark:text-white">
                  Custom slug
                </label>
                <input
                  value={formState.slug}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="summer-offer"
                  className="mt-1 w-full rounded-lg border border-stroke px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-dark dark:text-white">
                  Destination URL
                </label>
                <input
                  value={formState.destination}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/landing"
                  className="mt-1 w-full rounded-lg border border-stroke px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-dark dark:text-white">
                  Title (optional)
                </label>
                <input
                  value={formState.title}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Campaign name or note"
                  className="mt-1 w-full rounded-lg border border-stroke px-4 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
              >
                Create short link
                {creating && <Loader />}
              </button>
            </form>
          </div>

          {stats?.topLinks && stats.topLinks.length > 0 && (
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <p className="text-lg font-semibold text-dark dark:text-white">
                Top links
              </p>
              <div className="mt-3 space-y-3">
                {stats.topLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2 dark:border-dark-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-white">
                        {link.title || link.slug}
                      </p>
                      <p className="text-xs text-body-secondary">
                        {shortDomain.replace(/\/$/, "")}/{link.slug}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {link.clickCount} clicks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkWorkspace;
