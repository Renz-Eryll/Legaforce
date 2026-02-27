import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Eye,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { applicantService } from "@/services/applicantService";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const STEPS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Employment", icon: Briefcase },
  { id: "skills", label: "Skills & Certs", icon: Award },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "preview", label: "Preview & Generate", icon: FileText },
];

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

function CVBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [aiGenerated, setAiGenerated] = useState<{
    cvSummary?: string;
    skillTags?: string[];
    keyStrengths?: string[];
    profileReady?: boolean;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const stepId = STEPS[currentStep].id;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Load existing CV data and profile on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingCV(true);
        const [cvRes, profileRes] = await Promise.allSettled([
          applicantService.getCV(),
          applicantService.getProfile(),
        ]);

        let loadedCV = initialCVData;
        
        // First populate from profile
        if (profileRes.status === "fulfilled" && profileRes.value) {
          const p = profileRes.value;
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

        // Then overlay CV data if it exists
        if (cvRes.status === "fulfilled" && cvRes.value && typeof cvRes.value === "object") {
          const cv = cvRes.value;
          loadedCV = {
            personalInfo: {
              fullName: cv.personalInfo?.fullName || loadedCV.personalInfo.fullName,
              email: cv.personalInfo?.email || loadedCV.personalInfo.email,
              phone: cv.personalInfo?.phone || loadedCV.personalInfo.phone,
              location: cv.personalInfo?.location || loadedCV.personalInfo.location,
              bio: cv.personalInfo?.bio || cv.summary || "",
            },
            summary: cv.summary || cv.cvSummary || "",
            experience: Array.isArray(cv.experience) ? cv.experience.map((e: any, i: number) => ({
              id: e.id || `exp-${i}`,
              position: e.position || e.title || "",
              employer: e.employer || e.company || "",
              startDate: e.startDate || "",
              endDate: e.endDate || "",
              description: e.description || "",
            })) : [],
            education: Array.isArray(cv.education) ? cv.education.map((e: any, i: number) => ({
              id: e.id || `edu-${i}`,
              school: e.school || e.institution || "",
              degree: e.degree || "",
              year: e.year || "",
            })) : [],
            skills: Array.isArray(cv.skills) ? cv.skills : (Array.isArray(cv.skillTags) ? cv.skillTags : []),
            certifications: Array.isArray(cv.certifications) ? cv.certifications.map((c: any, i: number) => ({
              id: c.id || `cert-${i}`,
              name: c.name || "",
              issuer: c.issuer || "",
              year: c.year || "",
            })) : [],
          };

          // If AI has been generated before, show it
          if (cv.cvSummary || cv.profileReady) {
            setAiGenerated({
              cvSummary: cv.cvSummary || cv.summary || "",
              skillTags: cv.skillTags || cv.skills || [],
              profileReady: cv.profileReady || false,
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

  const handleNext = () => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const markChanged = () => setHasUnsavedChanges(true);

  const updatePersonal = (field: keyof CVData["personalInfo"], value: string) => {
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

  const updateCertification = (index: number, field: string, value: string) => {
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

  // Save CV data to the backend
  const saveCV = async () => {
    setIsSaving(true);
    try {
      await applicantService.saveCV({
        personalInfo: cvData.personalInfo,
        summary: cvData.personalInfo.bio || cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        certifications: cvData.certifications,
      });
      setHasUnsavedChanges(false);
      toast.success("CV saved successfully!");
    } catch (error) {
      console.error("Failed to save CV:", error);
      toast.error("Failed to save CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate AI CV
  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Save first to ensure backend has latest data
      await applicantService.saveCV({
        personalInfo: cvData.personalInfo,
        summary: cvData.personalInfo.bio || cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        certifications: cvData.certifications,
      });

      // Then generate AI CV
      const result = await applicantService.generateAICV();
      setAiGenerated({
        cvSummary: result?.cvSummary || result?.summary || "CV generated successfully",
        skillTags: result?.skillTags || result?.skills || cvData.skills,
        keyStrengths: result?.keyStrengths || [],
        profileReady: result?.profileReady || true,
      });
      setHasUnsavedChanges(false);
      toast.success("AI CV generated successfully! Your profile is now employer-ready.");
    } catch (error) {
      console.error("Failed to generate AI CV:", error);
      toast.error("Failed to generate AI CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download CV as PDF via print dialog
  const downloadAsPDF = () => {
    const name = cvData.personalInfo.fullName || "CV";
    const summary = aiGenerated?.cvSummary || cvData.personalInfo.bio || cvData.summary || "";

    const expHtml = cvData.experience.length > 0
      ? `<h2>Work Experience</h2>` + cvData.experience.map((e) =>
          `<div class="entry"><div class="entry-header"><strong>${e.position || "—"}</strong><span>${e.startDate || ""} – ${e.endDate || ""}</span></div><div class="sub">${e.employer || ""}</div>${e.description ? `<p>${e.description}</p>` : ""}</div>`
        ).join("")
      : "";

    const eduHtml = cvData.education.length > 0
      ? `<h2>Education</h2>` + cvData.education.map((e) =>
          `<div class="entry"><strong>${e.degree || "—"}</strong> — ${e.school || ""} (${e.year || ""})</div>`
        ).join("")
      : "";

    const skillsHtml = cvData.skills.length > 0
      ? `<h2>Skills</h2><p>${cvData.skills.join(" • ")}</p>`
      : "";

    const certsHtml = cvData.certifications.length > 0
      ? `<h2>Certifications</h2><p>${cvData.certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ""}${c.year ? `, ${c.year}` : ""}`).join(" • ")}</p>`
      : "";

    const strengthsHtml = aiGenerated?.keyStrengths?.length
      ? `<h2>Key Strengths</h2><ul>${(aiGenerated.keyStrengths as string[]).map((s: string) => `<li>${s}</li>`).join("")}</ul>`
      : "";

    const html = `<!DOCTYPE html><html><head><title>${name} — CV</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; color: #1f2937; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #111827; }
  .contact { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
  .contact span { margin-right: 16px; }
  h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin: 24px 0 12px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-header span { font-size: 12px; color: #6b7280; }
  .sub { font-size: 13px; color: #6b7280; }
  p { font-size: 13px; margin-top: 4px; }
  ul { font-size: 13px; padding-left: 20px; }
  li { margin-bottom: 4px; }
  @media print { body { padding: 0; } @page { margin: 1cm; } }
</style></head><body>
  <h1>${name}</h1>
  <div class="contact">
    ${cvData.personalInfo.email ? `<span>${cvData.personalInfo.email}</span>` : ""}
    ${cvData.personalInfo.phone ? `<span>${cvData.personalInfo.phone}</span>` : ""}
    ${cvData.personalInfo.location ? `<span>${cvData.personalInfo.location}</span>` : ""}
  </div>
  ${summary ? `<h2>Professional Summary</h2><p>${summary}</p>` : ""}
  ${strengthsHtml}
  ${expHtml}
  ${eduHtml}
  ${skillsHtml}
  ${certsHtml}
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            AI CV Builder
          </h1>
          <p className="text-muted-foreground">
            Build your professional CV and generate an employer-ready profile with AI.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={saveCV}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
            {!hasUnsavedChanges && !isSaving && (
              <CheckCircle className="w-3 h-3 ml-1 text-emerald-500" />
            )}
          </Button>
          <Button variant="outline" onClick={() => setCurrentStep(4)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </motion.div>

      {/* Step indicator */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  currentStep === idx
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="card-premium p-6">
        <AnimatePresence mode="wait">
          {/* Personal */}
          {stepId === "personal" && (
            <motion.div key="personal" {...fadeInUp} className="space-y-4">
              <h2 className="text-lg font-display font-semibold">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      value={cvData.personalInfo.email}
                      onChange={(e) => updatePersonal("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      value={cvData.personalInfo.phone}
                      onChange={(e) => updatePersonal("phone", e.target.value)}
                      placeholder="+63 xxx xxx xxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location / Nationality</label>
                  <Input
                    value={cvData.personalInfo.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Professional Summary</label>
                  <Textarea
                    value={cvData.personalInfo.bio}
                    onChange={(e) => updatePersonal("bio", e.target.value)}
                    placeholder="Brief overview of your professional background and career goals"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Experience */}
          {stepId === "experience" && (
            <motion.div key="experience" {...fadeInUp} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-display font-semibold">Employment History</h2>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Experience
                </Button>
              </div>
              {cvData.experience.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm mb-3">
                    No work experience added yet
                  </p>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Experience
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cvData.experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-border rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-muted-foreground">
                          Experience #{idx + 1}
                        </span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(idx)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(idx, "position", e.target.value)}
                        placeholder="Job Title"
                      />
                      <Input
                        value={exp.employer}
                        onChange={(e) => updateExperience(idx, "employer", e.target.value)}
                        placeholder="Company / Employer"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                          placeholder="Start (e.g. Jan 2019)"
                        />
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                          placeholder="End (e.g. Present)"
                        />
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, "description", e.target.value)}
                        placeholder="Key responsibilities and achievements"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Skills & Certifications */}
          {stepId === "skills" && (
            <motion.div key="skills" {...fadeInUp} className="space-y-6">
              <h2 className="text-lg font-display font-semibold">Skills & Certifications</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Professional Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {cvData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1.5 gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {cvData.skills.length === 0 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Type a skill below and press Enter to add it
                  </p>
                )}
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium">Certifications</label>
                  <Button type="button" variant="outline" size="sm" onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                </div>
                <div className="space-y-3">
                  {cvData.certifications.map((cert, idx) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-border rounded-xl flex flex-wrap gap-2 items-center"
                    >
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(idx, "name", e.target.value)}
                        placeholder="Certification name"
                        className="flex-1 min-w-[140px]"
                      />
                      <Input
                        value={cert.issuer || ""}
                        onChange={(e) => updateCertification(idx, "issuer", e.target.value)}
                        placeholder="Issuer"
                        className="flex-1 min-w-[120px]"
                      />
                      <Input
                        value={cert.year}
                        onChange={(e) => updateCertification(idx, "year", e.target.value)}
                        placeholder="Year"
                        className="w-20"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(idx)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Education */}
          {stepId === "education" && (
            <motion.div key="education" {...fadeInUp} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-display font-semibold">Education</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </Button>
              </div>
              {cvData.education.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm mb-3">
                    No education added yet
                  </p>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your Education
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cvData.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="p-4 border border-border rounded-xl flex flex-wrap gap-2 items-center"
                    >
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, "school", e.target.value)}
                        placeholder="School / University"
                        className="flex-1 min-w-[180px]"
                      />
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        placeholder="Degree"
                        className="flex-1 min-w-[140px]"
                      />
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(idx, "year", e.target.value)}
                        placeholder="Year"
                        className="w-24"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(idx)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Preview & Generate */}
          {stepId === "preview" && (
            <motion.div key="preview" {...fadeInUp} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <h2 className="text-lg font-display font-semibold">
                  Preview & AI-Generated Profile
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={downloadAsPDF}
                    disabled={!cvData.personalInfo.fullName}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={generateWithAI}
                    disabled={isGenerating}
                    className="gradient-bg-accent text-accent-foreground"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {aiGenerated && (
                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 space-y-2">
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <FileText className="w-4 h-4" />
                      Professional CV Summary
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiGenerated.cvSummary}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500 font-medium">
                      <Zap className="w-4 h-4" />
                      Employer-Ready Profile
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiGenerated.profileReady
                        ? "✓ Your profile is ready to be shown to employers for candidate matching."
                        : "Generate your AI CV to make your profile employer-ready."}
                    </p>
                  </div>
                  {aiGenerated.skillTags && aiGenerated.skillTags.length > 0 && (
                    <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 space-y-2">
                      <div className="flex items-center gap-2 text-accent font-medium">
                        <Tag className="w-4 h-4" />
                        Skill Tags for Job Matching
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiGenerated.skillTags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CV Preview */}
              <div className="bg-background border rounded-xl p-6 text-foreground">
                <div className="mb-6 border-b border-border pb-4">
                  <h1 className="text-2xl font-bold mb-1">
                    {cvData.personalInfo.fullName || "Your Name"}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                    {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
                    {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
                  </div>
                </div>
                {(cvData.personalInfo.bio || cvData.summary) && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-2 text-accent">
                      Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed">
                      {cvData.personalInfo.bio || cvData.summary}
                    </p>
                  </div>
                )}
                {cvData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3 text-accent">
                      Work Experience
                    </h2>
                    <div className="space-y-3">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">{exp.position || "—"}</span>
                            <span className="text-muted-foreground">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{exp.employer}</p>
                          {exp.description && <p className="mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cvData.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3 text-accent">Education</h2>
                    <div className="space-y-2">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="text-sm">
                          <span className="font-semibold">{edu.degree || "—"}</span>
                          {" – "}
                          <span className="text-muted-foreground">
                            {edu.school} ({edu.year})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(cvData.skills.length > 0 || cvData.certifications.length > 0) && (
                  <div>
                    <h2 className="text-sm font-semibold mb-2 text-accent">
                      Skills & Certifications
                    </h2>
                    <p className="text-sm">
                      {cvData.skills.join(" • ")}
                      {cvData.skills.length && cvData.certifications.length ? " • " : ""}
                      {cvData.certifications
                        .map((c) => `${c.name}${c.year ? ` (${c.year})` : ""}`)
                        .join(" • ")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-6 pt-6 border-t border-border">
          <Button variant="outline" onClick={handlePrev} disabled={isFirstStep}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button variant="outline" onClick={saveCV} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save
              </Button>
            )}
            {!isLastStep ? (
              <Button className="gradient-bg-accent text-accent-foreground" onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CVBuilderPage;
