import ModeToggle from "@/components/modetoggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Sign } from "crypto";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-4">
      <h1>Main page</h1>
    </div>
  );
}
