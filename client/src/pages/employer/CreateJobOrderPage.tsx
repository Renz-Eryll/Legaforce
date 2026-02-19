import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employerService } from "@/services/employerService";
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

function CreateJobOrderPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [positions, setPositions] = useState("1");
  const [salary, setSalary] = useState("");
  const [contractDuration, setContractDuration] = useState("2years");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [benefits, setBenefits] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState("");

  const addRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const removeRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (status: string = "ACTIVE") => {
    if (!title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Job description is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await employerService.createJobOrder({
        title: title.trim(),
        description: description.trim(),
        requirements: {
          items: requirements,
          contractDuration,
          benefits: benefits
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean),
        },
        salary: salary ? parseFloat(salary.replace(/[^0-9.]/g, "")) : undefined,
        location: location.trim(),
        positions: parseInt(positions) || 1,
        status,
      });
      toast.success(
        status === "ACTIVE"
          ? "Job order posted successfully!"
          : "Job order saved as draft"
      );
      navigate("/employer/job-orders");
    } catch (error: any) {
      console.error("Failed to create job order:", error);
      toast.error(error?.response?.data?.message || "Failed to create job order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.button
        variants={fadeInUp}
        onClick={() => navigate("/employer/job-orders")}
        className="flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Orders
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">
          Create Job Order
        </h1>
        <p className="text-muted-foreground">Post a new job opportunity</p>
      </motion.div>

      {/* Form */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Job Title *
              </label>
              <Input
                placeholder="e.g., Registered Nurse (ICU)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Number of Positions *
                </label>
                <Input
                  type="number"
                  placeholder="5"
                  min="1"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Salary (Monthly USD)
                </label>
                <Input
                  placeholder="2500"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Contract Duration
              </label>
              <Select value={contractDuration} onValueChange={setContractDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Job Description *
              </label>
              <textarea
                placeholder="Describe the role and responsibilities"
                className="w-full p-3 border rounded-lg border-input bg-background"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Location *
              </label>
              <Input
                placeholder="e.g., Riyadh, Saudi Arabia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Benefits (one per line)
              </label>
              <textarea
                placeholder="e.g., Health insurance&#10;Annual flights&#10;Accommodation"
                className="w-full p-3 border rounded-lg border-input bg-background"
                rows={3}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Requirements */}
          <TabsContent value="requirements" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Add Requirements
              </label>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a requirement"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                />
                <Button variant="outline" onClick={addRequirement} type="button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">
                Current Requirements ({requirements.length})
              </p>
              {requirements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No requirements added yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {requirements.map((req, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                      {req}
                      <button
                        onClick={() => removeRequirement(idx)}
                        className="ml-2 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button
            className="gradient-bg-accent text-accent-foreground"
            onClick={() => handleSubmit("ACTIVE")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Post Job Order
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("CANCELLED")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CreateJobOrderPage;
