"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Mail,
  Terminal,
  Globe,
  GraduationCap,
  MapPin,
  Code2,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Layers,
  Palette,
  Box,
  PenTool,
  Users,
  Target,
  BookOpen,
  Brain,
  Dna,
  ChevronDown,
  Send,
  Clock,
  CheckCircle,
  Zap,
  MessageSquare,
  Coffee
} from "lucide-react";

// i18n translations
const translations = {
  en: {
    // Navigation
    home: "Home",
    notes: "Notes",
    topics: "Topics",
    about: "About",
    subscribe: "Subscribe",
    workspace: "Workspace",
    // Hero
    welcome: "Welcome to Haw's Chat",
    subtitle: "To be the top one percent AI creativity in the world",
    // Bio Card
    education: "Biology & AI",
    role: "AI Creator",
    location: "Kunming, China",
    independentCreator: "INDEPENDENT CREATOR",
    // CTA
    startReading: "START",
    // About Section
    aboutTitle: "About the Agent",
    aboutSubtitle: "Where Ideas Converge",
    aboutDesc1: "Haw Chat is a personal knowledge agent founded in 2026, dedicated to exploring the intersection of artificial intelligence and biological sciences. We believe in the power of cross-disciplinary thinking to unlock unprecedented innovation.",
    aboutDesc2: "Our mission is to document, experiment, and share insights at the frontier of technology and nature. Through careful curation of ideas, projects, and experiments, we aim to create a space where creativity meets precision.",
    focusAreas: "Focus Areas",
    aiResearch: "AI Research",
    aiResearchDesc: "Exploring machine learning, neural networks, and the future of intelligent systems",
    biologyStudy: "Biology Study",
    biologyStudyDesc: "Understanding life through computational biology and bio-inspired algorithms",
    creativeCoding: "Creative Coding",
    creativeCodingDesc: "Building expressive digital experiences through code and design",
    // Services
    servicesTitle: "Our Services",
    servicesSubtitle: "What We Create",
    uiux: "UI/UX Design",
    uiuxDesc: "Crafting intuitive interfaces that delight users and drive engagement",
    branding: "Branding",
    brandingDesc: "Building memorable brand identities that resonate with audiences",
    digitalProducts: "Digital Products",
    digitalProductsDesc: "Developing web and mobile applications with modern technologies",
    creativeDesign: "Creative Design",
    creativeDesignDesc: "Creating visual assets that communicate and inspire",
    // Projects
    projectsTitle: "Featured Projects",
    projectsSubtitle: "Selected Works",
    viewProject: "View Project",
    project1Title: "Nebula Dashboard",
    project1Desc: "AI-powered analytics platform with real-time data visualization",
    project2Title: "Aurora Brand",
    project2Desc: "Complete brand identity for a biotech startup",
    project3Title: "Quantum UI",
    project3Desc: "Design system for quantum computing applications",
    project4Title: "Velocity App",
    project4Desc: "Productivity app with intelligent task management",
    project5Title: "Spectrum",
    project5Desc: "Generative art platform using AI algorithms",
    // Process
    processTitle: "How We Work",
    processSubtitle: "Our Process",
    step1Title: "Discovery",
    step1Desc: "Understanding your vision, goals, and requirements through deep conversation",
    step2Title: "Exploration",
    step2Desc: "Research, brainstorming, and conceptualizing creative directions",
    step3Title: "Creation",
    step3Desc: "Bringing ideas to life with meticulous craft and attention to detail",
    step4Title: "Delivery",
    step4Desc: "Polishing, testing, and launching with ongoing support",
    // Contact
    contactTitle: "Get in Touch",
    contactSubtitle: "Start a Conversation",
    contactName: "Your Name",
    contactEmail: "Email Address",
    contactMessage: "Your Message",
    contactSubmit: "Send Message",
    namePlaceholder: "John Doe",
    emailPlaceholder: "john@example.com",
    messagePlaceholder: "Tell us about your project...",
    // Footer
    rights: "All rights reserved",
  },
  zh: {
    // Navigation
    home: "首页",
    notes: "笔记",
    topics: "主题",
    about: "关于",
    subscribe: "订阅",
    workspace: "进入工作区",
    // Hero
    welcome: "欢迎来到 Haw Chat",
    subtitle: "成为世界上前1%的AI先进生产力",
    // Bio Card
    education: "生物 & AI",
    role: "AI 创作者",
    location: "中国昆明",
    independentCreator: "独立创作者",
    // CTA
    startReading: "开始阅读",
    // About Section
    aboutTitle: "关于智能体",
    aboutSubtitle: "思想交汇之地",
    aboutDesc1: "Haw Chat 是一个个人知识智能体系统，成立于2026年，致力于探索人工智能与生物科学的交叉领域。我们相信跨学科思维的力量能够释放前所未有的创新。",
    aboutDesc2: "我们的使命是记录、实验并分享前沿技术和自然的见解。通过精心策划的想法、项目和实验，我们旨在创建一个创意与精确相遇的空间。",
    focusAreas: "专注领域",
    aiResearch: "AI 研究",
    aiResearchDesc: "探索机器学习、神经网络和智能系统的未来",
    biologyStudy: "生物学研究",
    biologyStudyDesc: "通过计算生物学和仿生算法理解生命",
    creativeCoding: "创意编程",
    creativeCodingDesc: "通过代码和设计构建富有表现力的数字体验",
    // Services
    servicesTitle: "我们的服务",
    servicesSubtitle: "我们创造的内容",
    uiux: "UI/UX 设计",
    uiuxDesc: "打造直观、愉悦用户并推动参与的界面",
    branding: "品牌设计",
    brandingDesc: "建立与受众产生共鸣的难忘品牌标识",
    digitalProducts: "数字产品",
    digitalProductsDesc: "使用现代技术开发网页和移动应用",
    creativeDesign: "创意设计",
    creativeDesignDesc: "创作传达和激励人心的视觉资产",
    // Projects
    projectsTitle: "精选项目",
    projectsSubtitle: "作品展示",
    viewProject: "查看项目",
    project1Title: "星云仪表盘",
    project1Desc: "具有实时数据可视化的人工智能分析平台",
    project2Title: "极光品牌",
    project2Desc: "生物科技初创公司的完整品牌标识",
    project3Title: "量子 UI",
    project3Desc: "量子计算应用的设计系统",
    project4Title: "速度应用",
    project4Desc: "具有智能任务管理的生产力应用",
    project5Title: "光谱",
    project5Desc: "使用 AI 算法生成艺术平台",
    // Process
    processTitle: "我们如何工作",
    processSubtitle: "工作流程",
    step1Title: "探索",
    step1Desc: "通过深入对话了解您的愿景、目标和需求",
    step2Title: "构思",
    step2Desc: "研究、头脑风暴和概念化创意方向",
    step3Title: "创造",
    step3Desc: "以精湛的技艺和对细节的关注将想法变为现实",
    step4Title: "交付",
    step4Desc: "完善、测试并提供持续支持",
    // Contact
    contactTitle: "联系我们",
    contactSubtitle: "开始对话",
    contactName: "您的姓名",
    contactEmail: "电子邮件",
    contactMessage: "您的留言",
    contactSubmit: "发送消息",
    namePlaceholder: "张三",
    emailPlaceholder: "zhangsan@example.com",
    messagePlaceholder: "告诉我们您的项目...",
    // Footer
    rights: "版权所有",
  }
};

