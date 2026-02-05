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
  Users,
  Award,
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

const mockCompany = {
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
  trustScore: 95,
  activeJobOrders: 5,
  deployedWorkers: 45,
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
            Manage your company information
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

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {company.trustScore}%
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Active Job Orders
          </p>
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
      </motion.div>

      {/* Profile Info */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex gap-6 mb-6 pb-6 border-b">
          <img
            src={company.logo}
            alt={company.name}
            className="w-24 h-24 rounded-lg object-cover bg-secondary"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <Input defaultValue={company.name} placeholder="Company Name" />
                <Input defaultValue={company.location} placeholder="Location" />
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

        {/* Details */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input defaultValue={company.phone} placeholder="Phone" />
                <Input defaultValue={company.email} placeholder="Email" />
              </div>
              <Input defaultValue={company.website} placeholder="Website" />
              <textarea
                defaultValue={company.description}
                placeholder="Company Description"
                className="w-full p-3 border rounded-lg border-input"
                rows={4}
              />
            </div>
          ) : (
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
          )}
          {!isEditing && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">About</p>
              <p className="text-muted-foreground">{company.description}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CompanyProfilePage;
