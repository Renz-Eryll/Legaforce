import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Plus,
  Trash2,
  Award,
  Briefcase,
  Loader2,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicantService } from "@/services/applicantService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string | null;
  bio: string;
  skills: string[];
  certifications: Array<{ name: string; issuer?: string; date?: string }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{ school: string; degree: string; year: string }>;
  profileCompletion: number;
}

function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const emptyProfile: ProfileData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "PH",
    dateOfBirth: null,
    bio: "",
    skills: [],
    certifications: [],
    experience: [],
    education: [],
    profileCompletion: 0,
  };

  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [formData, setFormData] = useState<ProfileData>(emptyProfile);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [profileRes, completionRes] = await Promise.all([
          applicantService.getProfile().catch(() => null),
          applicantService.getProfileCompletion().catch(() => 0),
        ]);

        if (profileRes) {
          const cv = profileRes.aiGeneratedCV || {};
          const data: ProfileData = {
            firstName: profileRes.firstName || "",
            lastName: profileRes.lastName || "",
            email: profileRes.email || user?.email || "",
            phone: profileRes.phone || "",
            nationality: profileRes.nationality || "PH",
            dateOfBirth: profileRes.dateOfBirth
              ? new Date(profileRes.dateOfBirth).toISOString().split("T")[0]
              : null,
            bio: cv.summary || "",
            skills: cv.skills || [],
            certifications: cv.certifications || [],
            experience: cv.experience || [],
            education: cv.education || [],
            profileCompletion: typeof completionRes === "number" ? completionRes : 0,
          };
          setProfile(data);
          setFormData(data);
          setProfileCompletion(data.profileCompletion);
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await applicantService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth || undefined,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
        certifications: formData.certifications.map((c) =>
          typeof c === "string" ? c : c.name,
        ),
      });
      setProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");

      // Refresh completion score
      const comp = await applicantService.getProfileCompletion().catch(() => profileCompletion);
      setProfileCompletion(typeof comp === "number" ? comp : profileCompletion);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (idx: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === idx ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeExperience = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }],
    }));
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === idx ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const removeEducation = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-4 border-accent/20 flex items-center justify-center">
              <User className="w-16 h-16 text-accent/40" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl font-display font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <Input
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Nationality"
                />
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  placeholder="Date of Birth"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio about yourself..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
                />
              </div>
            ) : (
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {profile.phone || "Not provided"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.nationality || "Not provided"}
                </div>
                {profile.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit / Save Buttons */}
          <div className="flex gap-2 self-start">
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gradient-bg-accent text-accent-foreground"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {!isEditing && profile.bio && (
          <p className="text-muted-foreground mb-4 p-3 bg-secondary rounded-lg">
            {profile.bio}
          </p>
        )}

        {/* Profile Completion */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Profile Completeness</p>
            <span className="text-sm font-semibold">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Professional Skills</h3>
              </div>

              {isEditing && (
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button variant="outline" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing ? formData.skills : profile.skills).map(
                  (skill, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                      {skill}
                      {isEditing && (
                        <button
                          className="ml-2 hover:text-red-600"
                          onClick={() => removeSkill(idx)}
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ),
                )}
                {(isEditing ? formData.skills : profile.skills).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet.{" "}
                    {!isEditing && "Click Edit Profile to add your skills."}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Work Experience</h3>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Experience
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? formData.experience : profile.experience).map(
                (exp, idx) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Experience #{idx + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(idx)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(idx, "position", e.target.value)
                          }
                          placeholder="Position / Title"
                        />
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(idx, "company", e.target.value)
                          }
                          placeholder="Company Name"
                        />
                        <Input
                          value={exp.duration}
                          onChange={(e) =>
                            updateExperience(idx, "duration", e.target.value)
                          }
                          placeholder="Duration (e.g. 2019 – Present)"
                        />
                        <Input
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(idx, "description", e.target.value)
                          }
                          placeholder="Brief description"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Briefcase className="w-4 h-4 text-accent" />
                              <h4 className="font-medium">{exp.position}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {exp.company}
                            </p>
                            {exp.description && (
                              <p className="text-sm">{exp.description}</p>
                            )}
                          </div>
                        </div>
                        {exp.duration && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Calendar className="w-3 h-3" />
                            {exp.duration}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ),
              )}
              {(isEditing ? formData.experience : profile.experience).length ===
                0 && (
                <p className="text-sm text-muted-foreground">
                  No experience added yet.{" "}
                  {!isEditing && "Click Edit Profile to add your experience."}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Education</h3>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? formData.education : profile.education).map(
                (edu, idx) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Education #{idx + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(idx)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                        <Input
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(idx, "school", e.target.value)
                          }
                          placeholder="School / University"
                        />
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(idx, "degree", e.target.value)
                          }
                          placeholder="Degree"
                        />
                        <Input
                          value={edu.year}
                          onChange={(e) =>
                            updateEducation(idx, "year", e.target.value)
                          }
                          placeholder="Year"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-accent" />
                            <h4 className="font-medium">
                              {edu.degree || "Degree"}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {edu.school}
                          </p>
                          {edu.year && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {edu.year}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
              {(isEditing ? formData.education : profile.education).length ===
                0 && (
                <p className="text-sm text-muted-foreground">
                  No education added yet.{" "}
                  {!isEditing && "Click Edit Profile to add your education."}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;
