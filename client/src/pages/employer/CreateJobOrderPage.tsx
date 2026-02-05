import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
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
  const [requirements, setRequirements] = useState([
    "RN License",
    "3+ years experience",
    "BLS Cert",
  ]);
  const [newReq, setNewReq] = useState("");

  const addRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq]);
      setNewReq("");
    }
  };

  const removeRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
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
              <Input placeholder="e.g., Registered Nurse (ICU)" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Position Type *
                </label>
                <Select defaultValue="fulltime">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Number of Positions *
                </label>
                <Input type="number" placeholder="5" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Salary (Monthly) *
                </label>
                <Input placeholder="$2,500" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contract Duration *
                </label>
                <Select defaultValue="2years">
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
                className="w-full p-3 border rounded-lg border-input"
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Location *
              </label>
              <Select defaultValue="sg">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sg">Saudi Arabia</SelectItem>
                  <SelectItem value="ae">UAE</SelectItem>
                  <SelectItem value="qa">Qatar</SelectItem>
                  <SelectItem value="kw">Kuwait</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Benefits *
              </label>
              <textarea
                placeholder="e.g., Health insurance, annual flights, accommodation"
                className="w-full p-3 border rounded-lg border-input"
                rows={3}
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
                  onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                />
                <Button variant="outline" onClick={addRequirement}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Current Requirements</p>
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button className="gradient-bg-accent text-accent-foreground">
            <Save className="w-4 h-4 mr-2" />
            Post Job Order
          </Button>
          <Button variant="outline">Save as Draft</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CreateJobOrderPage;
