"use client";

import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { AtSignIcon, HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500" />;
    case "MENTION":
      return <AtSignIcon className="size-4 text-purple-500" />;
    default:
      return null;
  }
};

function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // If it's a follow notification, go to the user's profile
    if (notification.type === "FOLLOW") {
      router.push(`/profile/${notification.creator.username}`);
      return;
    }

    // For other notifications, navigate to the post
    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                    !notification.read ? "bg-muted/50" : ""
                  } cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Avatar className="mt-1 h-10 w-10">
                    <AvatarImage src={notification.creator.image ?? "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span>
                        <span className="font-medium">
                          {notification.creator.name ?? notification.creator.username}
                        </span>{" "}
                        {notification.type === "FOLLOW"
                          ? "started following you"
                          : notification.type === "LIKE"
                          ? "liked your post"
                          : notification.type === "COMMENT"
                          ? "commented on your post"
                          : notification.type === "MENTION"
                          ? (notification.commentId 
                            ? "mentioned you in a comment" 
                            : "mentioned you in a post")
                          : ""}
                      </span>
                    </div>

                    {/* Post/Comment Content */}
                    {notification.post && (
                      <div className="mt-2 ml-6">
                        <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3">
                          {notification.post.content}
                          {notification.post.image && (
                            <img
                              src={notification.post.image}
                              alt="Post content"
                              className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                            />
                          )}
                        </div>

                        {notification.comment && (
                          <div className="text-sm bg-accent/30 rounded-md p-3 mt-2">
                            {notification.comment.content}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2 ml-6">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
export default NotificationsPage;