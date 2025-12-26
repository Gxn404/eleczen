import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <ProfileClient session={session} />
  );
}
