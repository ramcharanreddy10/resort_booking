import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/UserProfile"; // Adjust path as needed

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <UserProfile 
      userName={session.user.name} 
      userEmail={session.user.email} 
    />
  );
}