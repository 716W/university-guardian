import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useLogin } from "@/hooks/queries/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { extractRolesFromToken } from "@/lib/authUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string, global?: string }>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang, isRTL } = useLanguage();

  const loginMutation = useLogin();
  const setTokens = useAuthStore((state) => state.setTokens);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = t("emailRequired", lang);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("validEmail", lang);
    if (!password.trim()) errs.password = t("passwordRequired", lang);
    else if (password.length < 6) errs.password = t("passwordMinLength", lang);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setTokens(data.token, data.refreshToken);

          // Extract ALL roles properly handling .NET token formatting
          const roles = extractRolesFromToken(data.token);

          if (roles.includes("Admin") || roles.includes("Super Admin") || roles.includes("SuperAdmin")) {
            toast({ title: t("welcomeBack", lang), description: t("redirecting", lang) });
            navigate("/");
          } else {
            useAuthStore.getState().logout();
            setErrors({ global: "Access Denied: You must be an Admin or Super Admin." });
          }
        },
        onError: (error) => {
          setErrors({ global: error.message || "Invalid credentials." });
        },
      }
    );
  };

  return (
    <div className={`min-h-screen flex ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* Left Side – Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80" />
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="w-28 h-28 rounded-full bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center mb-8">
            <Shield className="w-14 h-14 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-3 tracking-tight">{t("lostFoundSystem", lang)}</h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">{isRTL ? "جامعة حضرموت" : "Hadramout University"}</p>
          <div className="mt-10 w-16 h-px bg-primary-foreground/20" />
          <p className="mt-6 text-primary-foreground/50 text-sm">{t("secureAdminAccess", lang)}</p>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-primary-foreground/10" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-primary-foreground/10" />
      </div>

      {/* Right Side – Form */}
      <div className="flex-1 flex flex-col bg-card">
        <div className="flex justify-end p-6" />

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{isRTL ? "جامعة حضرموت" : "Hadramout University"}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{t("adminLogin", lang)}</h2>
              <p className="mt-2 text-muted-foreground text-sm">{t("loginSubtitle", lang)}</p>
              {errors.global && (
                <div className="mt-4 p-3 rounded bg-destructive/10 text-destructive text-sm border border-destructive/20">
                  {errors.global}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailAddress", lang)}</Label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    className={`${isRTL ? "pr-10" : "pl-10"} h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password", lang)}</Label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                    className={`${isRTL ? "pr-10 pl-10" : "pl-10 pr-10"} h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">{t("rememberMe", lang)}</Label>
                </div>
                <button type="button" className="text-sm text-primary hover:underline font-medium">{t("forgotPassword", lang)}</button>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("signingIn", lang)}
                  </span>
                ) : (
                  t("signIn", lang)
                )}
              </Button>


            </form>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-xs text-muted-foreground">{t("allRightsReserved", lang)}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
