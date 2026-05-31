import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment, updateComment, deleteCommentById } from "@/api/tasks";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Comment } from "@/types";
import { toast } from "sonner";

export function useComments(taskId: string) {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(currentWorkspace!.id, taskId),
    enabled: !!taskId && !!currentWorkspace,
  });

  async function postComment() {
    if (!newComment.trim() || !currentWorkspace) return;
    try {
      await createComment(currentWorkspace.id, taskId, newComment.trim());
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    } catch {
      toast.error("Failed to post comment");
    }
  }

  async function deleteComment(id: string) {
    try {
      await deleteCommentById(id);
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  }

  function startEditComment(c: Comment) {
    setEditingComment(c.id);
    setEditCommentContent(c.content);
  }

  async function saveEditComment(id: string) {
    try {
      await updateComment(id, editCommentContent);
      setEditingComment(null);
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    } catch {
      toast.error("Failed to update comment");
    }
  }

  return {
    comments,
    newComment,
    setNewComment,
    editingComment,
    setEditingComment,
    editCommentContent,
    setEditCommentContent,
    postComment,
    deleteComment,
    startEditComment,
    saveEditComment,
  };
}
