"use client";

import React, { useEffect, useState } from "react";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Globe, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Share2,
  Briefcase,
  UserPlus,
  ArrowRight
} from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Instagram = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Linkedin = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Facebook = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = ({ className, ...props }: IconProps) => (
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
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

interface IService {
  name: string;
  description: string;
  link?: string;
}

interface ISocialLinks {
  instagram?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

interface IPortfolioItem {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

interface ICardData {
  _id?: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  location?: string;
  socialLinks?: ISocialLinks;
  services?: IService[];
  portfolio?: IPortfolioItem[];
  blocks?: string[];
  template: "obsidian" | "aurora" | "swiss" | "glass" | "creator" | "corporate";
  customization: {
    accentColor: string;
    fontStyle: string;
    backgroundStyle: string;
    profileShape: "circle" | "rounded" | "square";
    buttonStyle: "square" | "rounded" | "pill";
    themeMode?: "light" | "dark";
  };
}

interface CardTemplateProps {
  data: ICardData;
  onLinkClick?: (type: "whatsapp" | "phone" | "email" | "website" | "social_click") => void;
  hideBranding?: boolean;
}

export default function CardTemplate({ data, onLinkClick, hideBranding = false }: CardTemplateProps) {
  const {
    _id,
    name,
    title,
    company,
    bio,
    profileImage,
    phone,
    whatsapp,
    email,
    website,
    location,
    socialLinks = {},
    services = [],
    portfolio = [],
    blocks: rawBlocks = ["profile", "about", "contact", "socialLinks", "services", "qrcode"],
    template = "obsidian",
    customization = { accentColor: "#6366f1", fontStyle: "font-sans", backgroundStyle: "grid", profileShape: "circle", buttonStyle: "rounded", themeMode: "dark" }
  } = data;

  const blocks = rawBlocks.filter((b) => b !== "portfolio");
  const isLight = customization.themeMode === "light";

  const theme = {
    textPrimary: isLight ? "text-slate-900" : "text-white",
    textSecondary: isLight ? "text-slate-500" : "text-gray-400",
    bgCard: isLight ? "bg-white/80 border border-slate-200 hover:bg-slate-50" : "bg-black/40 border border-white/10 hover:bg-black/60",
    bgInput: isLight ? "bg-slate-100" : "bg-black/40",
    borderSubtle: isLight ? "border-slate-200" : "border-white/5",
    textInverse: isLight ? "text-white" : "text-black",
  };

  const [qrUrl, setQrUrl] = useState("");

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "User")}`;
  const avatarSrc = profileImage || defaultAvatar;

  // Custom action buttons
  const actions = [
    { type: "phone", icon: <Phone className="w-4 h-4" />, value: phone, href: `tel:${phone}`, label: "Call" },
    { type: "whatsapp", icon: <MessageCircle className="w-4 h-4" />, value: whatsapp, href: `https://wa.me/${whatsapp?.replace(/[^\d+]/g, "")}`, label: "WhatsApp" },
    { type: "email", icon: <Mail className="w-4 h-4" />, value: email, href: `mailto:${email}`, label: "Email" },
    { type: "website", icon: <Globe className="w-4 h-4" />, value: website, href: website?.startsWith("http") ? website : `https://${website}`, label: "Website" },
    { type: "location", icon: <MapPin className="w-4 h-4" />, value: location, href: `https://maps.google.com/?q=${encodeURIComponent(location || "")}`, label: "Directions" },
  ].filter(act => act.value);

  // Social handles
  const socialIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
  };

  const activeSocials = Object.entries(socialLinks)
    .filter(([_, val]) => val)
    .map(([key, val]) => ({
      name: key,
      icon: socialIcons[key] || <ExternalLink className="w-4 h-4" />,
      href: val?.startsWith("http") ? val : `https://${val}`
    }));

  const handleActionClick = (type: any) => {
    if (onLinkClick) onLinkClick(type);
  };

  // Generate and Download vCard (.vcf)
  const handleAddToContacts = () => {
    if (!_id) return;
    const link = document.createElement("a");
    link.href = `/api/cards/${_id}/vcard`;
    link.setAttribute("download", "");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleActionClick("social_click");
  };

  const getFontFamily = () => {
    switch (customization.fontStyle) {
      case "font-serif":
        return "font-serif";
      case "font-mono":
        return "font-mono";
      case "font-display":
        return "font-sans tracking-wide uppercase font-extrabold";
      case "font-sans":
      default:
        return "font-sans";
    }
  };

  const getProfileShapeClass = () => {
    switch (customization.profileShape) {
      case "rounded":
        return "rounded-2xl";
      case "square":
        return "rounded-none";
      case "circle":
      default:
        return "rounded-full";
    }
  };

  const getButtonStyleClass = () => {
    switch (customization.buttonStyle) {
      case "square":
        return "rounded-none";
      case "pill":
        return "rounded-full";
      case "rounded":
      default:
        return "rounded-xl";
    }
  };

  const getDynamicBackground = () => {
    const solidBg = isLight ? "#f4f4f6" : "#0a0a0c";
    const opacityDots = isLight ? "22" : "33";
    const opacityStripes = isLight ? "15" : "1f";
    const opacityGrid = isLight ? "1c" : "26";
    
    switch (customization.backgroundStyle) {
      case "dots":
        return {
          backgroundColor: solidBg,
          backgroundImage: `radial-gradient(${customization.accentColor}${opacityDots} 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px"
        };
      case "aurora":
        return {
          backgroundColor: solidBg,
          backgroundImage: isLight 
            ? `radial-gradient(circle at 10% 20%, ${customization.accentColor}18, transparent 45%), radial-gradient(circle at 90% 80%, #06b6d418, transparent 45%)`
            : `radial-gradient(circle at 10% 20%, ${customization.accentColor}2f, transparent 50%), radial-gradient(circle at 90% 80%, #06b6d425, transparent 65%)`,
        };
      case "stripes":
        return {
          backgroundColor: solidBg,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, ${customization.accentColor}${opacityStripes} 12px, ${customization.accentColor}${opacityStripes} 24px)`,
        };
      case "solid":
        return {
          backgroundColor: solidBg
        };
      case "grid":
      default:
        return {
          backgroundColor: solidBg,
          backgroundImage: `linear-gradient(to right, ${customization.accentColor}${opacityGrid} 1px, transparent 1px), linear-gradient(to bottom, ${customization.accentColor}${opacityGrid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        };
    }
  };

  // 1. Obsidian Template
  const renderObsidian = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="text-center pt-6 space-y-4">
              <div className="relative inline-block">
                <img 
                  src={avatarSrc} 
                  alt={name} 
                  className={`w-24 h-24 object-cover mx-auto bg-slate-900 border ${getProfileShapeClass()}`}
                  style={{ borderColor: `${customization.accentColor}40` }}
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">{name}</h2>
                {(title || company) && (
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    {title} {company && `| ${company}`}
                  </p>
                )}
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="py-2 border-b border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed italic text-center max-w-sm mx-auto">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-3">
              {actions.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {actions.map((act) => (
                    <a
                      key={act.label}
                      href={act.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(act.type as any)}
                      className={`flex items-center space-x-2.5 p-2.5 bg-black/40 border border-white/10 hover:bg-black/60 hover:border-white/20 transition-all text-[10px] text-white font-bold tracking-wider uppercase ${getButtonStyleClass()}`}
                    >
                      <span style={{ color: customization.accentColor }} className="shrink-0">{act.icon}</span>
                      <span className="truncate">{act.label}</span>
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:opacity-95 ${getButtonStyleClass()}`}
                style={{ backgroundColor: customization.accentColor }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add to Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="flex items-center justify-center gap-3.5 py-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`p-2 bg-black/40 border border-white/10 hover:bg-black/60 hover:border-white/20 transition-colors ${getButtonStyleClass()}`}
                  style={{ color: customization.accentColor }}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-3 pt-2">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">My Offerings</h3>
              <div className="space-y-2">
                {services.map((srv, idx) => (
                  <div key={idx} className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-1 relative pl-5">
                    <span className="absolute left-0 top-4 w-1 h-6 rounded-r-md" style={{ backgroundColor: customization.accentColor }}></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{srv.name}</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-3 pt-2">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Portfolio Cases</h3>
              <div className="grid grid-cols-1 gap-2">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/40 rounded-xl transition-all"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-900" />
                    )}
                    <div className="grow min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[9px] text-gray-400 truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full text-[#e4e4e7] flex flex-col justify-between p-6 relative ${getFontFamily()} ${isLight ? "is-light" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-8">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && renderBrandingFooter()}
      </div>
    );
  };

  // 2. Aurora Template
  const renderAurora = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="text-center pt-6 space-y-4">
              <div className="relative inline-block">
                <div 
                  className={`p-[3px] shadow-lg shadow-primary/20 ${getProfileShapeClass()}`}
                  style={{ background: `linear-gradient(135deg, ${customization.accentColor}, #06b6d4)` }}
                >
                  <img src={avatarSrc} alt={name} className={`w-24 h-24 object-cover bg-slate-950 ${getProfileShapeClass()}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-white">{name}</h2>
                {(title || company) && (
                  <p className="text-xs font-bold text-primary tracking-widest uppercase" style={{ color: customization.accentColor }}>
                    {title} {company && `at ${company}`}
                  </p>
                )}
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl text-center max-w-sm mx-auto shadow-sm">
              <p className="text-xs text-gray-300 leading-relaxed italic">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-3">
              {actions.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {actions.map((act) => (
                    <a
                      key={act.label}
                      href={act.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(act.type as any)}
                      className={`flex items-center space-x-2 py-2.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-colors ${getButtonStyleClass()}`}
                    >
                      <span className="shrink-0" style={{ color: customization.accentColor }}>{act.icon}</span>
                      <span className="truncate">{act.label}</span>
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-white bg-gradient-to-r hover:opacity-95 shadow-md shadow-primary/10 transition-all ${getButtonStyleClass()}`}
                style={{ backgroundImage: `linear-gradient(135deg, ${customization.accentColor}, #06b6d4)` }}
              >
                <UserPlus className="w-4.5 h-4.5" />
                <span>Add to Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="flex items-center justify-center gap-3.5 py-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all ${getButtonStyleClass()}`}
                  style={{ color: customization.accentColor }}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Core Skills</h3>
              <div className="grid grid-cols-1 gap-2">
                {services.map((srv, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/15 transition-all"></div>
                    <h4 className="text-xs font-black text-white flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: customization.accentColor }}></span>
                      {srv.name}
                    </h4>
                    <p className="text-[10px] text-gray-300 leading-relaxed pl-3.5 mt-1">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Works Gallery</h3>
              <div className="grid grid-cols-2 gap-2">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden block transition-all hover:-translate-y-0.5"
                  >
                    {item.image && (
                      <div className="h-24 w-full bg-slate-900 overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="p-3 space-y-0.5">
                      <h4 className="text-[10px] font-black text-white truncate">{item.title}</h4>
                      <p className="text-[8px] text-gray-400 truncate leading-normal">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full text-white flex flex-col justify-between p-6 relative ${getFontFamily()} ${isLight ? "is-light" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-8">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && renderBrandingFooter()}
      </div>
    );
  };

  // 3. Swiss Template
  const renderSwiss = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="space-y-4 pt-6 text-left border-b-2 border-black pb-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1 max-w-[70%]">
                  <h2 className="text-3xl font-black tracking-tighter text-black leading-tight">{name}</h2>
                  {(title || company) && (
                    <p className="text-[11px] font-bold text-black uppercase tracking-wider font-sans">
                      {title} {company && `| ${company}`}
                    </p>
                  )}
                </div>
                <img 
                  src={avatarSrc} 
                  alt={name} 
                  className={`w-16 h-16 object-cover border-2 border-black bg-white ${getProfileShapeClass()}`} 
                />
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="py-2 text-left border-b border-black/10">
              <p className="text-xs text-black leading-relaxed font-sans">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-2 border-b border-black/10 pb-6">
              {actions.map((act) => (
                <a
                  key={act.label}
                  href={act.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick(act.type as any)}
                  className={`flex items-center justify-between p-2.5 border-2 border-black hover:bg-black/5 text-xs text-black font-extrabold transition-all uppercase tracking-wider ${getButtonStyleClass()}`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-black shrink-0">{act.icon}</span>
                    <span>{act.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black" />
                </a>
              ))}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-black hover:bg-neutral-800 transition-all ${getButtonStyleClass()}`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add to Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="flex flex-wrap gap-2 py-1 justify-start border-b border-black/10 pb-6">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 border border-black text-[10px] text-black font-extrabold uppercase hover:bg-black hover:text-white transition-all ${getButtonStyleClass()}`}
                >
                  {soc.icon}
                  <span>{soc.name}</span>
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-4 pt-2 text-left">
              <h3 className="text-[10px] font-black text-black uppercase tracking-widest block">Capabilities</h3>
              <div className="space-y-3 font-sans">
                {services.map((srv, idx) => (
                  <div key={idx} className="border-b border-black/10 pb-3 flex space-x-3 items-start">
                    <span className="text-[11px] font-black text-black select-none">0{idx + 1}.</span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-black uppercase">{srv.name}</h4>
                      <p className="text-[10px] text-neutral-600 leading-relaxed">{srv.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-4 pt-2 text-left">
              <h3 className="text-[10px] font-black text-black uppercase tracking-widest block">Projects</h3>
              <div className="grid grid-cols-1 gap-2.5 font-sans">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center p-3 border-2 border-black bg-white hover:bg-black/5 rounded-none transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-black text-black uppercase">{item.title}</h4>
                      <p className="text-[9px] text-neutral-600 leading-normal">{item.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full text-black flex flex-col justify-between p-6 relative ${getFontFamily()} ${isLight ? "is-light" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-6">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && (
          <div className="text-center pt-8 font-sans">
            <a 
              href="https://dravion.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-black border-2 border-black transition-all px-3 py-1.5 rounded-none text-[9px] font-extrabold text-white cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>POWERED BY DRAVION</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  // 4. Glass Template
  const renderGlass = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="glass-panel p-5 rounded-2xl text-center space-y-4 shadow-sm border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative inline-block">
                <img 
                  src={avatarSrc} 
                  alt={name} 
                  className={`w-20 h-20 object-cover bg-slate-900 border border-white/20 ${getProfileShapeClass()}`} 
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">{name}</h2>
                {(title || company) && (
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                    {title} {company && `@ ${company}`}
                  </p>
                )}
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="glass-panel p-4 rounded-xl text-center max-w-sm mx-auto shadow-sm border border-white/5">
              <p className="text-[11px] text-gray-300 leading-relaxed">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-2">
              {actions.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {actions.map((act) => (
                    <a
                      key={act.label}
                      href={act.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(act.type as any)}
                      className={`flex items-center space-x-2.5 p-2 rounded-xl glass-panel hover:bg-white/10 hover:border-white/20 text-[10px] text-white font-bold tracking-wider uppercase transition-all ${getButtonStyleClass()}`}
                    >
                      <span style={{ color: customization.accentColor }} className="shrink-0">{act.icon}</span>
                      <span className="truncate">{act.label}</span>
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all glass-panel hover:bg-white/10 hover:border-white/20 ${getButtonStyleClass()}`}
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Add to Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="flex items-center justify-center gap-3.5 py-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`p-2.5 rounded-full glass-panel text-white hover:bg-white/10 transition-colors ${getButtonStyleClass()}`}
                  style={{ color: customization.accentColor }}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Services</h3>
              <div className="space-y-2">
                {services.map((srv, idx) => (
                  <div key={idx} className="glass-panel p-3.5 rounded-2xl border border-white/5 space-y-1">
                    <h4 className="text-[11px] font-bold text-white flex items-center uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full mr-2 animate-ping" style={{ backgroundColor: customization.accentColor }}></span>
                      {srv.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 leading-relaxed pl-3.5">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Portfolio Cases</h3>
              <div className="space-y-2">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel p-3 rounded-xl flex items-center space-x-3 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    )}
                    <div className="grow min-w-0">
                      <h4 className="text-[10px] font-bold text-white truncate uppercase tracking-wider">{item.title}</h4>
                      <p className="text-[8px] text-gray-400 truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full bg-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden ${getFontFamily()} ${isLight ? "is-light bg-[#f4f4f6] text-slate-800" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-6">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && (
          <div className="text-center pt-8 relative z-10">
            <a 
              href="https://dravion.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-black/60 border border-white/5 hover:border-white/10 hover:bg-black/80 transition-all px-3 py-1.5 rounded-lg text-[9px] font-bold text-gray-400 hover:text-white cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span>POWERED BY DRAVION</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  // 5. Creator Template
  const renderCreator = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="text-center space-y-4 pt-4 border-b border-white/5 pb-6">
              <div className="relative inline-block w-full">
                <img 
                  src={avatarSrc} 
                  alt={name} 
                  className={`w-full h-56 object-cover bg-slate-900 border-2 border-white/5 shadow-xl ${getProfileShapeClass()}`} 
                />
              </div>
              <div className="space-y-1 text-left px-2">
                <h2 className="text-3xl font-black tracking-tight text-white leading-none">{name}</h2>
                {(title || company) && (
                  <p className="text-xs font-semibold text-gray-400 tracking-wider">
                    {title} {company && `at ${company}`}
                  </p>
                )}
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="py-2 text-left px-2">
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-3 px-2">
              {actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {actions.map((act) => (
                    <a
                      key={act.label}
                      href={act.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(act.type as any)}
                      className={`flex items-center space-x-1.5 py-1.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-white transition-colors ${getButtonStyleClass()}`}
                    >
                      <span className="shrink-0" style={{ color: customization.accentColor }}>{act.icon}</span>
                      <span>{act.label}</span>
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all ${getButtonStyleClass()}`}
                style={{ backgroundColor: customization.accentColor }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Profile Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 px-2 py-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`flex flex-col items-center justify-center p-3 bg-[#111] border border-white/10 hover:border-white/20 rounded-xl transition-all text-center`}
                  style={{ color: customization.accentColor }}
                >
                  <span className="mb-1 text-white">{soc.icon}</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{soc.name}</span>
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-3 pt-2 px-2 text-left">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Collaborations</h3>
              <div className="space-y-2">
                {services.map((srv, idx) => (
                  <div key={idx} className="bg-[#111] border border-white/5 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">{srv.name}</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-3 pt-2 px-2 text-left">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Creative Works</h3>
              <div className="grid grid-cols-1 gap-3 font-sans">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden block transition-all hover:border-white/25"
                  >
                    {item.image && (
                      <div className="h-40 w-full bg-slate-900 overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                      </div>
                    )}
                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full text-white flex flex-col justify-between p-4 relative ${getFontFamily()} ${isLight ? "is-light" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-6">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && renderBrandingFooter()}
      </div>
    );
  };

  // 6. Corporate Template
  const renderCorporate = () => {
    const renderBlock = (blockId: string) => {
      switch (blockId) {
        case "profile":
          return (
            <div className="bg-[#1e293b]/40 border border-slate-700/30 p-5 rounded-2xl space-y-4 text-left shadow-sm">
              <div className="flex items-center space-x-4">
                <img 
                  src={avatarSrc} 
                  alt={name} 
                  className={`w-16 h-16 object-cover border border-slate-600 bg-slate-800 ${getProfileShapeClass()}`} 
                />
                <div className="space-y-0.5 grow min-w-0">
                  <h2 className="text-xl font-bold text-white truncate leading-tight">{name}</h2>
                  {title && <p className="text-xs text-slate-300 truncate font-semibold">{title}</p>}
                  {company && (
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1" />
                      {company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case "about":
          return bio ? (
            <div className="py-2 text-left border-l-2 border-slate-600 pl-3">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{bio}</p>
            </div>
          ) : null;
        case "contact":
          return (
            <div className="space-y-3">
              {actions.length > 0 && (
                <div className="grid grid-cols-1 gap-2 font-sans">
                  {actions.map((act) => (
                    <a
                      key={act.label}
                      href={act.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleActionClick(act.type as any)}
                      className={`flex items-center justify-between p-3 bg-slate-800/40 border border-slate-750/30 rounded-xl hover:bg-slate-800/60 transition-all text-xs text-slate-200 font-medium`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400">{act.icon}</span>
                        <span>{act.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToContacts}
                className={`w-full flex items-center justify-center space-x-2 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md shadow-slate-900/10 ${getButtonStyleClass()}`}
                style={{ backgroundColor: customization.accentColor }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Corporate Contacts</span>
              </button>
            </div>
          );
        case "socialLinks":
          return activeSocials.length > 0 ? (
            <div className="flex items-center justify-start gap-3 py-1 pl-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleActionClick("social_click")}
                  className={`p-2.5 rounded-xl bg-slate-800/40 border border-slate-750/30 hover:bg-slate-800/60 hover:text-white transition-colors ${getButtonStyleClass()}`}
                  style={{ color: customization.accentColor }}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          ) : null;
        case "services":
          return services.length > 0 ? (
            <div className="space-y-3 pt-2 text-left">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operations & Services</h3>
              <div className="grid grid-cols-1 gap-2 font-sans">
                {services.map((srv, idx) => (
                  <div key={idx} className="bg-slate-800/20 border border-slate-800/40 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{srv.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        case "portfolio":
          return portfolio.length > 0 ? (
            <div className="space-y-3 pt-2 text-left">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Client Cases</h3>
              <div className="space-y-2 font-sans">
                {portfolio.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-slate-800/20 border border-slate-800/40 hover:border-slate-800/60 rounded-xl transition-all"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-900" />
                    )}
                    <div className="grow min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div 
        className={`min-h-full bg-slate-900 text-slate-200 flex flex-col justify-between p-6 relative ${getFontFamily()} ${isLight ? "is-light bg-[#f4f4f6]" : "is-dark"}`}
        style={getDynamicBackground()}
      >
        <div className="space-y-6">
          {blocks.map((b) => <React.Fragment key={b}>{renderBlock(b)}</React.Fragment>)}
        </div>
        {!hideBranding && renderBrandingFooter()}
      </div>
    );
  };

  const renderBrandingFooter = () => (
    <div className="text-center pt-8">
      <a 
        href="https://dravion.site" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all px-3 py-1.5 rounded-lg text-[9px] font-bold text-gray-400 hover:text-white cursor-pointer"
      >
        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        <span>POWERED BY DRAVION</span>
      </a>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .is-light .text-white { color: #0f172a !important; }
        .is-light .text-slate-100 { color: #0f172a !important; }
        .is-light .text-\\[\\#e4e4e7\\] { color: #1e293b !important; }
        .is-light .text-\\[\\#e2e8f0\\] { color: #1e293b !important; }
        .is-light .text-slate-200 { color: #1e293b !important; }
        .is-light .text-slate-300 { color: #334155 !important; }
        .is-light .text-gray-300 { color: #334155 !important; }
        .is-light .text-gray-400 { color: #475569 !important; }
        .is-light .text-slate-400 { color: #475569 !important; }
        .is-light .bg-black\\/40 { background-color: rgba(255, 255, 255, 0.85) !important; }
        .is-light .bg-black\\/20 { background-color: rgba(0, 0, 0, 0.03) !important; }
        .is-light .bg-\\[\\#1e293b\\]\\/40 { background-color: rgba(255, 255, 255, 0.85) !important; }
        .is-light .bg-white\\/5 { background-color: rgba(0, 0, 0, 0.04) !important; }
        .is-light .border-white\\/10 { border-color: rgba(0, 0, 0, 0.08) !important; }
        .is-light .border-white\\/5 { border-color: rgba(0, 0, 0, 0.05) !important; }
        .is-light .border-slate-700\\/30 { border-color: rgba(0, 0, 0, 0.08) !important; }
        .is-light .border-l-2 { border-color: rgba(0, 0, 0, 0.15) !important; }
        .is-light .hover\\:bg-black\\/60:hover { background-color: rgba(0, 0, 0, 0.05) !important; }
        .is-light .hover\\:bg-white\\/10:hover { background-color: rgba(0, 0, 0, 0.05) !important; }
        
        .is-dark .text-black { color: #f8fafc !important; }
        .is-dark .bg-white { background-color: rgba(0, 0, 0, 0.4) !important; }
        .is-dark .border-black { border-color: rgba(255, 255, 255, 0.1) !important; }
      `}} />
      {(() => {
        switch (template) {
          case "aurora":
            return renderAurora();
          case "swiss":
            return renderSwiss();
          case "glass":
            return renderGlass();
          case "creator":
            return renderCreator();
          case "corporate":
            return renderCorporate();
          case "obsidian":
          default:
            return renderObsidian();
        }
      })()}
    </>
  );
}
