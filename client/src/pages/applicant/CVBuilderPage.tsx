import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const mockCVData = {
  personalInfo: {
    fullName: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+63 917 123 4567",
    location: "Manila, Philippines",
    bio: "Experienced Registered Nurse with 5+ years in ICU care",
  },
  summary:
    "Dedicated healthcare professional with extensive experience in critical care nursing. Skilled in patient assessment, emergency response, and team collaboration. Committed to providing compassionate care in high-pressure environments.",
  experience: [
    {
      id: "EXP-001",
      position: "Registered Nurse - ICU",
      employer: "Philippine General Hospital",
      startDate: "Jan 2019",
      endDate: "Present",
      description: "Critical care nursing for post-operative and ICU patients",
    },
    {
      id: "EXP-002",
      position: "Staff Nurse",
      employer: "St. Luke's Medical Center",
      startDate: "Jun 2018",
      endDate: "Dec 2018",
      description: "General medical-surgical nursing",
    },
  ],
  education: [
    {
      id: "EDU-001",
      school: "University of the Philippines",
      degree: "Bachelor of Science in Nursing",
      year: "2018",
    },
  ],
  skills: [
    "Patient Care",
    "ICU Experience",
    "Vital Signs Monitoring",
    "Patient Education",
    "Team Leadership",
    "Emergency Response",
  ],
  certifications: [
    {
      id: "CERT-001",
      name: "RN License - PRC",
      year: "2020",
    },
    {
      id: "CERT-002",
      name: "BLS/CPR Certification",
      year: "2024",
    },
  ],
};

function CVBuilderPage() {
<<<<<<< Updated upstream
  const [activeTab, setActiveTab] = useState("preview");
  const [cvData, setCVData] = useState(mockCVData);
  const [isEditing, setIsEditing] = useState(false);
=======
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

  // Generate AI CV from current form input (server merges with saved CV and persists)
  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      const snapshot = {
        personalInfo: cvData.personalInfo,
        summary: cvData.personalInfo.bio || cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        certifications: cvData.certifications,
      };
      const result = await applicantService.generateAICV(snapshot);
      if (result && typeof result === "object") {
        const pi = (result as { personalInfo?: CVData["personalInfo"] }).personalInfo;
        if (pi) {
          setCVData((d) => ({
            ...d,
            personalInfo: {
              fullName: pi.fullName ?? d.personalInfo.fullName,
              email: pi.email ?? d.personalInfo.email,
              phone: pi.phone ?? d.personalInfo.phone,
              location: pi.location ?? d.personalInfo.location,
              bio: pi.bio ?? d.personalInfo.bio,
            },
          }));
        }
      }
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
>>>>>>> Stashed changes

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">CV Builder</h1>
          <p className="text-muted-foreground">
            Create and manage your professional resume
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <Input
                  defaultValue={cvData.personalInfo.fullName}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <Input
                    defaultValue={cvData.personalInfo.email}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Phone
                  </label>
                  <Input
                    defaultValue={cvData.personalInfo.phone}
                    placeholder="+63 xxx xxx xxxx"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Location
                </label>
                <Input
                  defaultValue={cvData.personalInfo.location}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Professional Summary
                </label>
                <textarea
                  defaultValue={cvData.summary}
                  placeholder="Brief overview of your professional background"
                  className="w-full p-3 border rounded-lg border-input"
                  rows={4}
                />
              </div>
              <Button className="gradient-bg-accent text-accent-foreground">
                Save Personal Info
              </Button>
            </div>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Work Experience</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            </div>
            <div className="space-y-4">
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Input
                        defaultValue={exp.position}
                        placeholder="Job Title"
                        className="mb-2"
                      />
                      <Input
                        defaultValue={exp.employer}
                        placeholder="Company"
                        className="mb-2"
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 mb-2">
                    <Input
                      defaultValue={exp.startDate}
                      placeholder="Start Date"
                    />
                    <Input defaultValue={exp.endDate} placeholder="End Date" />
                  </div>
                  <textarea
                    defaultValue={exp.description}
                    placeholder="Description"
                    className="w-full p-2 border rounded border-input text-sm"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Education</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            </div>
            <div className="space-y-4">
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Input
                        defaultValue={edu.school}
                        placeholder="School/University"
                        className="mb-2"
                      />
                      <Input
                        defaultValue={edu.degree}
                        placeholder="Degree"
                        className="mb-2"
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <Input defaultValue={edu.year} placeholder="Year Completed" />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Professional Skills</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {cvData.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                  {skill}
                  <button className="ml-2">×</button>
                </Badge>
              ))}
            </div>
            <Input placeholder="Add a new skill and press Enter" />
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-6">
            <div className="bg-white text-gray-900 p-8 rounded-lg border">
              {/* Header */}
              <div className="mb-6 border-b pb-6">
                <h1 className="text-3xl font-bold mb-1">
                  {cvData.personalInfo.fullName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{cvData.personalInfo.email}</span>
                  <span>{cvData.personalInfo.phone}</span>
                  <span>{cvData.personalInfo.location}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700">{cvData.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Work Experience</h2>
                <div className="space-y-4">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">{exp.position}</span>
                        <span className="text-gray-600">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-600">{exp.employer}</p>
                      <p className="text-gray-700 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">{edu.degree}</span>
                        <span className="text-gray-600">{edu.year}</span>
                      </div>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <p className="text-sm">{cvData.skills.join(" • ")}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default CVBuilderPage;
