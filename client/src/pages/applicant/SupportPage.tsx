import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Shield,
  FileText,
  Briefcase,
  User,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

const FAQ_ITEMS = [
  {
    category: "Account",
    icon: User,
    questions: [
      {
        q: "How do I verify my email?",
        a: "After registration, you'll receive an OTP code via email. Enter this code on the verification page. If you haven't received it, check your spam folder or request a new code.",
      },
      {
        q: "How do I reset my password?",
        a: "Go to the login page and click 'Forgot Password'. Enter your registered email address and follow the instructions sent to your inbox.",
      },
      {
        q: "Can I change my email address?",
        a: "Currently, email changes need to go through our support team. Please contact us using the form below.",
      },
    ],
  },
  {
    category: "Applications",
    icon: Briefcase,
    questions: [
      {
        q: "How do I apply for a job?",
        a: "Browse available jobs, click on a position you're interested in, review the details and requirements, then click the 'Apply Now' button. Make sure your profile is complete before applying.",
      },
      {
        q: "What are the application statuses?",
        a: "Your application moves through these stages: Applied → Shortlisted → Interviewed → Selected → Processing → Deployed. You'll receive notifications at each stage change.",
      },
      {
        q: "Can I withdraw my application?",
        a: "You cannot withdraw an application once submitted. If you need to cancel, please contact our support team.",
      },
      {
        q: "What is the AI Match Score?",
        a: "The AI Match Score shows how well your profile matches a job's requirements. It considers your skills, experience, education, and certifications against the job description.",
      },
    ],
  },
  {
    category: "Documents",
    icon: FileText,
    questions: [
      {
        q: "What documents do I need to upload?",
        a: "Required documents include: Passport/ID, Resume/CV, Medical Certificate, NBI/Police Clearance, Passport-size Photo. Additional documents like diplomas and employment contracts are optional.",
      },
      {
        q: "What file formats are accepted?",
        a: "We accept PDF, JPG, JPEG, PNG, DOC, and DOCX files. Maximum file size is 10MB per document.",
      },
      {
        q: "How long does document verification take?",
        a: "Document verification typically takes 2-3 business days. You'll be notified when your documents have been verified.",
      },
    ],
  },
  {
    category: "Safety & Complaints",
    icon: Shield,
    questions: [
      {
        q: "How do I file a complaint?",
        a: "Navigate to the 'Complaints' section in your dashboard. Click 'File Report', select a category, describe your issue, and submit. All complaints are treated confidentially.",
      },
      {
        q: "What is the escalation process?",
        a: "Complaints follow a 3-level escalation: Level 1 (Admin review) → Level 2 (Compliance team) → Level 3 (Legal/Welfare support). Reports are escalated if unresolved within the expected timeline.",
      },
      {
        q: "Can I file an anonymous complaint?",
        a: "Yes, complaints can be filed anonymously. Your identity will be protected throughout the investigation process.",
      },
    ],
  },
];

function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFAQ = (key: string) => {
    setExpandedFAQ(expandedFAQ === key ? null : key);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // Simulate API call
      toast.success("Support request submitted! We'll get back to you within 24-48 hours.");
      setContactForm({ subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit support request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter FAQ based on search
  const filteredFAQ = FAQ_ITEMS.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !searchQuery ||
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Support Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or contact our support team.
        </p>
      </motion.div>

      {/* Quick Contact */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-5 text-center">
          <div className="p-3 rounded-xl bg-blue-500/10 w-fit mx-auto mb-3">
            <Mail className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold mb-1">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-2">Get a response within 24 hours</p>
          <a href="mailto:support@legaforce.com" className="text-sm text-accent hover:underline">
            support@legaforce.com
          </a>
        </div>
        <div className="card-premium p-5 text-center">
          <div className="p-3 rounded-xl bg-emerald-500/10 w-fit mx-auto mb-3">
            <Phone className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="font-semibold mb-1">Phone Support</h3>
          <p className="text-sm text-muted-foreground mb-2">Mon–Fri, 8AM–6PM PHT</p>
          <p className="text-sm font-medium">+63 (2) 8123-4567</p>
        </div>
        <div className="card-premium p-5 text-center">
          <div className="p-3 rounded-xl bg-purple-500/10 w-fit mx-auto mb-3">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="font-semibold mb-1">Emergency Hotline</h3>
          <p className="text-sm text-muted-foreground mb-2">24/7 for deployed workers</p>
          <p className="text-sm font-medium text-destructive">+63 (2) 8999-0000</p>
        </div>
      </motion.div>

      {/* FAQ Search */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          Frequently Asked Questions
        </h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-6">
          {filteredFAQ.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-sm">{category.category}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {category.questions.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {category.questions.map((faq, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isExpanded = expandedFAQ === key;
                    return (
                      <div
                        key={key}
                        className={cn(
                          "rounded-xl border transition-all",
                          isExpanded ? "border-accent/30 bg-accent/5" : "border-border hover:border-accent/20"
                        )}
                      >
                        <button
                          onClick={() => toggleFAQ(key)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="text-sm font-medium pr-4">{faq.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="px-4 pb-4"
                          >
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredFAQ.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No matching questions found</p>
              <p className="text-sm text-muted-foreground">Try a different search or contact us below</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Contact Support
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Couldn't find what you're looking for? Send us a message and we'll get back to you.
        </p>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input
              value={contactForm.subject}
              onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Describe your issue in detail..."
              className="w-full p-3 border rounded-xl border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              rows={5}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gradient-bg-accent text-accent-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default SupportPage;
