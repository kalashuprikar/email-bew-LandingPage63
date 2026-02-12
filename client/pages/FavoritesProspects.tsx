import React, { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings2,
  RefreshCw,
  Users,
  Target,
  Maximize,
  BarChart3,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Copy,
  Zap,
  TrendingUp,
  Globe,
  MessageCircle,
  CheckCircle,
  Clock,
  Activity,
  Lock,
  Brain,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Briefcase,
  BadgeCheck,
  MoreVertical,
  Heart,
  BookmarkMinus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FloatingStatsWidget } from "@/components/ui/floating-stats-widget";
import { markStepCompleted } from "@/lib/masteryStorage";
import { useToast } from "@/hooks/use-toast";

interface ProspectData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle: string;
  jobLevel: string;
  jobFunction: string;
  department?: string;
  companyName: string;
  companyDomain: string;
  companySize: string;
  industry: string;
  revenue: string;
  country: string;
  city: string;
  state?: string;
  profileImageUrl?: string;

  // Engagement & Intent Data
  engagementScore: number;
  intentScore: number;
  intentSignal: string;
  lastActivity: Date;
  recentActivities: string[];
  matchedTopics: string[];
  confidenceScore: number;

  // Additional Information
  yearsAtCompany?: number;
  totalExperience?: number;
  previousCompanies?: string[];
  education?: string;
  skills?: string[];
  socialMedia?: {
    twitter?: string;
    github?: string;
  };

  selected: boolean;
}

