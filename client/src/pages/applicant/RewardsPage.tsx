import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Gift,
  TrendingUp,
  Award,
  Shield,
  Zap,
  CheckCircle,
  Clock,
  Loader2,
  Trophy,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { applicantService } from "@/services/applicantService";
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

const WAYS_TO_EARN = [
  { action: "Complete your profile", points: 100, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { action: "Upload all required documents", points: 150, icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
  { action: "Generate AI CV", points: 200, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  { action: "Apply to a job", points: 50, icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
  { action: "Get shortlisted", points: 100, icon: Star, color: "text-accent", bg: "bg-accent/10" },
  { action: "Successfully deployed", points: 500, icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const rewardTypeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  training: { icon: Award, color: "text-blue-500", bg: "bg-blue-500/10" },
  service: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
  discount: { icon: Gift, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

function RewardsPage() {
  const [points, setPoints] = useState(0);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        setIsLoading(true);
        const [pointsRes, catalogRes, historyRes] = await Promise.allSettled([
          applicantService.getRewardPoints(),
          applicantService.getRewardCatalog(),
          applicantService.getRewardHistory(),
        ]);

        if (pointsRes.status === "fulfilled") {
          setPoints(typeof pointsRes.value === "number" ? pointsRes.value : 0);
        }
        if (catalogRes.status === "fulfilled" && Array.isArray(catalogRes.value)) {
          setCatalog(catalogRes.value);
        }
        if (historyRes.status === "fulfilled" && Array.isArray(historyRes.value)) {
          setHistory(historyRes.value);
        }
      } catch (error) {
        console.error("Failed to load rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewardsData();
  }, []);

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (points < cost) {
      toast.error("Insufficient points for this reward");
      return;
    }

    setIsRedeeming(rewardId);
    try {
      await applicantService.redeemReward(rewardId);
      setPoints((p) => p - cost);
      toast.success("Reward redeemed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reward redemption is not available yet");
    } finally {
      setIsRedeeming(null);
    }
  };

  // Calculate trust score tier
  const getTrustTier = () => {
    if (points >= 1000) return { tier: "Gold", color: "text-amber-500", progress: 100 };
    if (points >= 500) return { tier: "Silver", color: "text-gray-400", progress: (points / 1000) * 100 };
    return { tier: "Bronze", color: "text-amber-700", progress: (points / 500) * 100 };
  };

  const trustTier = getTrustTier();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
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
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          Rewards & Trust Score
        </h1>
        <p className="text-muted-foreground">
          Earn points for completing your profile, applying to jobs, and engaging with the platform.
        </p>
      </motion.div>

      {/* Points Balance & Trust Score */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-3xl font-display font-bold">{points.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-500 font-medium">
              Earn more by completing profile actions
            </span>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Trophy className={cn("w-6 h-6", trustTier.color)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trust Level</p>
              <p className={cn("text-3xl font-display font-bold", trustTier.color)}>
                {trustTier.tier}
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress to next tier</span>
              <span className="font-medium">{Math.round(trustTier.progress)}%</span>
            </div>
            <Progress value={trustTier.progress} className="h-2" />
          </div>
        </div>
      </motion.div>

      {/* Ways to Earn */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Ways to Earn Points
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WAYS_TO_EARN.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className={cn("p-2 rounded-lg shrink-0", item.bg)}>
                  <Icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  +{item.points} pts
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Redeem Catalog */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-accent" />
          Redeem Rewards
        </h2>
        {catalog.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No rewards available at this time</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((reward) => {
              const config = rewardTypeConfig[reward.type] || rewardTypeConfig.service;
              const Icon = config.icon;
              const canAfford = points >= reward.cost;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "p-5 rounded-xl border transition-all",
                    canAfford
                      ? "border-accent/30 bg-accent/5 hover:shadow-lg"
                      : "border-border bg-muted/30 opacity-70"
                  )}
                >
                  <div className={cn("p-3 rounded-xl w-fit mb-3", config.bg)}>
                    <Icon className={cn("w-6 h-6", config.color)} />
                  </div>
                  <h3 className="font-semibold mb-1">{reward.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{reward.cost} points</span>
                  </div>
                  <Button
                    size="sm"
                    className={cn(
                      "w-full",
                      canAfford
                        ? "gradient-bg-accent text-accent-foreground"
                        : ""
                    )}
                    variant={canAfford ? "default" : "outline"}
                    disabled={!canAfford || isRedeeming === reward.id}
                    onClick={() => handleRedeem(reward.id, reward.cost)}
                  >
                    {isRedeeming === reward.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {canAfford ? "Redeem" : `Need ${reward.cost - points} more pts`}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* History */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Earning History
        </h2>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No earning history yet. Start earning by completing profile actions!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action || item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date || item.createdAt}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{item.points} pts
                </Badge>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default RewardsPage;
