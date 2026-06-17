import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, FileSignature, Package, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetAdminClaims } from "@/hooks/queries/useClaims";
import { useCreateHandover } from "@/hooks/queries/useHandovers";
import { toast } from "sonner";

const SignaturePad = ({ canvasRef, onClear, lang }: { canvasRef: React.RefObject<HTMLCanvasElement>, onClear: () => void, lang: string }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000'; // Or use CSS variable based on theme, but black is standard for signature
      }
    }
  }, [canvasRef]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    e.preventDefault(); // Prevent scrolling while signing on mobile
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-32">
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full rounded-lg border-2 border-dashed border-border bg-background cursor-crosshair touch-none bg-white"
            style={{ touchAction: 'none' }}
        />
        <button 
          type="button" 
          onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            onClear();
          }} 
          className="absolute bottom-2 left-2 rounded-md border border-input bg-background/80 px-2 py-1 text-[10px] text-foreground hover:bg-muted shadow-sm"
        >
          {t("clear", lang)}
        </button>
    </div>
  );
};

const Handover = () => {
  const { lang } = useLanguage();
  
  // Queries
  const { data: claimsData, isLoading: isLoadingClaims } = useGetAdminClaims({ PageNumber: 1, PageSize: 100 });
  const claims = claimsData?.data || [];
  
  // Pending or Found reports usually handed over -> Now we use Claims
  const eligibleClaims = claims.filter(c => c.approvalStatus === 1); // Assuming 1 is Approved
  
  const { mutate: createHandover, isPending } = useCreateHandover();

  // Form State
  const [selectedClaimId, setSelectedClaimId] = useState<string>("");
  const [receiverName, setReceiverName] = useState("");
  const [idType, setIdType] = useState("1");
  const [idNumber, setIdNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const currentItem = eligibleClaims.find((i) => i.id.toString() === selectedClaimId);

  // Set default selection when claims load
  useEffect(() => {
    if (eligibleClaims.length > 0 && !selectedClaimId) {
        setSelectedClaimId(eligibleClaims[0].id.toString());
    }
  }, [eligibleClaims, selectedClaimId]);

  const handleSubmit = async () => {
    if (!selectedClaimId || !idNumber) {
        toast.error(lang === "AR" ? "يرجى تعبئة الحقول المطلوبة" : "Please fill in all required fields");
        return;
    }

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    // Check if canvas is empty (simplified check)
    // Note: a more robust check would involve checking pixel data
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
        if (!blob) {
            toast.error(lang === "AR" ? "يرجى إضافة التوقيع" : "Please provide a signature");
            return;
        }

        // Create FormData
        const formData = new FormData();
        
        // Ensure numeric fields are explicitly parsed and cast as strings for FormData
        formData.append("ClaimId", String(Number(selectedClaimId)));
        formData.append("IdType", String(Number(idType)));
        
        // Handle Missing UI Fields with fallback integer '0'
        formData.append("LocationId", "0"); 
        formData.append("ReceiverUserId", "0");
        
        formData.append("IdNumber", idNumber);
        if (notes) formData.append("Notes", notes);
        
        // Format Date to ISO string
        formData.append("HandoverDate", new Date().toISOString());
        
        if (idPhoto) {
            formData.append("IdPhoto", idPhoto);
        }

        formData.append("SignatureImage", blob, "signature.png");
        
        // Send mutation
        createHandover(formData, {
            onSuccess: () => {
                // Reset form
                setReceiverName("");
                setIdNumber("");
                setNotes("");
                setIdPhoto(null);
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                setSelectedClaimId("");
            }
        });
    }, "image/png");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setIdPhoto(e.target.files[0]);
    }
  };

  return (
    <DashboardLayout title={t("handover", lang)} subtitle={t("handoverSubtitle", lang)}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Side - 60% (3/5) */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-bold text-primary">{t("returnDocumentation", lang)}</h3>
          
          <form className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("selectReportRef", lang)} (Claim)</label>
              <select 
                value={selectedClaimId} 
                onChange={(e) => setSelectedClaimId(e.target.value)}
                disabled={isLoadingClaims}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="" disabled>{lang === "AR" ? "اختر مطالبة..." : "Select a claim..."}</option>
                {eligibleClaims.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.claimCode} – {opt.itemName}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("receiverFullName", lang)}</label>
                <input 
                  type="text" 
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder={lang === "AR" ? "مثال: أحمد علي" : "e.g., Ahmed Ali"} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("idType", lang)}</label>
                <select 
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="1">{t("studentIdOption", lang)}</option>
                  <option value="2">{t("nationalId", lang)}</option>
                  <option value="3">{t("passport", lang)}</option>
                  <option value="4">{t("employeeBadge", lang)}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("idNumber", lang)}</label>
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="HU-2023-1045" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
                />
              </div>
            </div>
            
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("handoverNotes", lang)}</label>
              <textarea 
                rows={2} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === "AR" ? "أي ملاحظات إضافية..." : "Any additional notes..."} 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-primary" />
                  <label className="text-xs font-medium text-muted-foreground">{t("digitalSignature", lang)}</label>
                </div>
                <SignaturePad 
                  canvasRef={signatureCanvasRef} 
                  onClear={() => {}} 
                  lang={lang}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <label className="text-xs font-medium text-muted-foreground">{t("uploadIdPhoto", lang)}</label>
                </div>
                
                <input 
                  type="file" 
                  id="id-photo-upload" 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                
                <div 
                  onClick={() => document.getElementById("id-photo-upload")?.click()}
                  className="relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-background transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  {idPhoto ? (
                    <>
                        <img 
                            src={URL.createObjectURL(idPhoto)} 
                            alt="ID Photo Preview" 
                            className="absolute inset-0 h-full w-full object-cover opacity-60" 
                        />
                        <div className="z-10 flex flex-col items-center justify-center rounded-md bg-background/80 px-3 py-2 backdrop-blur-sm shadow-sm">
                            <CheckCircle2 className="mb-1 h-5 w-5 text-success" />
                            <span className="text-[10px] font-medium text-foreground">{idPhoto.name}</span>
                        </div>
                    </>
                  ) : (
                    <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-1 text-xs font-medium text-card-foreground">{t("dropOrClick", lang)}</p>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG {lang === "AR" ? "حتى 5 ميغابايت" : "up to 5MB"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isPending || isLoadingClaims}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2 flex items-center justify-center disabled:opacity-70"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("completeHandover", lang)}
            </button>
          </form>
        </div>

        {/* Right Side - 40% (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card min-h-[140px] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-card-foreground">{t("selectedItem", lang)}</h3>
            </div>
            
            {currentItem ? (
                <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 overflow-hidden items-center justify-center rounded-xl bg-primary/10 text-3xl border border-primary/10">
                    {currentItem.imagePath ? (
                        <img 
                            src={currentItem.imagePath.startsWith('http') ? currentItem.imagePath : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${currentItem.imagePath}`} 
                            alt={currentItem.itemName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                    ) : (
                        "📦"
                    )}
                </div>
                <div>
                    <p className="text-sm font-bold text-card-foreground">{currentItem.itemName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">#{currentItem.id}</p>
                    <span className="inline-flex mt-1.5 rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-semibold text-warning border border-warning/20">
                    {t("awaitingHandover", lang)}
                    </span>
                </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-2 opacity-60">
                    <Package className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">{lang === "AR" ? "الرجاء اختيار تقرير من القائمة" : "Please select a report from the list"}</p>
                </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-sm font-bold text-card-foreground">{t("recentHandovers", lang)}</h3>
            {/* Keeping dummy data for recent handovers until list endpoint is fully implemented */}
            <div className="space-y-2.5">
              {[
                { item: "Laptop Charger (Dell)", to: "Omar Hassan", date: "Feb 8, 2026" },
                { item: "Student ID Card", to: "Sara Mohammed", date: "Feb 7, 2026" },
                { item: "Engineering Textbook", to: "Mohammed Qasim", date: "Feb 5, 2026" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{h.item}</p>
                    <p className="text-xs text-muted-foreground">{t("to", lang)}: {h.to}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Handover;
