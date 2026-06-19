import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Star, MessageSquare, Reply, Filter } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetFeedbacks, useReplyToFeedback } from "@/hooks/useFeedbacks";
import { Feedback as FeedbackItem } from "@/types/feedback";

const Feedback = () => {
  const { lang } = useLanguage();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);

  const { data: response, isLoading, isError } = useGetFeedbacks(pendingOnly);
  const feedbacks = Array.isArray(response?.data) ? response.data : [];

  const replyMutation = useReplyToFeedback();

  const handleOpenReply = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleCloseReply = () => {
    setIsReplyModalOpen(false);
    setSelectedFeedback(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!selectedFeedback || !replyText.trim()) return;
    replyMutation.mutate({ id: selectedFeedback.id, replyText: replyText.trim() }, {
      onSuccess: () => {
        handleCloseReply();
      }
    });
  };

  return (
    <DashboardLayout title={t("feedback", lang)} subtitle={t("feedbackSubtitle", lang)}>
      <div className="mb-4 flex items-center justify-end">
        <Button 
          variant={pendingOnly ? "default" : "outline"} 
          size="sm" 
          onClick={() => setPendingOnly(!pendingOnly)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Pending Only
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : isError ? (
        <div className="text-center py-8 text-destructive">Failed to load feedbacks.</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No feedback found.</div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const hasReply = fb.isReplied === true;
            return (
            <div key={fb.id} className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {fb.userName ? fb.userName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "?"}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground">{fb.subject || "No Subject"}</h4>
                    <p className="text-xs text-muted-foreground">{fb.userName || "Unknown"} • {fb.userEmail || "No Email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < fb.rating ? "fill-warning text-warning" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ""}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-card-foreground leading-relaxed">{fb.message}</p>
              
              {hasReply && (
                <div className="mt-3 ml-4 rounded-md bg-muted/40 p-3 border-l-2 border-primary">
                  <span className="text-xs font-semibold text-primary block mb-1">Admin Reply</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {fb.adminReply || <span className="italic opacity-70">No text provided.</span>}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {hasReply ? (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      <Reply className="h-3 w-3" /> {t("replied", lang)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                      <MessageSquare className="h-3 w-3" /> {t("awaitingReply", lang)}
                    </span>
                  )}
                </div>
                {!hasReply && (
                  <Button size="sm" onClick={() => handleOpenReply(fb)}>
                    {t("reply", lang)}
                  </Button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}

      <Dialog open={isReplyModalOpen} onOpenChange={handleCloseReply}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("replyTo", lang)} {selectedFeedback?.userName}</DialogTitle>
            <DialogDescription>{selectedFeedback?.userEmail}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-card-foreground">{selectedFeedback?.subject}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedFeedback?.message}</p>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("typeResponse", lang)}
              rows={5}
              disabled={replyMutation.isPending}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseReply} disabled={replyMutation.isPending}>
              {t("cancel", lang)}
            </Button>
            <Button onClick={handleSendReply} disabled={!replyText.trim() || replyMutation.isPending}>
              {replyMutation.isPending ? "Sending..." : t("sendReply", lang)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Feedback;
