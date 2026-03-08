import { DashboardLayout } from "@/components/DashboardLayout";
import { Star, MessageSquare, Reply } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

const feedbacks = [
  { id: 1, from: "Ahmed Ali", email: "ahmed.ali@hu.edu.ye", subject: "Great service – got my phone back!", message: "I lost my Samsung phone near the Engineering Faculty and got it back within 2 days. The system is very helpful. Thank you to the team!", rating: 5, date: "2026-02-08", replied: true },
  { id: 2, from: "Fatima Saleh", email: "fatima.s@hu.edu.ye", subject: "Suggestion: Add notification feature", message: "It would be great if the system could send SMS or email notifications when a matching item is found. Currently I have to keep checking the website.", rating: 4, date: "2026-02-07", replied: false },
  { id: 3, from: "Khalid Nasser", email: "khalid.n@hu.edu.ye", subject: "Claim process too slow", message: "I submitted a claim for my wallet 5 days ago and it's still pending. The verification process should be faster. I need my national ID urgently.", rating: 2, date: "2026-02-06", replied: true },
  { id: 4, from: "Mona Abdulrahman", email: "mona.a@hu.edu.ye", subject: "Cannot upload photos on mobile", message: "When I try to report a lost item from my phone, the photo upload button doesn't work. I had to use a computer instead. Please fix this.", rating: 3, date: "2026-02-05", replied: false },
  { id: 5, from: "Dr. Nabil Al-Qadhi", email: "nabil.q@hu.edu.ye", subject: "Excellent initiative for campus safety", message: "As a faculty member, I appreciate this system. It has reduced the number of lost item complaints we receive in the department. Keep up the good work.", rating: 5, date: "2026-02-04", replied: true },
];

const Feedback = () => {
  const { lang } = useLanguage();

  return (
    <DashboardLayout title={t("feedback", lang)} subtitle={t("feedbackSubtitle", lang)}>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {fb.from.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground">{fb.subject}</h4>
                  <p className="text-xs text-muted-foreground">{fb.from} • {fb.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < fb.rating ? "fill-warning text-warning" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{fb.date}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-card-foreground leading-relaxed">{fb.message}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {fb.replied ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    <Reply className="h-3 w-3" /> {t("replied", lang)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                    <MessageSquare className="h-3 w-3" /> {t("awaitingReply", lang)}
                  </span>
                )}
              </div>
              {!fb.replied && (
                <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  {t("reply", lang)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
