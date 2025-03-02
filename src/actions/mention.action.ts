// src/actions/mention.action.ts
"use server";

import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client"; // Import the enum type

/**
 * Process text content to extract mentions and save them to database
 */
export async function processMentions({
  content,
  postId = null,
  commentId = null,
  authorId,
}: {
  content: string;
  postId?: string | null;
  commentId?: string | null;
  authorId: string;
}) {
  try {
    // Extract all @username mentions from the content
    const mentionRegex = /@(\w+)/g;
    const mentionMatches = [...content.matchAll(mentionRegex)];
    const usernames = mentionMatches.map(match => match[1]);
    
    if (usernames.length === 0) return { success: true };
    
    // Find all mentioned users that exist
    const mentionedUsers = await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    
    if (mentionedUsers.length === 0) return { success: true };
    
    // Create mentions and notifications for each mentioned user
    for (const user of mentionedUsers) {
      // Skip if user is mentioning themselves
      if (user.id === authorId) continue;
      
      // Create notification for the mention
      await prisma.notification.create({
        data: {
          type: NotificationType.MENTION, // Use the enum value
          userId: user.id,     // who receives the notification
          creatorId: authorId, // who created the mention
          postId,
          commentId,
        },
      });
      
      // Create entry in Mention table
      await prisma.Mention.create({ // Use correct capitalization
        data: {
          userId: user.id,   // User who was mentioned
          postId,            // Optional post where the mention occurred
          commentId,         // Optional comment where the mention occurred
        },
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error processing mentions:", error);
    return { success: false, error: "Failed to process mentions" };
  }
}