import { useState } from "react";

export interface LocalComment {
  id: number;
  author: string;
  initials: string;
  date: string;
  content: string;
}

const initialComments: LocalComment[] = [
  { id: 1, author: "Sarah Miller", initials: "SM", date: "2024-05-28", content: "Great progress on the charts! The visualization looks really clean. Make sure to add proper accessibility labels." },
  { id: 2, author: "Alex Brown", initials: "AB", date: "2024-05-27", content: "Can we also include a dark mode toggle in the dashboard? It would be a nice UX enhancement." },
  { id: 3, author: "Mike Johnson", initials: "MJ", date: "2024-05-26", content: "Started working on this task. Planning to have the basic layout done by end of week." },
];

export function useComments() {
  const [comments, setComments] = useState<LocalComment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  function postComment() {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, {
      id: Date.now(),
      author: "You",
      initials: "YO",
      date: new Date().toISOString().split("T")[0],
      content: newComment.trim(),
    }]);
    setNewComment("");
  }

  function deleteComment(id: number) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  function startEditComment(c: LocalComment) {
    setEditingComment(c.id);
    setEditCommentContent(c.content);
  }

  function saveEditComment(id: number) {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, content: editCommentContent } : c));
    setEditingComment(null);
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
