"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, User, Loader2, ArrowRight, MessageCircle } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Website Development");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate sending form submission and redirecting
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      const subject = encodeURIComponent(`Dravion Project Inquiry - ${name}`);
      const body = encodeURIComponent(`Hello Dravion Team,\n\nI have submitted a project inquiry on your website. Here are my details:\n\nName: ${name}\nEmail: ${email}\nService of Interest: ${service}\n\nProject Summary / Message:\n${message}\n\nBest regards,\n${name}`);
      
      // Detect if user is on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        const mailtoUrl = `mailto:dravion456@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
      } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dravion456@gmail.com&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
      }

      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Inquiry</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 tracking-tight">Start a Project</h1>
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have a custom web development or SaaS project in mind? Fill out the form below and we will get back to you within 24 hours.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Text/Info */}
          <div className="md:col-span-4 flex flex-col justify-between glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Get in touch</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Prefer direct communication? Send us an email or connect via our digital channels.
              </p>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:dravion456@gmail.com" className="hover:underline">dravion456@gmail.com</a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <InstagramIcon className="w-4 h-4 text-secondary shrink-0" />
                <a href="https://instagram.com/dravion_tech" target="_blank" rel="noopener noreferrer" className="hover:underline">@dravion_tech</a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                <a href="https://wa.me/919074311597" target="_blank" rel="noopener noreferrer" className="hover:underline">+91 9074311597</a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MessageSquare className="w-4 h-4 text-secondary shrink-0" />
                <span>Available Mon-Fri</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 font-bold tracking-widest uppercase">
              DRAVION OFFICE
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-8 glass-panel-premium p-8 rounded-2xl border border-white/5">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Inquiry Received!</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out to Dravion. One of our engineers will contact you shortly to schedule a review call.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center space-x-1.5 text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    <span>Send another message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Akhilesh AS"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="akhilesh@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Service of Interest</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="SaaS Development">SaaS Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="AI Integration & Workflows">AI Integration & Workflows</option>
                    <option value="Digital Visiting Card Pro/Team">Digital Visiting Card Pro/Team</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Project Summary / Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your objectives, timelines and requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold py-2.5 rounded-lg text-xs transition-all shadow-md shadow-primary/15 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Project Form</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
