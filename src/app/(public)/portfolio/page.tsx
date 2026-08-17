import React from "react";
import { Folder, ExternalLink, Sparkles, Layout, Globe, Command } from "lucide-react";

export default function PortfolioPage() {
  const projects = [
    {
      title: "Solace Labs SaaS Portal",
      category: "SaaS Application",
      description: "A subscription-based developer dashboard with usage billing, real-time analytics graphs, and Auth.js session handling.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
      stat: "40% dev-op savings"
    },
    {
      title: "Vortex Fintech E-Commerce",
      category: "Web Application",
      description: "A secure, high-conversion online banking client storefront with instant ledger processing and administrative analytics.",
      tags: ["React", "Node.js", "Express", "Mongoose"],
      stat: "140ms average loads"
    },
    {
      title: "Dravion Digital Cards SaaS",
      category: "Internal Product",
      description: "Our in-house visiting card platform. Supports client image uploads via Cloudinary, vector SVG QR codes, and click logs.",
      tags: ["Next.js", "Mongoose", "Cloudinary", "TailwindCSS"],
      stat: "10k+ cards published"
    },
    {
      title: "Apex Automation Engines",
      category: "AI Solution",
      description: "Connecting OpenAI models to customer support tickets, featuring vectorized context searches and Slack/Discord webhook alerts.",
      tags: ["Python", "Vector Search", "FastAPI", "OpenAI"],
      stat: "85% auto-solved issues"
    }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Case Studies</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 tracking-tight">Our Portfolio</h1>
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Take a look at some of the premium software and websites we have built. We build with performance and scalability in mind.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass-panel-premium rounded-2xl p-8 border border-white/5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {project.stat}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors flex items-center">
                  {project.title}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
