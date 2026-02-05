import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

function ReportsPage() {
  const [period, setPeriod] = useState("month");

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
          <h1 className="text-3xl font-display font-bold mb-1">Reports</h1>
          <p className="text-muted-foreground">
            Analytics and business insights
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Period Selector */}
      <motion.div variants={fadeInUp}>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Job Orders</p>
          </div>
          <p className="text-2xl font-display font-bold">5</p>
          <p className="text-xs text-emerald-600 mt-1">+2 this month</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Deployments</p>
          </div>
          <p className="text-2xl font-display font-bold">45</p>
          <p className="text-xs text-emerald-600 mt-1">+8 this month</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
          <p className="text-2xl font-display font-bold">₱625K</p>
          <p className="text-xs text-emerald-600 mt-1">+15% growth</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <p className="text-2xl font-display font-bold">94%</p>
          <p className="text-xs text-emerald-600 mt-1">+3% vs last month</p>
        </div>
      </motion.div>

      {/* Report Tabs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="recruitment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          {/* Recruitment Stats */}
          <TabsContent value="recruitment" className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Application Rate</span>
                  <span className="font-bold">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Interview Rate</span>
                  <span className="font-bold">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Offer Acceptance</span>
                  <span className="font-bold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </TabsContent>

          {/* Deployment Stats */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Deployed This Period
                </p>
                <p className="text-2xl font-display font-bold">8 workers</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Average Time to Deployment
                </p>
                <p className="text-2xl font-display font-bold">35 days</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Retention Rate
                </p>
                <p className="text-2xl font-display font-bold">96%</p>
              </div>
            </div>
          </TabsContent>

          {/* Financial Stats */}
          <TabsContent value="financial" className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Revenue
                </p>
                <p className="text-2xl font-display font-bold text-accent">
                  ₱625,000
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Average Fee Per Deployment
                </p>
                <p className="text-2xl font-display font-bold text-accent">
                  ₱13,889
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Collection Rate
                </p>
                <p className="text-2xl font-display font-bold">98%</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default ReportsPage;