// Floating glass element
const FloatingGlass = ({
  size,
  position,
  delay = 0,
  blur = true,
  color = "rgba(255, 255, 255, 0.15)"
}: {
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  blur?: boolean;
  color?: string;
}) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${blur ? 'backdrop-blur-md' : ''}`}
    style={{
      width: size,
      height: size,
      background: color,
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      ...position
    }}
    animate={{
      y: [0, -25, 0],
      rotate: [0, 8, 0],
      scale: [1, 1.08, 1]
    }}
    transition={{
      duration: 10 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Prism shape
const PrismShape = ({
  size,
  position,
  delay = 0
}: {
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      width: size,
      height: size * 0.6,
      ...position
    }}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 12 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <div
      className="w-full h-full"
      style={{
        background: "linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(57, 255, 20, 0.1))",
        backdropFilter: "blur(10px)",
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
    />
  </motion.div>
);

// Navigation Component
const Navigation = ({
  lang,
  setLang,
  isDark,
  setIsDark,
  scrollY
}: {
  lang: "en" | "zh";
  setLang: (l: "en" | "zh") => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  scrollY: number;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];
  const navLinks = [
    { label: t.home, href: "#home" },
    { label: t.notes, href: "#about" },
    { label: t.topics, href: "#services" },
    { label: t.about, href: "#projects" },
    { label: t.subscribe, href: "#contact" }
  ];

  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div
        className={`capsule-nav flex items-center px-6 py-3 ${scrollY > 50 ? 'nav-scrolled' : ''}`}
      >
        {/* Logo */}
        <motion.div
          className="text-xl font-serif font-bold tracking-wide"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-slate-800 dark:text-white">Haw</span>
          <span className="text-orange-500">.</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 ml-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Toggle Groups */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Workspace CTA Button */}
          <Link href="/workspace">
            <motion.span
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/40 dark:bg-slate-800/40
                backdrop-blur-md
                border border-transparent bg-clip-padding
                shadow-sm
                hover:shadow-md hover:scale-105
                transition-all duration-300"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), linear-gradient(135deg, #39FF14, #f97316)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t.workspace}
              </span>
            </motion.span>
          </Link>

          {/* Language Toggle */}
          <div className="toggle-group">
            <button
              onClick={() => setLang("en")}
              className={`${lang === "en" ? "active" : ""}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`${lang === "zh" ? "active" : ""}`}
            >
              中
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden glass-card mt-2 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="block py-2 text-slate-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Profile Card with Magnetic Effect
const ProfileCard = ({ lang }: { lang: "en" | "zh" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const t = translations[lang];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const profileInfo = [
    { icon: GraduationCap, label: t.education },
    { icon: Code2, label: t.role },
    { icon: MapPin, label: t.location }
  ];

  return (
    <motion.div
      ref={cardRef}
      className="glass-card p-8 max-w-md mx-auto cursor-pointer"
      style={{ x: position.x, y: position.y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        boxShadow: isHovered ? "0 30px 60px -12px rgba(0, 0, 0, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.15)" : "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {/* Profile Image */}
      <motion.div
        className="relative w-32 h-32 mx-auto mb-6"
        animate={{ scale: isHovered ? 1.05 : 1 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-[3px]">
          <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            <span className="text-4xl font-serif font-bold bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">L</span>
          </div>
        </div>
        <motion.div
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-400 border-4 border-white dark:border-slate-800"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Name */}
      <h2 className="text-center text-2xl font-serif font-bold text-slate-800 dark:text-white mb-1">
        陆 BRUCE
      </h2>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wider mb-6">
        {t.independentCreator}
      </p>

      {/* Info Icons */}
      <div className="flex justify-center gap-6 mb-6">
        {profileInfo.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1"
            whileHover={{ y: -4 }}
          >
            <div className="w-11 h-11 rounded-full glass-inner flex items-center justify-center">
              <item.icon size={18} className="text-orange-500" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-4 pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
        {[
          { icon: Mail, href: "mailto:bruce@example.com", label: "Email" },
          { icon: Terminal, href: "https://github.com", label: "GitHub" },
          { icon: Globe, href: "https://bruce.example.com", label: "Website" }
        ].map((social, i) => (
          <motion.a
            key={i}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ y: -4, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <social.icon size={18} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

// CTA Button
const CTAButton = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/workspace">
      <motion.span
        className="cta-button group relative overflow-hidden inline-flex cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 flex items-center gap-2 text-white font-semibold">
          {t.startReading}
          <motion.span
            className="relative"
            animate={{ x: isHovered ? 6 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowRight size={20} />
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full blur-sm"
              animate={{
                scale: isHovered ? [0.5, 1.8] : 0,
                opacity: isHovered ? [0.6, 0] : 0
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.span>
        </span>

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? ["-100%", "100%"] : "-100%" }}
          transition={{ duration: 0.7, repeat: isHovered ? Infinity : 0, repeatDelay: 0.6 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </motion.div>
      </motion.span>
    </Link>
  );
};

// Section Wrapper
const Section = ({
  id,
  children,
  className = ""
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={`py-20 px-4 ${className}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

// Glass Card
const GlassCard = ({
  children,
  className = "",
  hover = true
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <motion.div
    className={`glass-card p-6 ${hover ? 'hover-lift' : ''} ${className}`}
    whileHover={hover ? { y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" } : undefined}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    {children}
  </motion.div>
);

// About Section
const AboutSection = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const focusAreas = [
    { icon: Brain, title: t.aiResearch, desc: t.aiResearchDesc },
    { icon: Dna, title: t.biologyStudy, desc: t.biologyStudyDesc },
    { icon: Code2, title: t.creativeCoding, desc: t.creativeCodingDesc }
  ];

  return (
    <Section id="about" className="relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-4">
          {t.aboutTitle}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.aboutSubtitle}</p>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <GlassCard className="text-center lg:text-left">
          <Coffee className="w-12 h-12 text-orange-500 mb-4 mx-auto lg:mx-0" />
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.aboutDesc1}
          </p>
        </GlassCard>
        <GlassCard className="text-center lg:text-left">
          <BookOpen className="w-12 h-12 text-lime-500 mb-4 mx-auto lg:mx-0" />
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.aboutDesc2}
          </p>
        </GlassCard>
      </div>

      <motion.h3
        className="text-2xl font-serif font-bold text-slate-800 dark:text-white text-center mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {t.focusAreas}
      </motion.h3>

      <div className="grid md:grid-cols-3 gap-6">
        {focusAreas.map((area, i) => (
          <GlassCard key={i} className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 flex items-center justify-center mx-auto mb-4">
              <area.icon size={24} className="text-orange-500" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{area.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{area.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
};

// Services Section
const ServicesSection = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const services = [
    { icon: Layers, title: t.uiux, desc: t.uiuxDesc, color: "from-orange-400 to-pink-500" },
    { icon: Palette, title: t.branding, desc: t.brandingDesc, color: "from-lime-400 to-cyan-500" },
    { icon: Box, title: t.digitalProducts, desc: t.digitalProductsDesc, color: "from-cyan-400 to-blue-500" },
    { icon: PenTool, title: t.creativeDesign, desc: t.creativeDesignDesc, color: "from-violet-400 to-purple-500" }
  ];

  return (
    <Section id="services" className="relative bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-slate-800/50">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-4">
          {t.servicesTitle}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.servicesSubtitle}</p>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <GlassCard key={i} className="text-center group">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-[2px] mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center">
                <service.icon size={28} className="text-slate-700 dark:text-slate-200" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{service.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{service.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
};

// Projects Section
const ProjectsSection = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const projects = [
    { title: t.project1Title, desc: t.project1Desc, color: "from-orange-500 to-pink-500", year: "2024" },
    { title: t.project2Title, desc: t.project2Desc, color: "from-lime-500 to-cyan-500", year: "2024" },
    { title: t.project3Title, desc: t.project3Desc, color: "from-cyan-500 to-blue-500", year: "2023" },
    { title: t.project4Title, desc: t.project4Desc, color: "from-violet-500 to-purple-500", year: "2023" },
    { title: t.project5Title, desc: t.project5Desc, color: "from-orange-400 to-yellow-500", year: "2023" }
  ];

  return (
    <Section id="projects" className="relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-4">
          {t.projectsTitle}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.projectsSubtitle}</p>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassCard className="aspect-[4/3] flex flex-col justify-end relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

              {/* Year badge */}
              <span className="absolute top-4 right-4 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {project.year}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} p-[2px] mb-3`}>
                  <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">{project.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.desc}
                </p>
                <motion.a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 4 }}
                >
                  {t.viewProject} <ArrowRight size={14} />
                </motion.a>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Process Section
const ProcessSection = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const steps = [
    { icon: Target, title: t.step1Title, desc: t.step1Desc, delay: 0 },
    { icon: Sparkles, title: t.step2Title, desc: t.step2Desc, delay: 0.15 },
    { icon: Zap, title: t.step3Title, desc: t.step3Desc, delay: 0.3 },
    { icon: CheckCircle, title: t.step4Title, desc: t.step4Desc, delay: 0.45 }
  ];

  return (
    <Section id="process" className="relative bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-slate-800/50">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-4">
          {t.processTitle}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.processSubtitle}</p>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: step.delay }}
            className="relative"
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-orange-200 to-lime-200 dark:from-orange-900/50 dark:to-lime-900/50 z-0" />
            )}

            <GlassCard className="text-center relative z-10">
              {/* Step number */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {i + 1}
              </span>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-lime-100 dark:from-orange-900/30 dark:to-lime-900/30 flex items-center justify-center mx-auto mb-4 mt-2">
                <step.icon size={24} className="text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Contact Section
const ContactSection = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Section id="contact" className="relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-4">
          {t.contactTitle}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.contactSubtitle}</p>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.contactName}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.namePlaceholder}
                  className="glass-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.contactEmail}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.emailPlaceholder}
                  className="glass-input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.contactMessage}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t.messagePlaceholder}
                rows={5}
                className="glass-input resize-none"
                required
              />
            </div>
            <div className="text-center">
              <motion.button
                type="submit"
                className="cta-button inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitted ? (
                  <>
                    <CheckCircle size={18} />
                    Sent!
                  </>
                ) : (
                  <>
                    {t.contactSubmit}
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </GlassCard>
      </div>
    </Section>
  );
};

// Footer
const Footer = ({ lang }: { lang: "en" | "zh" }) => {
  const t = translations[lang];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-slate-200/30 dark:border-slate-700/30">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl font-serif font-bold text-slate-800 dark:text-white">Haw Chat</span>
          <span className="text-orange-500">.</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {currentYear} Haw Chat. {t.rights}.
        </p>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function HomePage() {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [isDark, setIsDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Parallax transforms
  const parallax1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const parallax4 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div ref={containerRef} className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? '#fff' : '#000'} 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
      </div>

      {/* Floating Glass Elements - Parallax */}
      <motion.div style={{ y: parallax1 }} className="absolute top-20 left-10 pointer-events-none">
        <FloatingGlass size={100} position={{ top: "10%", left: "8%" }} delay={0} color="rgba(249, 115, 22, 0.08)" />
      </motion.div>
      <motion.div style={{ y: parallax2 }} className="absolute top-40 right-16 pointer-events-none">
        <FloatingGlass size={70} position={{ top: "20%", right: "12%" }} delay={1} color="rgba(57, 255, 20, 0.08)" />
      </motion.div>
      <motion.div style={{ y: parallax3 }} className="absolute bottom-60 left-1/4 pointer-events-none">
        <FloatingGlass size={180} position={{ bottom: "30%", left: "15%" }} delay={2} color="rgba(249, 115, 22, 0.06)" />
      </motion.div>
      <motion.div style={{ y: parallax4 }} className="absolute top-1/3 right-1/4 pointer-events-none">
        <PrismShape size={120} position={{ top: "30%", right: "18%" }} delay={0.5} />
      </motion.div>
      <motion.div style={{ y: parallax1 }} className="absolute bottom-40 right-1/3 pointer-events-none">
        <FloatingGlass size={50} position={{ bottom: "20%", right: "28%" }} delay={1.5} color="rgba(57, 255, 20, 0.1)" />
      </motion.div>
      <motion.div style={{ y: parallax2 }} className="absolute top-1/2 left-16 pointer-events-none">
        <PrismShape size={80} position={{ top: "45%", left: "10%" }} delay={2.5} />
      </motion.div>

      {/* Navigation */}
      <Navigation lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} scrollY={scrollY} />

      {/* Hero Section */}
      <motion.section id="home" className="relative z-10 pt-40 pb-20 px-4" style={{ y }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
              {translations[lang].welcome}
            </h1>
            <motion.p
              className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {translations[lang].subtitle}
            </motion.p>
            <motion.div
              className="w-32 h-1.5 bg-gradient-to-r from-lime-400 to-orange-500 mx-auto mt-8 rounded-full shadow-lg shadow-lime-400/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </motion.div>

          {/* Bio Card */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <ProfileCard lang={lang} />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <CTAButton lang={lang} />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="w-8 h-12 border-2 border-slate-300 dark:border-slate-600 rounded-full flex justify-center p-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Extended Content Sections */}
      <AboutSection lang={lang} />
      <ServicesSection lang={lang} />
      <ProjectsSection lang={lang} />
      <ProcessSection lang={lang} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}