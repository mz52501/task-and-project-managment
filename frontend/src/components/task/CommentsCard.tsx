import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useComments } from "@/hooks/useComments";

interface EnrichedComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_initials?: string;
}

interface Props {
  taskId: string;
}

export function CommentsCard({ taskId }: Props) {
  const {
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
  } = useComments(taskId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(comments as EnrichedComment[]).map((c) => {
            const initials = c.author_initials ?? c.user_id.slice(0, 2).toUpperCase();
            const authorName = c.author_name;
            const date = new Date(c.created_at).toLocaleDateString();
            return (
              <div key={c.id} className="group flex gap-3">
                <Avatar className="w-8 h-8 flex-none">
                  <AvatarFallback className="text-xs bg-gray-100">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {authorName && (
                        <span className="text-xs font-medium text-gray-700">{authorName}</span>
                      )}
                      <span className="text-xs text-gray-500">{date}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => startEditComment(c)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => deleteComment(c.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  {editingComment === c.id ? (
                    <div className="mt-1 space-y-2">
                      <Textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button  onClick={() => saveEditComment(c.id)}>
                          Save
                        </Button>
                        <Button  variant="outline" onClick={() => setEditingComment(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          <Separator className="my-2" />

          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-none">
              <AvatarFallback className="text-xs bg-gray-100">
                {(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem("user") ?? "{}");
                    return (
                      `${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase() || "Me"
                    );
                  } catch {
                    return "Me";
                  }
                })()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <Button  onClick={postComment}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
