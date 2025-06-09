import { AuthGuard } from "@/components/auth-guard";
import Image from "next/image";

export default function Home() {
  return <AuthGuard></AuthGuard>;
}
