import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Zap,
  Clock,
  Award,
  Star,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Rewards & Trust Score: earn for complete docs early, attend interview on time, successful deployment
// Redeem for: free training, priority processing, discounts on medical/documentation
const mockRewards = {
  points: 2850,
  trustScore: 85,
  nextMilestone: 3000,
  history: [
    {
      id: "RW-001",
      type: "Documents",
      description: "Complete documents early",
      points: 150,
      date: "2025-01-15",
    },
    {
      id: "RW-002",
      type: "Interview",
      description: "Attended interview on time",
      points: 200,
      date: "2025-01-12",
    },
    {
      id: "RW-003",
      type: "Documents",
      description: "Uploaded required documents",
      points: 100,
      date: "2025-01-10",
    },
    {
      id: "RW-004",
      type: "Deployment",
      description: "Successful deployment",
      points: 500,
      date: "2024-12-20",
    },
  ],
  available: [
    {
      id: "REWARD-001",
      name: "Free training",
      cost: 800,
      description: "Eligibility for free skills or compliance training",
      type: "training",
    },
    {
      id: "REWARD-002",
      name: "Priority processing",
      cost: 1000,
      description: "3 months priority in application processing",
      type: "service",
    },
    {
      id: "REWARD-003",
      name: "Medical / documentation discount",
      cost: 600,
      description: "Discount on medical or documentation fees",
      type: "discount",
    },
    {
      id: "REWARD-004",
      name: "Premium training bundle",
      cost: 1200,
      description: "Full professional development course",
      type: "training",
    },
  ],
  redeemed: [
    {
      id: "RED-001",
      name: "Medical / documentation discount",
      date: "2024-12-20",
      cost: 600,
    },
    {
      id: "RED-002",
      name: "Free training",
      date: "2024-12-10",
      cost: 800,
    },
  ],
};

function RewardsPage() {
  const [points, setPoints] = useState(mockRewards.points);

  const handleRedeem = (cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header - Rewards & Trust Score */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Rewards & Trust Score
          </h1>
          <p className="text-muted-foreground">
            Earn points for completing documents early, attending interviews on
            time, and successful deployment. Redeem for training, priority
            processing, or discounts.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-accent/10 text-accent px-6 py-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Your Points</p>
            <p className="text-3xl font-display font-bold">{points}</p>
          </div>
          <div className="bg-muted/50 px-6 py-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Trust Score</p>
            <p className="text-2xl font-display font-bold">
              {mockRewards.trustScore}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* How you earn */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-semibold mb-4">Earn points for</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <FileCheck className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Complete documents early</p>
              <p className="text-sm text-muted-foreground">Up to 150 pts</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Clock className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Attend interviews on time</p>
              <p className="text-sm text-muted-foreground">Up to 200 pts</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Award className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Successful deployment</p>
              <p className="text-sm text-muted-foreground">Up to 500 pts</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-semibold mb-4">Next Milestone</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {points} / {mockRewards.nextMilestone} points
            </span>
            <Badge variant="secondary">
              {Math.round((points / mockRewards.nextMilestone) * 100)}%
            </Badge>
          </div>
          <Progress
            value={(points / mockRewards.nextMilestone) * 100}
            className="h-3"
          />
          <p className="text-sm text-muted-foreground">
            {mockRewards.nextMilestone - points} points to next reward tier
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
          </TabsList>

          {/* Available Rewards */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {mockRewards.available.map((reward) => {
                const canRedeem = points >= reward.cost;
                return (
                  <div
                    key={reward.id}
                    className="p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {(reward.type === "voucher" || reward.type === "discount") && (
                        <Gift className="w-5 h-5 text-accent" />
                      )}
                      {reward.type === "service" && (
                        <Star className="w-5 h-5 text-accent" />
                      )}
                      {reward.type === "training" && (
                        <Award className="w-5 h-5 text-accent" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="font-semibold text-accent">
                        {reward.cost} pts
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleRedeem(reward.cost)}
                        disabled={!canRedeem}
                        className={
                          canRedeem
                            ? "gradient-bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {canRedeem ? "Redeem" : "Not Enough"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Points History */}
          <TabsContent value="history" className="space-y-3">
            {mockRewards.history.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-emerald-600">
                  +{item.points}
                </span>
              </div>
            ))}
          </TabsContent>

          {/* Redeemed */}
          <TabsContent value="redeemed" className="space-y-3">
            {mockRewards.redeemed.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-red-600">-{item.cost}</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Redeem for: Free training, Priority processing, Discounts */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-semibold mb-4">Redeem for</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Free training</p>
            <p className="text-xs text-muted-foreground mt-1">
              Skills and compliance courses
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Priority processing</p>
            <p className="text-xs text-muted-foreground mt-1">
              Faster application handling
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Discounts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Medical & documentation fees
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RewardsPage;
