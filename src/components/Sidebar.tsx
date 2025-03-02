"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import UserListsModal from "./UserListsModal";

interface SidebarProps {
  user: any | null;
}

function Sidebar({ user }: SidebarProps) {
  if (!user) return <UnAuthenticatedSidebar />;

  return <AuthenticatedSidebar user={user} />;
}

function AuthenticatedSidebar({ user }: SidebarProps) {
  const [showUserListsModal, setShowUserListsModal] = useState(false);
  const [userListsModalTab, setUserListsModalTab] = useState<"followers" | "following">("followers");

  const openUserListsModal = (tab: "followers" | "following") => {
    setUserListsModalTab(tab);
    setShowUserListsModal(true);
  };

  return (
    <>
      <div className="sticky top-20">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Link
                href={`/profile/${user.username}`}
                className="flex flex-col items-center justify-center"
              >
                <Avatar className="w-20 h-20 border-2 ">
                  <AvatarImage src={user.image || "/avatar.png"} />
                </Avatar>

                <div className="mt-4 space-y-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
              </Link>

              {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}

              <div className="w-full">
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <div
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => openUserListsModal("following")}
                  >
                    <p className="font-medium">{user._count.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <Separator orientation="vertical" />
                  <div
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => openUserListsModal("followers")}
                  >
                    <p className="font-medium">{user._count.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <LinkIcon className="size-4 mr-2" />
                  {user.website ? (
                    <a 
                      href={user.website.startsWith("http") ? user.website : `https://${user.website}`} 
                      className="hover:underline truncate" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  ) : (
                    "No website"
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* USER LISTS MODAL */}
      <UserListsModal
        userId={user.id}
        username={user.username}
        initialTab={userListsModalTab}
        followersCount={user._count.followers}
        followingCount={user._count.following}
        open={showUserListsModal}
        onOpenChange={setShowUserListsModal}
      />
    </>
  );
}

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full" variant="outline">
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2" variant="default">
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
);

export default Sidebar;