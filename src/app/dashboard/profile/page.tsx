import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import ProfileForm from "@/components/Dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "Profile | click.aiesec.my",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Fetch fresh user data from database (not just session)
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          lc: true,
          designation: true,
        },
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Profile</h1>
        <p className="text-sm text-bodydark">
          Manage your profile information
        </p>
      </div>

      <ProfileForm user={user ?? undefined} />
    </div>
  );
}