// Enhanced sample data for prospects
const sampleProspectData: ProspectData[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@autodesk.com",
    phone: "+1-415-555-0123",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    jobTitle: "Senior Product Manager",
    jobLevel: "Senior",
    jobFunction: "Product",
    department: "AutoCAD Division",
    companyName: "Autodesk",
    companyDomain: "autodesk.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Francisco",
    state: "CA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 92,
    intentScore: 87,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-15"),
    recentActivities: [
      "Downloaded whitepaper",
      "Attended webinar",
      "Visited pricing page",
    ],
    matchedTopics: ["3D Modeling", "CAD Software", "Product Development"],
    confidenceScore: 95,
    yearsAtCompany: 3,
    totalExperience: 8,
    previousCompanies: ["Adobe", "Salesforce"],
    education: "Stanford University - MBA",
    skills: ["Product Strategy", "3D Design", "Team Leadership"],
    socialMedia: {
      twitter: "@sarahj_pm",
    },
    selected: false,
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    email: "m.chen@bentley.com",
    phone: "+1-610-555-0187",
    linkedinUrl: "https://linkedin.com/in/michaelchen-eng",
    jobTitle: "Director of Engineering",
    jobLevel: "Director",
    jobFunction: "Engineering",
    department: "Infrastructure Solutions",
    companyName: "Bentley Systems",
    companyDomain: "bentley.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 88,
    intentScore: 91,
    intentSignal: "Super Strong",
    lastActivity: new Date("2024-01-12"),
    recentActivities: ["Requested demo", "Downloaded trial", "Contacted sales"],
    matchedTopics: ["Infrastructure Design", "BIM", "Engineering Software"],
    confidenceScore: 93,
    yearsAtCompany: 5,
    totalExperience: 12,
    previousCompanies: ["Siemens", "ANSYS"],
    education: "MIT - MS Engineering",
    skills: ["Software Architecture", "Team Management", "Infrastructure"],
    socialMedia: {
      github: "mchen-dev",
    },
    selected: false,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Rodriguez",
    fullName: "Emma Rodriguez",
    email: "emma.rodriguez@dassault.fr",
    phone: "+33-1-55-55-0123",
    linkedinUrl: "https://linkedin.com/in/emmarodriguez",
    jobTitle: "VP of Sales",
    jobLevel: "VP",
    jobFunction: "Sales",
    department: "Global Sales",
    companyName: "Dassault Systèmes",
    companyDomain: "3ds.com",
    companySize: "10001-50000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "France",
    city: "Vélizy-Villacoublay",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 85,
    intentScore: 89,
    intentSignal: "Strong",
    lastActivity: new Date("2024-01-10"),
    recentActivities: [
      "Viewed competitor analysis",
      "Shared content",
      "Attended conference",
    ],
    matchedTopics: ["PLM Software", "CATIA", "Digital Manufacturing"],
    confidenceScore: 90,
    yearsAtCompany: 7,
    totalExperience: 15,
    previousCompanies: ["SAP", "Oracle"],
    education: "HEC Paris - MBA",
    skills: ["Enterprise Sales", "PLM", "Strategic Partnerships"],
    selected: false,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    fullName: "David Kim",
    email: "david.kim@siemens.com",
    phone: "+49-89-555-0199",
    linkedinUrl: "https://linkedin.com/in/davidkim-plm",
    jobTitle: "Chief Technology Officer",
    jobLevel: "C-Level",
    jobFunction: "Engineering",
    department: "PLM Software Division",
    companyName: "Siemens PLM Software",
    companyDomain: "siemens.com",
    companySize: "50001+",
    industry: "Software and IT Services",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 94,
    intentScore: 86,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-14"),
    recentActivities: [
      "Strategic planning session",
      "Industry report download",
      "Partnership inquiry",
    ],
    matchedTopics: ["Digital Transformation", "Industry 4.0", "Manufacturing"],
    confidenceScore: 92,
    yearsAtCompany: 6,
    totalExperience: 18,
    previousCompanies: ["PTC", "Autodesk"],
    education: "Carnegie Mellon - PhD Computer Science",
    skills: ["Digital Manufacturing", "IoT", "Strategic Vision"],
    selected: false,
  },
  {
    id: "5",
    firstName: "Jennifer",
    lastName: "Taylor",
    fullName: "Jennifer Taylor",
    email: "j.taylor@ansys.com",
    phone: "+1-724-555-0156",
    linkedinUrl: "https://linkedin.com/in/jennifertaylor",
    jobTitle: "Senior Marketing Manager",
    jobLevel: "Senior",
    jobFunction: "Marketing",
    department: "Product Marketing",
    companyName: "ANSYS",
    companyDomain: "ansys.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 79,
    intentScore: 82,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-08"),
    recentActivities: [
      "Content engagement",
      "Email opens",
      "Social media activity",
    ],
    matchedTopics: ["Simulation Software", "FEA", "CFD"],
    confidenceScore: 85,
    yearsAtCompany: 4,
    totalExperience: 9,
    previousCompanies: ["Altair", "MSC Software"],
    education: "University of Michigan - MBA Marketing",
    skills: ["Product Marketing", "Demand Generation", "Technical Marketing"],
    selected: false,
  },
  {
    id: "6",
    firstName: "Robert",
    lastName: "Williams",
    fullName: "Robert Williams",
    email: "robert.williams@ptc.com",
    phone: "+1-781-555-0134",
    linkedinUrl: "https://linkedin.com/in/robertwilliams",
    jobTitle: "Engineering Manager",
    jobLevel: "Manager",
    jobFunction: "Engineering",
    department: "Creo Development",
    companyName: "PTC",
    companyDomain: "ptc.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston",
    state: "MA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 83,
    intentScore: 78,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-11"),
    recentActivities: [
      "Technical documentation",
      "Beta testing",
      "User feedback",
    ],
    matchedTopics: ["CAD Development", "Parametric Design", "PLM Integration"],
    confidenceScore: 87,
    yearsAtCompany: 8,
    totalExperience: 14,
    previousCompanies: ["SolidWorks", "Autodesk"],
    education: "Boston University - MS Mechanical Engineering",
    skills: ["Software Development", "CAD Systems", "Team Leadership"],
    selected: false,
  },
];

const FIRST_NAMES = [
  "Alex",
  "Priya",
  "Liam",
  "Noah",
  "Olivia",
  "Ava",
  "Ethan",
  "Mia",
  "Isabella",
  "Sophia",
  "Mason",
  "Charlotte",
  "Amelia",
  "Harper",
  "Benjamin",
  "Evelyn",
  "Lucas",
  "Abigail",
  "Henry",
  "Emily",
];
const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];
const COMPANY_POOL = [
  {
    name: "Autodesk",
    domain: "autodesk.com",
    size: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Francisco",
  },
  {
    name: "Bentley Systems",
    domain: "bentley.com",
    size: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton",
  },
  {
    name: "Dassault Systèmes",
    domain: "3ds.com",
    size: "10001-50000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "France",
    city: "Vélizy-Villacoublay",
  },
  {
    name: "Siemens PLM Software",
    domain: "siemens.com",
    size: "50001+",
    industry: "Software and IT Services",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
  },
  {
    name: "ANSYS",
    domain: "ansys.com",
    size: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg",
  },
  {
    name: "PTC",
    domain: "ptc.com",
    size: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston",
  },
];

