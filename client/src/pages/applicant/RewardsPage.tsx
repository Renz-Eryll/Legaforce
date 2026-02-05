import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Zap,
  TrendingUp,
  Clock,
  Check,
  Coins,
  Award,
  Star,
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

const mockRewards = {
  points: 2850,
  nextMilestone: 3000,
  history: [
    {
      id: "RW-001",
      type: "Application",
      description: "Applied to job posting",
      points: 50,
      date: "2025-01-15",
    },
    {
      id: "RW-002",
      type: "Interview",
      description: "Completed job interview",
      points: 200,
      date: "2025-01-12",
    },
    {
      id: "RW-003",
      type: "Document Upload",
      description: "Uploaded required documents",
      points: 100,
      date: "2025-01-10",
    },
    {
      id: "RW-004",
      type: "Profile",
      description: "Completed profile information",
      points: 150,
      date: "2025-01-08",
    },
  ],
  available: [
    {
      id: "REWARD-001",
      name: "₱500 Voucher",
      cost: 500,
      description: "Redemption voucher",
      type: "voucher",
    },
    {
      id: "REWARD-002",
      name: "Premium Support",
      cost: 1000,
      description: "3 months priority support",
      type: "service",
    },
    {
      id: "REWARD-003",
      name: "₱1000 Voucher",
      cost: 1200,
      description: "High-value redemption voucher",
      type: "voucher",
    },
    {
      id: "REWARD-004",
      name: "Training Course",
      cost: 800,
      description: "Professional development course",
      type: "training",
    },
  ],
  redeemed: [
    {
      id: "RED-001",
      name: "₱500 Voucher",
      date: "2024-12-20",
      cost: 500,
    },
    {
      id: "RED-002",
      name: "Training Course",
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
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Rewards</h1>
          <p className="text-muted-foreground">
            Earn and redeem your loyalty points
          </p>
        </div>
        <div className="bg-accent/10 text-accent px-6 py-3 rounded-lg">
          <p className="text-sm text-muted-foreground">Your Points</p>
          <p className="text-3xl font-display font-bold">{points}</p>
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
                      {reward.type === "voucher" && (
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

      {/* How It Works */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-semibold mb-4">How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm font-medium">Earn Points</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete activities and milestones
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm font-medium">Accumulate</p>
            <p className="text-xs text-muted-foreground mt-1">
              Watch your balance grow
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm font-medium">Redeem</p>
            <p className="text-xs text-muted-foreground mt-1">
              Exchange for amazing rewards
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RewardsPage;
