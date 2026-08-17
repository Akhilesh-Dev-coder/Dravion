import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IService {
  name: string;
  description: string;
  link?: string;
}

export interface ISocialLinks {
  instagram?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface IPortfolioItem {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export interface ICustomization {
  accentColor: string;
  fontStyle: string;
  backgroundStyle: string;
  profileShape: "circle" | "rounded" | "square";
  buttonStyle: "square" | "rounded" | "pill";
  themeMode: "light" | "dark";
}

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  uniqueCode?: string;
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
  socialLinks: ISocialLinks;
  services: IService[];
  portfolio: IPortfolioItem[];
  blocks: string[];
  template: string;
  customization: ICustomization;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true,
      match: [/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens."]
    },
    uniqueCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    name: { type: String, required: true },
    title: { type: String },
    company: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    website: { type: String },
    location: { type: String },
    socialLinks: {
      instagram: { type: String },
      linkedin: { type: String },
      github: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      youtube: { type: String },
    },
    services: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String },
      }
    ],
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        link: { type: String },
      }
    ],
    blocks: {
      type: [String],
      default: ["profile", "about", "contact", "socialLinks", "services", "qrcode"]
    },
    template: { 
      type: String, 
      default: "obsidian" 
    },
    customization: {
      accentColor: { type: String, default: "#6366f1" },
      fontStyle: { type: String, default: "font-sans" },
      backgroundStyle: { type: String, default: "grid" },
      profileShape: { type: String, default: "circle" },
      buttonStyle: { type: String, default: "rounded" },
      themeMode: { type: String, default: "dark" },
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Card = models.Card || model<ICard>("Card", CardSchema);
export default Card;
