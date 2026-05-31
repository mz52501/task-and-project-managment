import { useEffect, useState } from "react";
import { getComments, createComment, updateComment, deleteCommentById } from "@/api/tasks";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Comment } from "@/types";
import { toast } from "sonner";

export function useComments(taskId: string) {
  const { currentWorkspace } = useWorkspace();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    if (!taskId || !currentWorkspace) return;
    getComments(currentWorkspace.id, taskId)
      .then(setComments)
      .catch(() => toast.error("Failed to load comments"));
  }, [taskId, currentWorkspace?.id]);

  async function postComment() {
    if (!newComment.trim() || !currentWorkspace) return;
    try {
      const created = await createComment(currentWorkspace.id, taskId, newComment.trim());
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch {
      toast.error("Failed to post comment");
    }
  }

  async function deleteComment(id: string) {
    try {
      await deleteCommentById(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
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
      const updated = await updateComment(id, editCommentContent);
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingComment(null);
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
