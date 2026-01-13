"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  createdAt?: string;
  createdById?: string | null;
  linkCount: number;
  clickCount: number;
};

const AdminUserPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Unable to load users.");
        return;
      }

      setUsers(
        data.map((user: AdminUser) => ({
          ...user,
          createdAt: user.createdAt || undefined,
        })),
      );
    } catch (error: any) {
      toast.error(error?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Could not create user.");
        return;
      }

      toast.success("User created.");
      setFormState({ name: "", email: "", password: "", role: "USER" });
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "Could not create user.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-dark dark:text-white">
            Admin: manage users
          </p>
          <p className="text-body-secondary text-sm">
            Invite teammates with a predefined role and password.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="rounded-lg border border-stroke px-3 py-2 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
        >
          Refresh
        </button>
      </div>

      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={createUser}>
        <div>
          <label className="text-sm text-dark dark:text-white">Name</label>
          <input
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Teammate name"
            className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          />
        </div>
        <div>
          <label className="text-sm text-dark dark:text-white">Email</label>
          <input
            value={formState.email}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="name@company.com"
            className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm text-dark dark:text-white">Password</label>
          <input
            type="password"
            value={formState.password}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Temporary password"
            className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm text-dark dark:text-white">Role</label>
          <select
            value={formState.role}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, role: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
          >
            {creating ? "Creating..." : "Create user"}
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stroke text-body-secondary dark:border-dark-3">
              <th className="px-2 py-3">User</th>
              <th className="px-2 py-3">Role</th>
              <th className="px-2 py-3">Links</th>
              <th className="px-2 py-3">Clicks</th>
              <th className="px-2 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 py-4 text-center text-body-secondary"
                >
                  Loading users...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 py-4 text-center text-body-secondary"
                >
                  No users yet. Create the first teammate.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-2 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-dark dark:text-white">
                      {user.name || "No name"}
                    </span>
                    <span className="text-xs text-body-secondary">
                      {user.email}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-dark-3 dark:text-white">
                    {user.role}
                  </span>
                </td>
                <td className="px-2 py-3">{user.linkCount}</td>
                <td className="px-2 py-3">{user.clickCount}</td>
                <td className="px-2 py-3 text-body-secondary">
                  {user.createdAt
                    ? new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(user.createdAt))
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserPanel;
