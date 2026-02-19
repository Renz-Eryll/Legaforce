import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const STEPS = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "experience", label: "Employment History", icon: Briefcase },
  { id: "skills", label: "Skills & Certifications", icon: Award },
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
    profileReady?: boolean;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stepId = STEPS[currentStep].id;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const updatePersonal = (
    field: keyof CVData["personalInfo"],
    value: string,
  ) => {
    setCVData((d) => ({
      ...d,
      personalInfo: { ...d.personalInfo, [field]: value },
    }));
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
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCVData((d) => {
      const next = [...d.experience];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, experience: next };
    });
  };

  const removeExperience = (index: number) => {
    setCVData((d) => ({
      ...d,
      experience: d.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setCVData((d) => ({
      ...d,
      education: [
        ...d.education,
        { id: `edu-${Date.now()}`, school: "", degree: "", year: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCVData((d) => {
      const next = [...d.education];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, education: next };
    });
  };

  const removeEducation = (index: number) => {
    setCVData((d) => ({
      ...d,
      education: d.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCVData((d) => ({ ...d, skills: [...d.skills, trimmed] }));
    }
  };

  const removeSkill = (skill: string) => {
    setCVData((d) => ({
      ...d,
      skills: d.skills.filter((s) => s !== skill),
    }));
  };

  const addCertification = () => {
    setCVData((d) => ({
      ...d,
      certifications: [
        ...d.certifications,
        { id: `cert-${Date.now()}`, name: "", issuer: "", year: "" },
      ],
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setCVData((d) => {
      const next = [...d.certifications];
      (next[index] as Record<string, string>)[field] = value;
      return { ...d, certifications: next };
    });
  };

  const removeCertification = (index: number) => {
    setCVData((d) => ({
      ...d,
      certifications: d.certifications.filter((_, i) => i !== index),
    }));
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Placeholder: in production, call API to generate summary + skill tags
      await new Promise((r) => setTimeout(r, 1500));
      const summary =
        cvData.summary ||
        `Professional profile for ${cvData.personalInfo.fullName || "applicant"} with experience in ${
          cvData.experience
            .map((e) => e.position)
            .filter(Boolean)
            .join(", ") || "various roles"
        }.`;
      const tags = [
        ...cvData.skills,
        ...cvData.certifications.map((c) => c.name).filter(Boolean),
      ].filter(Boolean);
      if (tags.length === 0) tags.push("Detail-oriented", "Team player");
      setAiGenerated({
        cvSummary: summary,
        skillTags: [...new Set(tags)],
        profileReady: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
          <h1 className="text-3xl font-display font-bold mb-1">
            One-Time Registration – AI CV Builder
          </h1>
          <p className="text-muted-foreground">
            Simple guided form. We generate a clean CV and employer-ready
            profile.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentStep(4)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
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
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  currentStep === idx
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {step.label}
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
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <Input
                      value={cvData.personalInfo.email}
                      onChange={(e) => updatePersonal("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Phone
                    </label>
                    <Input
                      value={cvData.personalInfo.phone}
                      onChange={(e) => updatePersonal("phone", e.target.value)}
                      placeholder="+63 xxx xxx xxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Input
                    value={cvData.personalInfo.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Professional Summary
                  </label>
                  <Textarea
                    value={cvData.personalInfo.bio}
                    onChange={(e) => updatePersonal("bio", e.target.value)}
                    placeholder="Brief overview of your professional background"
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
                <h2 className="text-lg font-semibold">Employment History</h2>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Experience
                </Button>
              </div>
              {cvData.experience.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Add your work experience. Click &quot;Add Experience&quot; to
                  start.
                </p>
              ) : (
                <div className="space-y-4">
                  {cvData.experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-muted-foreground">
                          Experience #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(idx)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(idx, "position", e.target.value)
                        }
                        placeholder="Job Title"
                      />
                      <Input
                        value={exp.employer}
                        onChange={(e) =>
                          updateExperience(idx, "employer", e.target.value)
                        }
                        placeholder="Company"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(idx, "startDate", e.target.value)
                          }
                          placeholder="Start (e.g. Jan 2019)"
                        />
                        <Input
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(idx, "endDate", e.target.value)
                          }
                          placeholder="End (e.g. Present)"
                        />
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(idx, "description", e.target.value)
                        }
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
              <h2 className="text-lg font-semibold">Skills & Certifications</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Professional Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {cvData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1.5 gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                </div>
                <div className="space-y-3">
                  {cvData.certifications.map((cert, idx) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-border rounded-lg flex flex-wrap gap-2 items-center"
                    >
                      <Input
                        value={cert.name}
                        onChange={(e) =>
                          updateCertification(idx, "name", e.target.value)
                        }
                        placeholder="Certification name"
                        className="flex-1 min-w-[140px]"
                      />
                      <Input
                        value={cert.issuer || ""}
                        onChange={(e) =>
                          updateCertification(idx, "issuer", e.target.value)
                        }
                        placeholder="Issuer"
                        className="flex-1 min-w-[120px]"
                      />
                      <Input
                        value={cert.year}
                        onChange={(e) =>
                          updateCertification(idx, "year", e.target.value)
                        }
                        placeholder="Year"
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(idx)}
                      >
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
                <h2 className="text-lg font-semibold">Education</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </Button>
              </div>
              {cvData.education.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Add your education. Click &quot;Add Education&quot; to start.
                </p>
              ) : (
                <div className="space-y-4">
                  {cvData.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="p-4 border border-border rounded-lg flex flex-wrap gap-2 items-center"
                    >
                      <Input
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(idx, "school", e.target.value)
                        }
                        placeholder="School / University"
                        className="flex-1 min-w-[180px]"
                      />
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(idx, "degree", e.target.value)
                        }
                        placeholder="Degree"
                        className="flex-1 min-w-[140px]"
                      />
                      <Input
                        value={edu.year}
                        onChange={(e) =>
                          updateEducation(idx, "year", e.target.value)
                        }
                        placeholder="Year"
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(idx)}
                      >
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
                <h2 className="text-lg font-semibold">
                  Preview & AI-Generated Outputs
                </h2>
                <Button
                  onClick={generateWithAI}
                  disabled={isGenerating}
                  className="gradient-bg-accent text-accent-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating…" : "Generate with AI"}
                </Button>
              </div>

              {aiGenerated && (
                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 space-y-2">
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <FileText className="w-4 h-4" />
                      Clean professional CV summary
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiGenerated.cvSummary}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 space-y-2">
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <Zap className="w-4 h-4" />
                      Employer-ready profile
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiGenerated.profileReady
                        ? "Your profile is ready to be shown to employers."
                        : ""}
                    </p>
                  </div>
                  {aiGenerated.skillTags &&
                    aiGenerated.skillTags.length > 0 && (
                      <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 space-y-2">
                        <div className="flex items-center gap-2 text-accent font-medium">
                          <Tag className="w-4 h-4" />
                          Skill tags for search
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

              <div className="bg-background border rounded-lg p-6 text-foreground">
                <div className="mb-6 border-b pb-4">
                  <h1 className="text-2xl font-bold mb-1">
                    {cvData.personalInfo.fullName || "Your Name"}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{cvData.personalInfo.email || "—"}</span>
                    <span>{cvData.personalInfo.phone || "—"}</span>
                    <span>{cvData.personalInfo.location || "—"}</span>
                  </div>
                </div>
                {(cvData.personalInfo.bio || cvData.summary) && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-2">
                      Professional Summary
                    </h2>
                    <p className="text-sm">
                      {cvData.personalInfo.bio || cvData.summary}
                    </p>
                  </div>
                )}
                {cvData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3">
                      Work Experience
                    </h2>
                    <div className="space-y-3">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              {exp.position || "—"}
                            </span>
                            <span className="text-muted-foreground">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {exp.employer}
                          </p>
                          {exp.description && (
                            <p className="mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cvData.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3">Education</h2>
                    <div className="space-y-2">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="text-sm">
                          <span className="font-semibold">
                            {edu.degree || "—"}
                          </span>
                          {" – "}
                          <span className="text-muted-foreground">
                            {edu.school} ({edu.year})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(cvData.skills.length > 0 ||
                  cvData.certifications.length > 0) && (
                  <div>
                    <h2 className="text-sm font-semibold mb-2">
                      Skills & Certifications
                    </h2>
                    <p className="text-sm">
                      {cvData.skills.join(" • ")}
                      {cvData.skills.length && cvData.certifications.length
                        ? " • "
                        : ""}
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

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={isFirstStep}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {!isLastStep ? (
            <Button
              className="gradient-bg-accent text-accent-foreground"
              onClick={handleNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CVBuilderPage;
