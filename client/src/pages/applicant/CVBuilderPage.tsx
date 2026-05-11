import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Plus,
  Trash2,
  FileText,
  Zap,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Tag,
  Save,
  Loader2,
  CheckCircle,
  LayoutTemplate,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { applicantService } from "@/services/applicantService";
import { toast } from "sonner";
import { SettingsPageSkeleton } from "@/components/ui/page-skeletons";

/* ── Animations ──────────────────────────────────── */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* ── Steps ───────────────────────────────────────── */
const STEPS = [
  { id: "personal", label: "Personal Info", icon: User, short: "Personal" },
  { id: "experience", label: "Employment", icon: Briefcase, short: "Work" },
  { id: "skills", label: "Skills & Certs", icon: Award, short: "Skills" },
  { id: "education", label: "Education", icon: GraduationCap, short: "Edu" },
];

/* ── Types ───────────────────────────────────────── */
type CVData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    position: string;
    employer: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer?: string;
    year: string;
  }>;
};

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

/* ═══════════════════════════════════════════════════
   CV BUILDER — resume.io style
   Left: form sections │ Right: live preview
   ═══════════════════════════════════════════════════ */
function CVBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [aiGenerated, setAiGenerated] = useState<{
    cvSummary?: string;
    skillTags?: string[];
    keyStrengths?: string[];
    profileReady?: boolean;
    generatedBy?: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const stepId = STEPS[currentStep].id;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  /* ── Load existing data ────────────────────────── */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingCV(true);
        const [cvRes, profileRes] = await Promise.allSettled([
          applicantService.getCV(),
          applicantService.getProfile(),
        ]);

        let loadedCV = initialCVData;

        // Pre-populate from profile
        if (profileRes.status === "fulfilled" && profileRes.value) {
          const p = profileRes.value as any;
          loadedCV = {
            ...loadedCV,
            personalInfo: {
              fullName: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
              email: p.email || "",
              phone: p.phone || "",
              location: p.nationality || "",
              bio: "",
            },
          };
        }

        // Overlay saved CV data
        if (
          cvRes.status === "fulfilled" &&
          cvRes.value &&
          typeof cvRes.value === "object"
        ) {
          const cv = cvRes.value as any;
          loadedCV = {
            personalInfo: {
              fullName:
                cv.personalInfo?.fullName || loadedCV.personalInfo.fullName,
              email: cv.personalInfo?.email || loadedCV.personalInfo.email,
              phone: cv.personalInfo?.phone || loadedCV.personalInfo.phone,
              location:
                cv.personalInfo?.location || loadedCV.personalInfo.location,
              bio: cv.personalInfo?.bio || "",
            },
            summary: cv.cvSummary || cv.summary || "",
            experience: Array.isArray(cv.experience)
              ? cv.experience.map((e: any, i: number) => ({
                  id: e.id || `exp-${i}`,
                  position: e.position || e.title || "",
                  employer: e.employer || e.company || "",
                  startDate: e.startDate || "",
                  endDate: e.endDate || "",
                  description: e.description || "",
                }))
              : [],
            education: Array.isArray(cv.education)
              ? cv.education.map((e: any, i: number) => ({
                  id: e.id || `edu-${i}`,
                  school: e.school || e.institution || "",
                  degree: e.degree || "",
                  year: e.year || "",
                }))
              : [],
            skills: Array.isArray(cv.skills)
              ? cv.skills
              : Array.isArray(cv.skillTags)
                ? cv.skillTags
                : [],
            certifications: Array.isArray(cv.certifications)
              ? cv.certifications.map((c: any, i: number) => ({
                  id: c.id || `cert-${i}`,
                  name: c.name || "",
                  issuer: c.issuer || "",
                  year: c.year || "",
                }))
              : [],
          };

          // Restore AI-generated state
          if (cv.cvSummary || cv.profileReady) {
            setAiGenerated({
              cvSummary: cv.cvSummary || cv.summary || "",
              skillTags: cv.skillTags || cv.skills || [],
              keyStrengths: cv.keyStrengths || [],
              profileReady: cv.profileReady || false,
              generatedBy: cv.generatedBy || "",
            });
          }
        }

        setCVData(loadedCV);
      } catch (error) {
        console.error("Failed to load CV data:", error);
      } finally {
        setIsLoadingCV(false);
      }
    };

    loadData();
  }, []);

  /* ── Step navigation ───────────────────────────── */
  const handleNext = () => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  /* ── Data handlers ─────────────────────────────── */
  const markChanged = () => setHasUnsavedChanges(true);

  const updatePersonal = (
    field: keyof CVData["personalInfo"],
    value: string,
  ) => {
    setCVData((d) => ({
      ...d,
      personalInfo: { ...d.personalInfo, [field]: value },
    }));
    markChanged();
  };

  const addExperience = () => {
    setCVData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        {
          id: `exp-${Date.now()}`,
          position: "",
          employer: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    markChanged();
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCVData((d) => {
      const next = [...d.experience];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, experience: next };
    });
    markChanged();
  };

  const removeExperience = (index: number) => {
    setCVData((d) => ({
      ...d,
      experience: d.experience.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  const addEducation = () => {
    setCVData((d) => ({
      ...d,
      education: [
        ...d.education,
        { id: `edu-${Date.now()}`, school: "", degree: "", year: "" },
      ],
    }));
    markChanged();
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCVData((d) => {
      const next = [...d.education];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, education: next };
    });
    markChanged();
  };

  const removeEducation = (index: number) => {
    setCVData((d) => ({
      ...d,
      education: d.education.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCVData((d) => ({ ...d, skills: [...d.skills, trimmed] }));
      markChanged();
    }
  };

  const removeSkill = (skill: string) => {
    setCVData((d) => ({
      ...d,
      skills: d.skills.filter((s) => s !== skill),
    }));
    markChanged();
  };

  const addCertification = () => {
    setCVData((d) => ({
      ...d,
      certifications: [
        ...d.certifications,
        { id: `cert-${Date.now()}`, name: "", issuer: "", year: "" },
      ],
    }));
    markChanged();
  };

  const updateCertification = (
    index: number,
    field: string,
    value: string,
  ) => {
    setCVData((d) => {
      const next = [...d.certifications];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, certifications: next };
    });
    markChanged();
  };

  const removeCertification = (index: number) => {
    setCVData((d) => ({
      ...d,
      certifications: d.certifications.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  /* ── Build the payload sent to backend ─────────── */
  const buildPayload = () => ({
    personalInfo: cvData.personalInfo,
    summary: cvData.personalInfo.bio || cvData.summary,
    experience: cvData.experience,
    education: cvData.education,
    skills: cvData.skills,
    certifications: cvData.certifications,
  });

  /* ── Save CV ───────────────────────────────────── */
  const saveCV = async () => {
    setIsSaving(true);
    try {
      await applicantService.saveCV(buildPayload());
      setHasUnsavedChanges(false);
      toast.success("CV saved successfully!");
    } catch (error) {
      console.error("Failed to save CV:", error);
      toast.error("Failed to save CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Generate AI CV (Gemini) ───────────────────── */
  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Save latest data first
      await applicantService.saveCV(buildPayload());

      // Then call AI generation endpoint (Gemini on backend)
      const result = await applicantService.generateAICV();
      setAiGenerated({
        cvSummary: result?.cvSummary || result?.summary || "",
        skillTags: result?.skillTags || result?.skills || cvData.skills,
        keyStrengths: result?.keyStrengths || [],
        profileReady: result?.profileReady ?? true,
        generatedBy: result?.generatedBy || "",
      });
      // Update local summary to reflect AI result
      if (result?.cvSummary) {
        setCVData((d) => ({ ...d, summary: result.cvSummary }));
      }
      setHasUnsavedChanges(false);
      toast.success(
        "AI CV generated successfully! Your profile is now employer-ready.",
      );
    } catch (error) {
      console.error("Failed to generate AI CV:", error);
      toast.error("Failed to generate AI CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Download CV as PDF ────────────────────────── */
  const downloadAsPDF = () => {
    const name = cvData.personalInfo.fullName || "CV";
    const summary =
      aiGenerated?.cvSummary || cvData.summary || cvData.personalInfo.bio || "";

    const contactParts = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location,
    ].filter(Boolean);

    const summaryHtml = summary
      ? `<div class="section"><h2>Professional Summary</h2><p>${summary}</p></div>`
      : "";

    const expHtml =
      cvData.experience.length > 0
        ? `<div class="section"><h2>Work Experience</h2>${cvData.experience.map((e) => `<div class="entry"><div class="row"><strong>${e.position || "—"}</strong><span class="date">${e.startDate || ""} – ${e.endDate || ""}</span></div><div class="company">${e.employer || ""}</div>${e.description ? `<p class="desc">${e.description}</p>` : ""}</div>`).join("")}</div>`
        : "";

    const skillsHtml =
      cvData.skills.length > 0
        ? `<div class="section"><h2>Skills</h2><ul class="skills">${cvData.skills.map((s) => `<li>${s}</li>`).join("")}</ul></div>`
        : "";

    const eduHtml =
      cvData.education.length > 0
        ? `<div class="section"><h2>Education</h2>${cvData.education.map((e) => `<div class="entry"><div class="row"><strong>${e.degree || "—"}</strong><span class="date">${e.year || ""}</span></div><div class="company">${e.school || ""}</div></div>`).join("")}</div>`
        : "";

    const certsHtml =
      cvData.certifications.length > 0
        ? `<div class="section"><h2>Certifications</h2><ul class="certs">${cvData.certifications.map((c) => `<li><strong>${c.name || "—"}</strong>${c.issuer ? `, ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}</li>`).join("")}</ul></div>`
        : "";

    const html = `<!DOCTYPE html><html><head><title>${name} — Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @page { size: letter; margin: 0.5in 0.6in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #222; line-height: 1.5; padding: 0.5in 0.6in; width: 8.5in; min-height: 11in; margin: 0 auto; font-size: 13px; }
  h1 { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #222; padding-bottom: 6px; margin-bottom: 4px; }
  .contact { font-size: 11.5px; color: #555; margin-bottom: 16px; padding-top: 4px; }
  .contact span + span::before { content: " | "; color: #aaa; }
  .section { margin-bottom: 14px; }
  h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; border-bottom: 1px solid #999; padding-bottom: 3px; margin-bottom: 8px; color: #333; }
  p { margin-top: 2px; color: #444; }
  .entry { margin-bottom: 10px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .date { font-size: 11.5px; color: #666; white-space: nowrap; }
  .company { font-size: 12px; color: #666; font-style: italic; }
  .desc { font-size: 12px; color: #444; margin-top: 3px; line-height: 1.55; }
  .skills { list-style: none; column-count: 3; column-gap: 16px; }
  .skills li { font-size: 12px; padding: 1.5px 0; }
  .skills li::before { content: "•"; margin-right: 6px; color: #666; }
  .certs { list-style: none; }
  .certs li { font-size: 12px; padding: 2px 0; }
  .certs li::before { content: "–"; margin-right: 6px; color: #999; }
  @media print { body { padding: 0; width: auto; min-height: auto; } }
</style></head><body>
  <h1>${name}</h1>
  <div class="contact">${contactParts.map((p) => `<span>${p}</span>`).join("")}</div>
  ${summaryHtml}${expHtml}${skillsHtml}${eduHtml}${certsHtml}
</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
      toast.success("Print dialog opened — select 'Save as PDF' to download.");
    } else {
      toast.error("Please allow pop-ups to download your CV as PDF.");
    }
  };

  /* ── Loading state ─────────────────────────────── */
  if (isLoadingCV) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading your CV data...</p>
        </div>
      </div>
    );
  }

  /* ── Helpers ────────────────────────────────────── */
  const displaySummary =
    aiGenerated?.cvSummary || cvData.summary || cvData.personalInfo.bio || "";

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-5"
    >
      {/* ── Header ────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-accent" />
            AI CV Builder
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in your details on the left, see your CV update live on the
            right. Hit <strong>Generate with AI</strong> to create a
            professional summary.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={saveCV}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving
              ? "Saving…"
              : hasUnsavedChanges
                ? "Save"
                : "Saved"}
            {!hasUnsavedChanges && !isSaving && (
              <CheckCircle className="w-3 h-3 ml-1 text-emerald-500" />
            )}
          </Button>
          {/* Mobile: toggle preview */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowPreviewMobile((v) => !v)}
          >
            <FileText className="w-4 h-4 mr-1" />
            {showPreviewMobile ? "Editor" : "Preview"}
          </Button>
        </div>
      </motion.div>

      {/* ── Step indicator ────────────────────────── */}
      <motion.div variants={fadeInUp} className="card-premium p-3">
        <div className="flex gap-1.5 sm:gap-2 justify-between items-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === idx;
            const isCompleted = idx < currentStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-md"
                    : isCompleted
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground",
                )}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.short}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Main layout: Form + Live Preview ─────── */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* ═══ LEFT: FORM EDITOR ═══════════════════ */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "lg:w-1/2 xl:w-[45%] flex-shrink-0 space-y-5",
            showPreviewMobile && "hidden lg:block",
          )}
        >
          {/* Form card */}
          <div className="card-premium p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {/* ── Personal Info ────────────── */}
              {stepId === "personal" && (
                <motion.div
                  key="personal"
                  {...fadeInUp}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Personal Information
                  </h2>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
                      Full Name
                    </label>
                    <Input
                      value={cvData.personalInfo.fullName}
                      onChange={(e) =>
                        updatePersonal("fullName", e.target.value)
                      }
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
                        Email
                      </label>
                      <Input
                        value={cvData.personalInfo.email}
                        onChange={(e) =>
                          updatePersonal("email", e.target.value)
                        }
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
                        Phone
                      </label>
                      <Input
                        value={cvData.personalInfo.phone}
                        onChange={(e) =>
                          updatePersonal("phone", e.target.value)
                        }
                        placeholder="+63 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
                      Location / Nationality
                    </label>
                    <Input
                      value={cvData.personalInfo.location}
                      onChange={(e) =>
                        updatePersonal("location", e.target.value)
                      }
                      placeholder="Manila, Philippines"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
                      Professional Summary{" "}
                      <span className="text-xs text-muted-foreground/60">
                        (or let AI generate one)
                      </span>
                    </label>
                    <Textarea
                      value={cvData.personalInfo.bio}
                      onChange={(e) => updatePersonal("bio", e.target.value)}
                      placeholder="Brief overview of your professional background and career goals…"
                      className="min-h-[100px]"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Employment History ────────── */}
              {stepId === "experience" && (
                <motion.div
                  key="experience"
                  {...fadeInUp}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      Employment History
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addExperience}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {cvData.experience.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                      <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-muted-foreground text-sm mb-3">
                        No work experience added yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addExperience}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Your First Experience
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cvData.experience.map((exp, idx) => (
                        <div
                          key={exp.id}
                          className="p-4 border border-border rounded-xl space-y-3 bg-muted/20"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                              Experience #{idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(idx)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">Job Title</label>
                            <Input
                              value={exp.position}
                              onChange={(e) =>
                                updateExperience(idx, "position", e.target.value)
                              }
                              placeholder="e.g. Registered Nurse, Welder"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">Company / Employer</label>
                            <Input
                              value={exp.employer}
                              onChange={(e) =>
                                updateExperience(idx, "employer", e.target.value)
                              }
                              placeholder="e.g. Saudi Aramco, Al Futtaim Group"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-sm font-medium mb-1 block text-muted-foreground">Start Date</label>
                              <Input
                                value={exp.startDate}
                                onChange={(e) =>
                                  updateExperience(idx, "startDate", e.target.value)
                                }
                                placeholder="e.g. Jan 2019"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block text-muted-foreground">End Date</label>
                              <Input
                                value={exp.endDate}
                                onChange={(e) =>
                                  updateExperience(idx, "endDate", e.target.value)
                                }
                                placeholder="e.g. Present"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">Description</label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) =>
                                updateExperience(idx, "description", e.target.value)
                              }
                              placeholder="Key responsibilities and achievements…"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Skills & Certifications ──── */}
              {stepId === "skills" && (
                <motion.div
                  key="skills"
                  {...fadeInUp}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Skills & Certifications
                  </h2>

                  {/* Skills */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">
                      Professional Skills
                    </label>
                    {cvData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cvData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-3 py-1.5 gap-1 bg-accent/10 text-accent border-accent/20"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive transition-colors text-xs"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {cvData.skills.length === 0 && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Type a skill below and click Add or press Enter
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        id="skill-input"
                        placeholder="e.g. Welding, Carpentry, Nursing"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById("skill-input") as HTMLInputElement;
                          if (input?.value) {
                            addSkill(input.value);
                            input.value = "";
                            input.focus();
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-2" />

                  {/* Certifications */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-muted-foreground">
                        Certifications
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCertification}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    {cvData.certifications.length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
                        <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                        <p className="text-muted-foreground text-xs">
                          No certifications added yet
                        </p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {cvData.certifications.map((cert, idx) => (
                        <div
                          key={cert.id}
                          className="p-3 border border-border rounded-xl space-y-2 bg-muted/20"
                        >
                          <div className="flex gap-2 items-center">
                            <Input
                              value={cert.name}
                              onChange={(e) =>
                                updateCertification(
                                  idx,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Certification name"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(idx)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={cert.issuer || ""}
                              onChange={(e) =>
                                updateCertification(
                                  idx,
                                  "issuer",
                                  e.target.value,
                                )
                              }
                              placeholder="Issuer"
                            />
                            <Input
                              value={cert.year}
                              onChange={(e) =>
                                updateCertification(
                                  idx,
                                  "year",
                                  e.target.value,
                                )
                              }
                              placeholder="Year"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Education ────────────────── */}
              {stepId === "education" && (
                <motion.div
                  key="education"
                  {...fadeInUp}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      Education
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEducation}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {cvData.education.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                      <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-muted-foreground text-sm mb-3">
                        No education added yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addEducation}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Your Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cvData.education.map((edu, idx) => (
                        <div
                          key={edu.id}
                          className="p-4 border border-border rounded-xl space-y-3 bg-muted/20"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                              Education #{idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(idx)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">School / University</label>
                            <Input
                              value={edu.school}
                              onChange={(e) =>
                                updateEducation(idx, "school", e.target.value)
                              }
                              placeholder="e.g. University of the Philippines"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <label className="text-sm font-medium mb-1 block text-muted-foreground">Degree / Course</label>
                              <Input
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(idx, "degree", e.target.value)
                                }
                                placeholder="e.g. BS Nursing"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block text-muted-foreground">Year</label>
                              <Input
                                value={edu.year}
                                onChange={(e) =>
                                  updateEducation(idx, "year", e.target.value)
                                }
                                placeholder="e.g. 2020"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step navigation ──────────────── */}
            <div className="flex justify-between mt-6 pt-5 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={isFirstStep}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="flex gap-2">
                {hasUnsavedChanges && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCV}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    Save
                  </Button>
                )}
                {!isLastStep ? (
                  <Button
                    className="gradient-bg-accent text-accent-foreground"
                    size="sm"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── AI Generate Card ──────────────── */}
          <div className="card-premium p-5 sm:p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">
                  AI-Powered CV Generation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Our AI (Gemini) analyzes your information and generates a professional
                  summary, key strengths, and skill tags for employer matching.
                </p>
              </div>
            </div>
            <Button
              onClick={generateWithAI}
              disabled={isGenerating || !cvData.personalInfo.fullName}
              className="w-full gradient-bg-accent text-accent-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            {aiGenerated?.generatedBy && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by{" "}
                <span className="text-accent font-medium">
                  {aiGenerated.generatedBy === "local-fallback"
                    ? "Smart Templates"
                    : "Google Gemini AI"}
                </span>
              </p>
            )}
          </div>
        </motion.div>

        {/* ═══ RIGHT: LIVE CV PREVIEW ═════════════ */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "lg:flex-1 min-w-0",
            !showPreviewMobile && "hidden lg:block",
          )}
        >
          <div className="sticky top-6 space-y-4">
            {/* Preview actions bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Live CV Preview
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAsPDF}
                  disabled={!cvData.personalInfo.fullName}
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>

            {/* AI generated results */}
            {aiGenerated && (
              <div className="space-y-2">
                {aiGenerated.profileReady && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
                    <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                      Profile is employer-ready
                    </span>
                  </div>
                )}
                {aiGenerated.keyStrengths &&
                  aiGenerated.keyStrengths.length > 0 && (
                    <div className="px-3 py-2 rounded-lg bg-accent/5 border border-accent/15">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Star className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-accent">
                          Key Strengths
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {aiGenerated.keyStrengths.map((s, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {aiGenerated.skillTags &&
                  aiGenerated.skillTags.length > 0 && (
                    <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          Skill Tags for Job Matching
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {aiGenerated.skillTags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[11px] py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ── The CV Document (ATS-friendly) ─── */}
            <div
              ref={previewRef}
              className="bg-white dark:bg-zinc-950 border border-border rounded-xl shadow-lg overflow-hidden"
            >
              {/* CV Header — clean, no color */}
              <div className="px-6 sm:px-8 pt-7 pb-4 border-b-2 border-foreground/80">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide mb-1">
                  {cvData.personalInfo.fullName || (
                    <span className="text-muted-foreground/30 italic normal-case font-normal">
                      Your Name
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap gap-x-1 text-[11px] text-muted-foreground">
                  {cvData.personalInfo.email && (
                    <span>{cvData.personalInfo.email}</span>
                  )}
                  {cvData.personalInfo.email && cvData.personalInfo.phone && (
                    <span className="text-muted-foreground/40 mx-1">|</span>
                  )}
                  {cvData.personalInfo.phone && (
                    <span>{cvData.personalInfo.phone}</span>
                  )}
                  {(cvData.personalInfo.email || cvData.personalInfo.phone) &&
                    cvData.personalInfo.location && (
                      <span className="text-muted-foreground/40 mx-1">|</span>
                    )}
                  {cvData.personalInfo.location && (
                    <span>{cvData.personalInfo.location}</span>
                  )}
                </div>
              </div>

              <div className="px-6 sm:px-8 py-5 space-y-4 text-sm">
                {/* Summary */}
                {displaySummary && (
                  <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[1.2px] text-foreground/70 mb-1.5 pb-1 border-b border-muted-foreground/30">
                      Professional Summary
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[12.5px]">
                      {displaySummary}
                    </p>
                  </section>
                )}

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[1.2px] text-foreground/70 mb-2 pb-1 border-b border-muted-foreground/30">
                      Work Experience
                    </h2>
                    <div className="space-y-3">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-foreground text-[13px]">
                              {exp.position || (
                                <span className="text-muted-foreground/30 italic font-normal">
                                  Job Title
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                              {exp.startDate || "—"} – {exp.endDate || "—"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-[12px] italic">
                            {exp.employer || (
                              <span className="text-muted-foreground/30">
                                Company
                              </span>
                            )}
                          </p>
                          {exp.description && (
                            <p className="text-[12px] text-muted-foreground/80 mt-1 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills — 3-column bullet list (always visible) */}
                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-[1.2px] text-foreground/70 mb-2 pb-1 border-b border-muted-foreground/30">
                    Skills
                  </h2>
                  {cvData.skills.length > 0 ? (
                    <ul className="columns-2 sm:columns-3 gap-x-4 list-none">
                      {cvData.skills.map((skill) => (
                        <li
                          key={skill}
                          className="text-[12px] text-foreground py-0.5 before:content-['•'] before:mr-1.5 before:text-muted-foreground/50"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] text-muted-foreground/30 italic">
                      Add skills in Step 3 — they will appear here
                    </p>
                  )}
                </section>

                {/* Education */}
                {cvData.education.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[1.2px] text-foreground/70 mb-2 pb-1 border-b border-muted-foreground/30">
                      Education
                    </h2>
                    <div className="space-y-2">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="flex justify-between">
                          <div>
                            <span className="font-semibold text-foreground text-[13px]">
                              {edu.degree || (
                                <span className="text-muted-foreground/30 italic font-normal">
                                  Degree
                                </span>
                              )}
                            </span>
                            <p className="text-muted-foreground text-[12px] italic">
                              {edu.school || (
                                <span className="text-muted-foreground/30">
                                  School
                                </span>
                              )}
                            </p>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                            {edu.year || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {cvData.certifications.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-[1.2px] text-foreground/70 mb-1.5 pb-1 border-b border-muted-foreground/30">
                      Certifications
                    </h2>
                    <ul className="list-none space-y-0.5">
                      {cvData.certifications.map((c) => (
                        <li
                          key={c.id}
                          className="text-[12px] before:content-['–'] before:mr-1.5 before:text-muted-foreground/40"
                        >
                          <span className="font-semibold text-foreground">
                            {c.name || (
                              <span className="italic text-muted-foreground/30 font-normal">
                                Certificate
                              </span>
                            )}
                          </span>
                          {c.issuer && (
                            <span className="text-muted-foreground">
                              , {c.issuer}
                            </span>
                          )}
                          {c.year && (
                            <span className="text-muted-foreground/60">
                              {" "}({c.year})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Empty state */}
                {!displaySummary &&
                  cvData.experience.length === 0 &&
                  cvData.education.length === 0 &&
                  cvData.skills.length === 0 && (
                    <div className="text-center py-10">
                      <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Start filling in your details on the left
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Your CV will update here in real-time
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CVBuilderPage;