function generateAdditionalProspects(count: number): ProspectData[] {
  const roles = [
    { title: "Senior Product Manager", level: "Senior", func: "Product" },
    {
      title: "Director of Engineering",
      level: "Director",
      func: "Engineering",
    },
    { title: "VP of Sales", level: "VP", func: "Sales" },
    { title: "Engineering Manager", level: "Manager", func: "Engineering" },
    { title: "Senior Marketing Manager", level: "Senior", func: "Marketing" },
  ];
  const intentSignals = [
    "Super Strong",
    "Very Strong",
    "Strong",
    "Medium",
    "Weak",
  ];
  const out: ProspectData[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const company = COMPANY_POOL[i % COMPANY_POOL.length];
    const role = roles[i % roles.length];
    const id = String(100 + i);
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${company.domain}`;
    const engagement = 60 + ((i * 7) % 41);
    const intent = 60 + ((i * 11) % 41);
    const confidence = 70 + ((i * 9) % 26);
    const intentSignal = intentSignals[(i * 5 + 2) % intentSignals.length];
    out.push({
      id,
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      email,
      phone: "+1-415-555-0" + String((i % 9000) + 1000),
      linkedinUrl: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
      jobTitle: role.title,
      jobLevel: role.level,
      jobFunction: role.func,
      department: undefined,
      companyName: company.name,
      companyDomain: company.domain,
      companySize: company.size,
      industry: company.industry,
      revenue: company.revenue,
      country: company.country,
      city: company.city,
      state: undefined,
      profileImageUrl: "/api/placeholder/40/40",
      engagementScore: engagement,
      intentScore: intent,
      intentSignal,
      lastActivity: new Date(Date.now() - (i % 20) * 86400000),
      recentActivities: [
        "Viewed product page",
        "Downloaded whitepaper",
        "Attended webinar",
      ].slice(0, (i % 3) + 1),
      matchedTopics: [
        "3D Modeling",
        "CAD Software",
        "Product Development",
        "PLM",
      ].slice(0, (i % 4) + 1),
      confidenceScore: confidence,
      yearsAtCompany: (i % 7) + 1,
      totalExperience: (i % 15) + 5,
      previousCompanies: ["Adobe", "Salesforce", "Oracle"].slice(
        0,
        (i % 3) + 1,
      ),
      education: undefined,
      skills: ["Product Strategy", "CAD Systems", "Leadership"].slice(
        0,
        (i % 3) + 1,
      ),
      socialMedia: {},
      selected: false,
    });
  }
  return out;
}

const desiredProspects = 50;
const extraNeeded = Math.max(0, desiredProspects - sampleProspectData.length);
const initialProspects: ProspectData[] = [
  ...sampleProspectData,
  ...generateAdditionalProspects(extraNeeded),
];

export default function FavoritesProspects() {
  const [data] = useState<ProspectData[]>(initialProspects);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] =
    useState<keyof ProspectData>("engagementScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    jobFunction: "",
    jobLevel: "",
    company: "",
    country: "",
    revenue: "",
    engagementRange: { min: 0, max: 100 },
  });

  const { toast } = useToast();

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("prospect:favorites");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("prospect:favorites", JSON.stringify(favorites));
      // Dispatch event to notify sidebar of favorites update
      window.dispatchEvent(new CustomEvent("app:favorites-updated"));
    } catch {}
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);
  const toggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      toast({
        title: exists ? "Removed from favorites" : "Added to favorites",
        description: name ? `${name}` : undefined,
      });
      return next;
    });
  };

  const handleCopy = (value: string, label?: string) => {
    try {
      navigator.clipboard.writeText(value);
      toast({
        title: "Copied",
        description: label
          ? `${label} copied to clipboard`
          : "Copied to clipboard",
      });
    } catch {}
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!domain || !user) return "••••••";
    const maskedUser = `${user[0]}${"*".repeat(Math.max(user.length - 1, 3))}`;
    return `${maskedUser}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    let digitIdx = 0;
    return phone
      .split("")
      .map((ch) => {
        if (/\d/.test(ch)) {
          const remaining = digits.length - digitIdx;
          const out = remaining <= 2 ? digits[digitIdx] : "*";
          digitIdx++;
          return out;
        }
        return ch;
      })
      .join("");
  };

  const [columnVisibility, setColumnVisibility] = useState({
    prospect: true,
    company: true,
    jobTitle: true,
    jobFunction: true,
    revenue: true,
    mainIndustry: true,
    country: true,
    contactInfo: true,
    actions: true,
  });

  const columns = [
    { key: "prospect", label: "Prospect" },
    { key: "company", label: "Company" },
    { key: "jobTitle", label: "Job Title" },
    { key: "jobFunction", label: "Job Function" },
    { key: "revenue", label: "Revenue" },
    { key: "mainIndustry", label: "Main Industry" },
    { key: "country", label: "Country" },
    { key: "contactInfo", label: "Contact Info" },
    { key: "actions", label: "Actions" },
  ] as const;

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const revenueOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.revenue))).sort(),
    [data],
  );

  // Filter to show only favorites
  const favoritedData = useMemo(() => {
    return data.filter((item) => favorites.includes(item.id));
  }, [data, favorites]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return favoritedData.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJobFunction =
        !filters.jobFunction || item.jobFunction === filters.jobFunction;
      const matchesJobLevel =
        !filters.jobLevel || item.jobLevel === filters.jobLevel;
      const matchesCompany =
        !filters.company || item.companyName === filters.company;
      const matchesCountry =
        !filters.country || item.country === filters.country;
      const matchesRevenue =
        !filters.revenue || item.revenue === filters.revenue;
      const matchesEngagement =
        item.engagementScore >= filters.engagementRange.min &&
        item.engagementScore <= filters.engagementRange.max;

      return (
        matchesSearch &&
        matchesJobFunction &&
        matchesJobLevel &&
        matchesCompany &&
        matchesCountry &&
        matchesRevenue &&
        matchesEngagement
      );
    });
  }, [favoritedData, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ProspectData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getIntentSignalColor = (signal: string) => {
    switch (signal) {
      case "Super Strong":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Very Strong":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Strong":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Weak":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const sizeToHeadcount = (size: string) => {
    switch (size) {
      case "1-10":
        return "1 to 10 employees";
      case "11-50":
        return "11 to 50 employees";
      case "51-200":
        return "51 to 200 employees";
      case "201-500":
        return "201 to 500 employees";
      case "501-1000":
        return "501 to 1,000 employees";
      case "1001-5000":
        return "1,001 to 5,000 employees";
      case "5001-10000":
        return "5,001 to 10,000 employees";
      case "10001-50000":
        return "10,001 to 50,000 employees";
      case "50001+":
        return "50,001+ employees";
      default:
        return size;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    const el = containerRef.current ?? document.documentElement;
    try {
      if (!document.fullscreenElement) {
        // @ts-ignore
        await el.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch (_e) {
      setIsFullScreen((prev) => {
        const next = !prev;
        const node = containerRef.current;
        if (node) {
          if (next) node.classList.add("app-fullscreen");
          else node.classList.remove("app-fullscreen");
        }
        return next;
      });
    }
  };

  // Empty state
  if (favorites.length === 0) {
    return (
      <TooltipProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                    aria-label="Back"
                    asChild
                  >
                    <Link to="/find-prospect">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-valasys-orange" />
                  Favorites Prospects
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Your saved favorite prospects will appear here
                </div>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-valasys-orange/10 to-orange-50 rounded-full">
                    <BookmarkMinus className="w-12 h-12 text-valasys-orange" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No Favorite Prospects Yet
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Start adding prospects to your favorites by clicking the
                      heart icon on the Prospect Results page. Your favorite
                      prospects will be saved here for easy access.
                    </p>
                  </div>
                  <Link to="/find-prospect">
                    <Button className="bg-valasys-orange hover:bg-valasys-orange/90 text-white mt-4">
                      <Search className="w-4 h-4 mr-2" />
                      Find Prospects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div
          ref={containerRef}
          className={cn("space-y-6", isFullScreen && "app-fullscreen")}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                    aria-label="Back"
                    asChild
                  >
                    <Link to="/find-prospect">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-valasys-orange" />
                  Favorites Prospects
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Your saved favorite prospects
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <FloatingStatsWidget className="w-full lg:w-auto" />
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              {/* Search and Quick Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Columns"
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="p-2">
                        <h4 className="text-sm font-medium mb-3">Columns</h4>
                        <div className="space-y-2">
                          {columns.map((column) => (
                            <div
                              key={column.key}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <label
                                  htmlFor={`column-${column.key}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {column.label}
                                </label>
                              </div>
                              <Switch
                                id={`column-${column.key}`}
                                checked={
                                  columnVisibility[
                                    column.key as keyof typeof columnVisibility
                                  ]
                                }
                                onCheckedChange={() =>
                                  toggleColumn(
                                    column.key as keyof typeof columnVisibility,
                                  )
                                }
                                className="data-[state=checked]:bg-valasys-orange"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleFullscreen}
                    aria-label={
                      isFullScreen ? "Exit Full Screen" : "Full Screen"
                    }
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Total Prospects:{" "}
                  <span className="font-medium">{filteredData.length}</span> •
                  Page: <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.jobFunction || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobFunction: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Functions</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.jobLevel || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobLevel: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="C-Level">C-Level</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.revenue || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      revenue: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Revenues</SelectItem>
                    {revenueOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.country || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      country: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        setFilters({
                          jobFunction: "",
                          jobLevel: "",
                          company: "",
                          country: "",
                          revenue: "",
                          engagementRange: { min: 0, max: 100 },
                        })
                      }
                      variant="outline"
                      size="icon"
                      aria-label="Reset filters"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">Favorite Prospects</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Selected
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-valasys-orange hover:bg-valasys-orange/90"
                        disabled={selectedItems.length === 0}
                        onClick={() =>
                          markStepCompleted("prospectDetailsDownloaded")
                        }
                        size="icon"
                        aria-label={`Export ${selectedItems.length}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={
                            selectedItems.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {columnVisibility.prospect && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("fullName")}
                        >
                          <div className="flex items-center justify-between">
                            Prospect
                            <div className="ml-2">
                              {sortField === "fullName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.company && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("companyName")}
                        >
                          <div className="flex items-center justify-between">
                            Company
                            <div className="ml-2">
                              {sortField === "companyName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobTitle && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobTitle")}
                        >
                          <div className="flex items-center justify-between">
                            Job Title
                            <div className="ml-2">
                              {sortField === "jobTitle" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobFunction && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobFunction")}
                        >
                          <div className="flex items-center justify-between">
                            Job Function
                            <div className="ml-2">
                              {sortField === "jobFunction" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.revenue && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("revenue")}
                        >
                          <div className="flex items-center justify-between">
                            Revenue
                            <div className="ml-2">
                              {sortField === "revenue" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.mainIndustry && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("industry")}
                        >
                          <div className="flex items-center justify-between">
                            Main Industry
                            <div className="ml-2">
                              {sortField === "industry" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.country && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("country")}
                        >
                          <div className="flex items-center justify-between">
                            Country
                            <div className="ml-2">
                              {sortField === "country" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.contactInfo && (
                        <TableHead>Contact Info</TableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead className="w-16">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((prospect) => (
                        <TableRow key={prospect.id}>
                          <TableCell className="pl-6">
                            <Checkbox
                              checked={selectedItems.includes(prospect.id)}
                              onCheckedChange={(checked) =>
                                handleSelectItem(prospect.id, !!checked)
                              }
                            />
                          </TableCell>
                          {columnVisibility.prospect && (
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={prospect.profileImageUrl}
                                    alt={prospect.fullName}
                                  />
                                  <AvatarFallback className="bg-valasys-orange text-white text-xs">
                                    {prospect.firstName[0]}
                                    {prospect.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {prospect.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Badge
                                      className={cn(
                                        "text-xs",
                                        getIntentSignalColor(
                                          prospect.intentSignal,
                                        ),
                                      )}
                                    >
                                      {prospect.intentSignal}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.company && (
                            <TableCell>
                              <div className="font-medium text-gray-900 flex items-center">
                                <Building className="w-4 h-4 mr-1 text-gray-400" />
                                {prospect.companyName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {prospect.industry}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {prospect.companySize} • {prospect.revenue}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.jobTitle && (
                            <TableCell>
                              <div className="text-sm text-gray-900 font-medium">
                                {prospect.jobTitle}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.jobFunction && (
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {prospect.jobFunction}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.revenue && (
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {prospect.revenue}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.mainIndustry && (
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {prospect.industry}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.country && (
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {prospect.country}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.contactInfo && (
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        handleCopy(prospect.email, "Email")
                                      }
                                    >
                                      <Mail className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    {maskEmail(prospect.email)}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.actions && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  toggleFavorite(prospect.id, prospect.fullName)
                                }
                              >
                                <Heart
                                  className={cn(
                                    "w-4 h-4",
                                    isFavorite(prospect.id)
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-400 hover:text-red-500",
                                  )}
                                />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={
                            Object.values(columnVisibility).filter((v) => v)
                              .length + 1
                          }
                          className="text-center py-8 text-gray-500"
                        >
                          No prospects found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-valasys-orange text-white"
                        : ""
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
