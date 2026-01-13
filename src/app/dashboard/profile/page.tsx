import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import ProfileForm from "@/components/Dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "Profile | click.aiesec.my",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Profile</h1>
        <p className="text-sm text-bodydark">
          Manage your profile information
        </p>
      </div>

      <ProfileForm user={session?.user} />
    </div>
  );
}
