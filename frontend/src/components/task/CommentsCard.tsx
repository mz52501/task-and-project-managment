import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useComments } from "@/hooks/useComments";

export function CommentsCard() {
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
  } = useComments();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="group flex gap-3">
              <Avatar className="w-8 h-8 flex-none">
                <AvatarFallback className="text-xs bg-gray-100">{c.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditComment(c)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {editingComment === c.id ? (
                  <div className="mt-1 space-y-2">
                    <Textarea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEditComment(c.id)}
                        className="cursor-pointer"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingComment(null)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                )}
              </div>
            </div>
          ))}

          <Separator className="my-2" />

          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-none">
              <AvatarFallback className="text-xs bg-gray-100">You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <Button size="sm" onClick={postComment} className="cursor-pointer">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
