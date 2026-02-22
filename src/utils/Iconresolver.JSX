// utils/Iconresolver.jsx
import React from "react";
import {
  Home, Users, Calendar, DollarSign, TrendingUp,
  BarChart2, Settings, User, FileText, Briefcase,
  Clock, Award, Bell, Shield, Database, Globe,
  Layers, PieChart, Clipboard, BookOpen, CreditCard,
  ChevronRight,
} from "lucide-react";

const ICON_MAP = {
  Home, Users, Calendar, DollarSign, TrendingUp,
  BarChart2, Settings, User, FileText, Briefcase,
  Clock, Award, Bell, Shield, Database, Globe,
  Layers, PieChart, Clipboard, BookOpen, CreditCard,
  home: Home, users: Users, calendar: Calendar,
  dollar: DollarSign, trending: TrendingUp,
  chart: BarChart2, settings: Settings, profile: User,
  file: FileText, briefcase: Briefcase, clock: Clock,
  award: Award, bell: Bell, shield: Shield,
  database: Database, globe: Globe, layers: Layers,
  piechart: PieChart, clipboard: Clipboard,
  book: BookOpen, credit: CreditCard,
};

function MenuIcon({ name, size = 16, ...props }) {
  const Icon = (name && ICON_MAP[name]) || ChevronRight;
  return <Icon size={size} strokeWidth={2} {...props} />;
}

export { MenuIcon };
export default MenuIcon;