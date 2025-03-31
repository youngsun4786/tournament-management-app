import { createFileRoute } from "@tanstack/react-router";
import { Button } from "lib/components/ui/button";
import { Input } from "lib/components/ui/input";
import { Label } from "lib/components/ui/label";
import { Textarea } from "lib/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact-us/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with your email service implementation
      // Example: Send to your backend API or email service
      // await sendEmail(formData);

      // For now, simulate sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setFormData({ fullName: "", email: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to send email:", error);
      // TODO: Add error handling UI
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about joining CCBC or want to learn more? Fill out
            the form below and we'll get back to you as soon as possible.
          </p>
        </div>
        <div className="max-w-md w-full mx-auto rounded-lg p-6 md:p-8 shadow-sm border bg-background">
          <div className="relative">
            <h2 className="text-center text-2xl font-bold tracking-tight mb-2">
              Contact Us
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-6">
              We typically respond within 24-48 hours.
            </p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                required
                disabled={isSubmitting}
                value={formData.fullName}
                onChange={handleChange}
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleChange}
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can we help you?"
                className="min-h-[120px] resize-none border-slate-200"
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Sending</span>
                  <Send className="h-4 w-4 animate-pulse" />
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {isSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md text-green-600 dark:text-green-400 text-sm">
                Thank you! Your message has been sent successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
