import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const mockProfile = {
  firstName: "Maria",
  lastName: "Santos",
  email: "maria.santos@email.com",
  phone: "+63 917 123 4567",
  location: "Manila, Philippines",
  bio: "Experienced RN with 5+ years of ICU experience and passion for patient care.",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  profileCompletion: 85,
  skills: ["Patient Care", "ICU Experience", "BLS/CPR", "Patient Education"],
  certifications: [
    {
      id: "CERT-001",
      name: "RN License",
      issuer: "PRC Philippines",
      date: "2020-06-15",
    },
    {
      id: "CERT-002",
      name: "BLS/CPR Certification",
      issuer: "American Heart Association",
      date: "2024-03-20",
    },
  ],
  experience: [
    {
      id: "EXP-001",
      position: "Registered Nurse - ICU",
      employer: "Philippine General Hospital",
      startDate: "2019-01-10",
      endDate: "Present",
      description: "Provided critical patient care in intensive care unit",
    },
    {
      id: "EXP-002",
      position: "Registered Nurse - Ward",
      employer: "St. Luke's Medical Center",
      startDate: "2018-06-01",
      endDate: "2018-12-31",
      description: "General nursing duties in medical-surgical ward",
    },
  ],
};

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [formData, setFormData] = useState(mockProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

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
            <img
              src={profile.avatar}
              alt={profile.firstName}
              className="w-32 h-32 rounded-full object-cover border-4 border-accent/20"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                />
                <Input
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Bio"
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
                  {profile.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="self-start"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={handleSave}
              className="gradient-bg-accent text-accent-foreground self-start"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
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
            <span className="text-sm font-semibold">
              {profile.profileCompletion}%
            </span>
          </div>
          <Progress value={profile.profileCompletion} className="h-2" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Professional Skills</h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                    {skill}
                    <button className="ml-2 hover:text-red-600">×</button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Certifications & Licenses</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Certification
              </Button>
            </div>
            <div className="space-y-4">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-accent" />
                        <h4 className="font-medium">{cert.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Issued: {new Date(cert.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Work Experience</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            </div>
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-accent" />
                        <h4 className="font-medium">{exp.position}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exp.employer}
                      </p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.endDate === "Present"
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;
