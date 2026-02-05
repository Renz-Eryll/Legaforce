import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  Search,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const faqs = [
  {
    id: "faq-001",
    question: "How do I apply for a job?",
    answer:
      "Browse available jobs in the Jobs section, view details, and click 'Apply Now'. Your CV and profile information will be automatically submitted to the employer.",
  },
  {
    id: "faq-002",
    question: "What documents do I need to prepare?",
    answer:
      "Required documents include: Valid Nursing License, BLS/CPR Certification, Passport Copy, Educational Credentials, and Work Experience Certificate. You can upload these in the Documents section.",
  },
  {
    id: "faq-003",
    question: "How long does the deployment process take?",
    answer:
      "Typically, the process takes 4-8 weeks from application to deployment, depending on document verification, interviews, and medical clearance. Processing times may vary based on your location and the employer.",
  },
  {
    id: "faq-004",
    question: "Can I apply to multiple positions?",
    answer:
      "Yes, you can apply to multiple positions simultaneously. However, we recommend applying to positions that match your qualifications and preferences for better chances of success.",
  },
  {
    id: "faq-005",
    question: "What is the rewards program?",
    answer:
      "Our rewards program lets you earn points for completing activities like applying to jobs, uploading documents, and completing your profile. These points can be redeemed for vouchers and services.",
  },
  {
    id: "faq-006",
    question: "How do I track my application status?",
    answer:
      "Visit the Applications section to view all your submitted applications. You'll see real-time status updates including shortlisted, interviewed, and deployment stages.",
  },
];

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn how to create your profile and start applying",
    link: "#",
  },
  {
    title: "Document Requirements",
    description: "Complete list of documents needed for deployment",
    link: "#",
  },
  {
    title: "FAQs",
    description: "Frequently asked questions and answers",
    link: "#",
  },
  {
    title: "Terms & Conditions",
    description: "Read our terms of service",
    link: "#",
  },
];

function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    // Handle message submission
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
        <h1 className="text-3xl font-display font-bold mb-1">Support</h1>
        <p className="text-muted-foreground">Get help with your questions</p>
      </motion.div>

      {/* Contact Cards */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Email Support</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            support@legaforce.com
          </p>
          <Button variant="outline" size="sm">
            Send Email
          </Button>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Phone Support</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            +63 (2) 8123-4567
          </p>
          <Button variant="outline" size="sm">
            Call Now
          </Button>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Live Chat</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Available Mon-Fri, 9AM-5PM
          </p>
          <Button variant="outline" size="sm">
            Start Chat
          </Button>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Email" type="email" />
          </div>
          <Input placeholder="Subject" />
          <textarea
            placeholder="Describe your issue or question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg border-input"
            rows={4}
          />
          <Button className="gradient-bg-accent text-accent-foreground">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </motion.div>

      {/* Search FAQs */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No FAQs match your search</p>
          </div>
        )}
      </motion.div>

      {/* Resources */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-xl font-semibold mb-4">Helpful Resources</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{resource.title}</h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Community */}
      <motion.div
        variants={fadeInUp}
        className="card-premium p-6 bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20"
      >
        <HelpCircle className="w-6 h-6 text-accent mb-3" />
        <h2 className="text-xl font-semibold mb-2">Community Forum</h2>
        <p className="text-muted-foreground mb-4">
          Connect with other applicants, share experiences, and get tips from
          the community.
        </p>
        <Button variant="outline">Visit Forum</Button>
      </motion.div>
    </motion.div>
  );
}

export default SupportPage;
