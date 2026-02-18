import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Save,
  Globe,
  MapPin,
  Phone,
  Mail,
  Building2,
  Upload,
  FileCheck,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

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

// Client Registration & Verification: Company or Personal Recruiter, document upload & admin approval
const mockCompany = {
  clientType: "company" as "company" | "personal",
  name: "King Faisal Hospital",
  logo: "https://via.placeholder.com/100",
  location: "Riyadh, Saudi Arabia",
  phone: "+966 11 123 4567",
  email: "hr@kingfaisal.sa",
  website: "www.kingfaisal.sa",
  industry: "Healthcare",
  founded: "2010",
  employees: "2,500+",
  description:
    "Leading healthcare provider in the Middle East with state-of-the-art medical facilities and world-class patient care.",
  verificationStatus: "approved" as "pending" | "approved" | "rejected",
  trustScore: 95,
  trustRatedByWorkers: 4.6,
  trustRatedByAdmin: 98,
  activeJobOrders: 5,
  deployedWorkers: 45,
  documents: [
    { id: "DOC-1", name: "Business License", status: "approved" as const, uploadedAt: "2025-01-10" },
    { id: "DOC-2", name: "Tax Registration", status: "approved" as const, uploadedAt: "2025-01-10" },
    { id: "DOC-3", name: "Authorized Signatory ID", status: "pending" as const, uploadedAt: "2025-01-15" },
  ],
};

function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(mockCompany);

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
          <h1 className="text-3xl font-display font-bold mb-1">
            Company Profile
          </h1>
          <p className="text-muted-foreground">
            Client registration, documents & verification
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      {/* Employer Rating & Trust Score - Rated by deployed workers + admin; high score = faster approvals & priority sourcing */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-accent" />
          <h2 className="text-lg font-semibold">Employer Rating & Trust Score</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Your score is based on ratings from deployed workers and admin performance metrics. High score = faster approvals & priority sourcing.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Overall Trust Score</p>
            <p className="text-2xl font-display font-bold text-emerald-600">
              {company.trustScore}%
            </p>
            <Progress value={company.trustScore} className="h-2 mt-2" />
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Rated by Deployed Workers</p>
            <p className="text-2xl font-display font-bold">{company.trustRatedByWorkers}/5</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Admin Performance Metrics</p>
            <p className="text-2xl font-display font-bold">{company.trustRatedByAdmin}%</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Faster approvals
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Priority sourcing
          </span>
        </div>
      </motion.div>

      {/* Verification status & Client type */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4">Registration & Verification</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Client type</Label>
            <RadioGroup
              value={company.clientType}
              onValueChange={(v: "company" | "personal") =>
                setCompany({ ...company, clientType: v })
              }
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer font-normal">
                  <Building2 className="w-4 h-4" />
                  Company
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal" className="flex items-center gap-2 cursor-pointer font-normal">
                  <User className="w-4 h-4" />
                  Personal Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Verification:</span>
            {company.verificationStatus === "approved" && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
            {company.verificationStatus === "pending" && (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Clock className="w-3 h-3 mr-1" />
                Pending admin approval
              </Badge>
            )}
            {company.verificationStatus === "rejected" && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Rejected
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Document upload & admin approval */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents
          </h2>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload document
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Upload required documents. Admin will review and approve.
        </p>
        <div className="space-y-3">
          {company.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {doc.status === "approved" ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <FileCheck className="w-3 h-3 mr-1" />
                  Approved
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending approval
                </Badge>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Job Orders</p>
          <p className="text-2xl font-display font-bold">
            {company.activeJobOrders}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Deployed Workers</p>
          <p className="text-2xl font-display font-bold text-accent">
            {company.deployedWorkers}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {company.trustScore}%
          </p>
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Company info</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="pt-4">
            <div className="flex gap-6 mb-6 pb-6 border-b">
              <img
                src={company.logo}
                alt={company.name}
                className="w-24 h-24 rounded-lg object-cover bg-secondary"
              />
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={company.name}
                      onChange={(e) =>
                        setCompany({ ...company, name: e.target.value })
                      }
                      placeholder="Company Name"
                    />
                    <Input
                      value={company.location}
                      onChange={(e) =>
                        setCompany({ ...company, location: e.target.value })
                      }
                      placeholder="Location"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{company.name}</h2>
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {company.industry}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      value={company.phone}
                      onChange={(e) =>
                        setCompany({ ...company, phone: e.target.value })
                      }
                      placeholder="Phone"
                    />
                    <Input
                      value={company.email}
                      onChange={(e) =>
                        setCompany({ ...company, email: e.target.value })
                      }
                      placeholder="Email"
                    />
                  </div>
                  <Input
                    value={company.website}
                    onChange={(e) =>
                      setCompany({ ...company, website: e.target.value })
                    }
                    placeholder="Website"
                  />
                  <textarea
                    value={company.description}
                    onChange={(e) =>
                      setCompany({ ...company, description: e.target.value })
                    }
                    placeholder="Company Description"
                    className="w-full p-3 border rounded-lg border-input"
                    rows={4}
                  />
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-accent cursor-pointer hover:underline">
                        {company.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{company.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Website</p>
                      <p className="font-medium text-accent cursor-pointer hover:underline">
                        {company.website}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Employees</p>
                      <p className="font-medium">{company.employees}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">About</p>
                    <p className="text-muted-foreground">{company.description}</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default CompanyProfilePage;
