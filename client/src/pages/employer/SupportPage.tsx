import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
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
    question: "How do I post a job order?",
    answer:
      "Go to Job Orders section, click 'New Job Order', and fill in the required information including job title, location, salary, and requirements. Once submitted, your job posting will be visible to candidates.",
  },
  {
    id: "faq-002",
    question: "What documents do I need to collect from candidates?",
    answer:
      "Required documents include: Professional License, Educational Credentials, Work Experience Certificate, Valid Identification, Medical Clearance, and Passport Copy. You can specify additional requirements based on your needs.",
  },
  {
    id: "faq-003",
    question: "How long does the deployment process take?",
    answer:
      "Typically 4-8 weeks from initial application to deployment. This includes candidate screening (1-2 weeks), interviews (1-2 weeks), document verification (1-2 weeks), medical clearance (1 week), and exit/visa processing (1 week).",
  },
  {
    id: "faq-004",
    question: "Can I schedule interviews directly?",
    answer:
      "Yes, use the Interviews section to schedule video or phone interviews. Candidates will receive notifications and can confirm their availability. You can also reschedule or cancel interviews as needed.",
  },
  {
    id: "faq-005",
    question: "How are invoices generated?",
    answer:
      "Invoices are automatically generated based on successful deployments and services used. You can view all invoices in the Invoices section, download them, and track payment status.",
  },
];

const resources = [
  {
    title: "Hiring Guide",
    description: "Step-by-step guide to post jobs and hire candidates",
    link: "#",
  },
  {
    title: "Deployment Checklist",
    description: "Complete checklist for deployment preparation",
    link: "#",
  },
  {
    title: "Terms & Conditions",
    description: "Review our terms of service",
    link: "#",
  },
  {
    title: "Privacy Policy",
    description: "Learn how we protect your data",
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
        <p className="text-muted-foreground">
          Get help with your employer account
        </p>
      </motion.div>

      {/* Contact Cards */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Email Support</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            employer@legaforce.com
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
          <p className="text-sm text-muted-foreground mb-3">+966 11 123 4567</p>
          <Button variant="outline" size="sm">
            Call Now
          </Button>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Live Chat</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Available 24/7</p>
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
            <Input placeholder="Company Name" />
            <Input placeholder="Contact Email" type="email" />
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

      {/* FAQs */}
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
    </motion.div>
  );
}

export default SupportPage;
