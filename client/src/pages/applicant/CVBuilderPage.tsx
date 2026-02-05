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
  const [activeTab, setActiveTab] = useState("preview");
  const [cvData, setCVData] = useState(mockCVData);
  const [isEditing, setIsEditing] = useState(false);

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
