import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import Sidebar from "./Sidebar";

async function SidebarWrapper() {
  const authUser = await currentUser();
  let user = null;
  
  if (authUser) {
    try {
      user = await getUserByClerkId(authUser.id);
      console.log("Sidebar user data:", user);
    } catch (error) {
      console.error("Error fetching user for sidebar:", error);
    }
  }
  
  return <Sidebar user={user} />;
}

export default SidebarWrapper;