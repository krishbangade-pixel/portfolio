"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { Copy, Volume2, VolumeX, Mail, Phone, MapPin, Link, Download, Eye, User, Briefcase, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { projects, skills, testimonials } from "@/data/portfolio";
import dynamic from "next/dynamic";
const CinematicModelViewer = dynamic(() => import("@/components/ui/CinematicModelViewer"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-cyan-300">Loading Model...</div> });


// Initialize EmailJS
emailjs.init("ZubuIthTkUHEbYxFW");

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Cinematic Video Editing",
  "Motion Graphics & Typography",
  "Color Grading and Film Emulation",
  "Trailer & Launch Campaign Reels",
  "Social Ad Creative Systems",
];

export default function HomeExperience() {
  const [modalProject, setModalProject] = useState(null);
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [clickBursts, setClickBursts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [submitMessage, setSubmitMessage] = useState("");

  const sectionsRef = useRef([]);
  const vantaRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const marqueeItems = useMemo(() => [...testimonials, ...testimonials], []);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        scrollProjectsRight();
      } else {
        scrollProjectsLeft();
      }
    }
    setTouchStart(null);
  };

  // Scroll functions for navigation arrows
  const scrollProjectsLeft = () => {
    if (projectsContainerRef.current) {
      const scrollDistance = window.innerWidth < 768 ? 300 : 420; // Mobile: 300px, Desktop: 420px
      projectsContainerRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
    }
  };

  const scrollProjectsRight = () => {
    if (projectsContainerRef.current) {
      const scrollDistance = window.innerWidth < 768 ? 300 : 420; // Mobile: 300px, Desktop: 420px
      projectsContainerRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    }
  };

  // Pause all other videos when one starts playing
  const handleVideoPlay = (e) => {
    const videos = document.querySelectorAll('video');
    videos.forEach((vid) => {
      if (vid !== e.target && !vid.paused) {
        vid.pause();
      }
    });
  };

  useEffect(() => {
    const revealAnimations = [];
    let vantaEffect;
    let initTimer;


    sectionsRef.current.forEach((section) => {
      if (!section) return;
      const animation = gsap.fromTo(
        section,
        { opacity: 0, y: 80, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        }
      );
      revealAnimations.push(animation);
    });

    const initVanta = () => {
      if (!vantaRef.current || typeof window === "undefined") return;
      if (!window.VANTA?.NET || !window.THREE || vantaEffect) return;
      vantaEffect = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
      });
    };

    initTimer = window.setInterval(initVanta, 300);
    window.setTimeout(() => window.clearInterval(initTimer), 5000);

    return () => {
      revealAnimations.forEach((animation) => animation.kill());
      if (initTimer) window.clearInterval(initTimer);
      if (vantaEffect) vantaEffect.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const copyMail = async () => {
    await navigator.clipboard.writeText("hello@cinereel.studio");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const triggerButtonClickAnimation = (event) => {
    const id = Date.now() + Math.random();
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    setClickBursts((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setClickBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, 520);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      setSubmitMessage("Please fill in all required fields.");
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.send("service_6zrpwix", "template_8m7754k", {
        to_email: "hello@cinereel.studio",
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || "Not provided",
        message: formData.message
      });

      setSubmitStatus("success");
      setSubmitMessage("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus("error");
      setSubmitMessage("Failed to send message. Please try again.");
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-28 pb-24">
        <section id="home" className="relative min-h-screen overflow-hidden px-6 pt-24 md:px-12">
          <div ref={vantaRef} className="pointer-events-none absolute inset-0 opacity-45" />
          <div className="grid min-h-[80vh] items-center gap-10 lg:grid-cols-2">
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300">
                K R I S H
              </m.p>
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">Video Editor & Motion Designer</h1>
              <p className="mt-5 max-w-xl text-white/70">
                I craft cinematic edits and premium motion experiences that feel like movie trailers for modern brands.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <m.a
                  href="#projects"
                  onClick={triggerButtonClickAnimation}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(34,211,238,0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="glow rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 shadow-lg hover:shadow-cyan-400/50"
                >
                  View Projects
                </m.a>
                <m.a
                  href="#contact"
                  onClick={triggerButtonClickAnimation}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(168,85,247,0.4)",
                    borderColor: "rgba(168,85,247,0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-purple-400/30"
                >
                  Hire Me
                </m.a>
              </div>
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="glass-card relative h-[420px] overflow-hidden rounded-3xl border border-white/15"
            >
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/35 blur-3xl" />
              <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-cyan-400/35 blur-3xl" />
              <div className="relative m-6 h-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent">
                <CinematicModelViewer />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">I'm Krish Bangade</p>
                  <p className="mt-2 max-w-xs text-sm text-white/70">Hello I'm the video editor you are looking for</p>
                </div>
              </div>
            </m.div>
          </div>
          <div className="absolute bottom-8 left-1/2 h-14 w-8 -translate-x-1/2 rounded-full border border-white/30 p-1">
            <m.div animate={{ y: [0, 24, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="mx-auto h-2 w-2 rounded-full bg-cyan-300" />
          </div>
        </section>

        <section id="projects" ref={(el) => (sectionsRef.current[0] = el)} className="px-6 md:px-12">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle mt-4">If videos don't run properly, check <a href="https://drive.google.com/drive/folders/1TaLf8q9Gz4i3zLYe2cRDKxcKHCSwB22y?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline transition-colors">Google Drive for video files</a>.</p>
          <div className="relative">
            {/* Left Arrow */}
            <m.button
              onClick={scrollProjectsLeft}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 -translate-x-12 sm:-translate-x-16 rounded-full bg-black/80 backdrop-blur-md p-2 sm:p-3 text-white shadow-lg border border-white/20 hover:bg-black/90 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </m.button>

            {/* Right Arrow */}
            <m.button
              onClick={scrollProjectsRight}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 translate-x-12 sm:translate-x-16 rounded-full bg-black/80 backdrop-blur-md p-2 sm:p-3 text-white shadow-lg border border-white/20 hover:bg-black/90 transition-colors"
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </m.button>

            <div
              ref={projectsContainerRef}
              className="mt-10 flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {projects.map((project) => (
                <m.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  key={project.title}
                  onClick={(event) => {
                    triggerButtonClickAnimation(event);
                    // Prevent body scroll when modal opens
                    document.body.style.overflow = 'hidden';
                    setModalProject(project);
                  }}
                  className="glass-card group rounded-3xl p-6 text-left transition hover:shadow-neon cursor-pointer flex-shrink-0 w-[350px] sm:w-[300px] md:w-[350px] lg:w-[400px]"
                >
                  <div className="mb-5 rounded-2xl overflow-hidden bg-black transition group-hover:scale-[1.02] cursor-pointer h-0 pb-[56.25%] relative">
                    <div className="absolute inset-0">
                      <video
                        src={project.videoUrl}
                        poster={project.thumbnail}
                        className="w-full h-full object-contain"
                        controls
                        playsInline
                        preload="none"
                        onPlay={handleVideoPlay}
                      />
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{project.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{project.description}</p>
                  <p className="mt-4 text-xs text-violet-300">{project.software}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" ref={(el) => (sectionsRef.current[1] = el)} className="px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="section-title">About Me</h2>
              <div className="mt-4 space-y-4 text-white/70">
                <p>
                  Hey, I'm <span className="font-semibold text-cyan-300">Krish Bangade</span> — a video editor and motion designer from Nagpur, Maharashtra, currently pursuing my B.E. in Engineering (3rd year) at Suryodaya College of Engineering.
                </p>
                <p>
                  For the past 2 years, I've been obsessed with one thing — making videos that actually feel something. Whether it's a brand promo, a YouTube video, or a 30-second reel, I bring the same energy to every frame.
                </p>
                <p>
                  My primary tool is <span className="font-semibold text-violet-300">DaVinci Resolve</span> — I live in the Color page, tweak grades until they're just right, and use Fusion for motion work. I also work with Adobe After Effects for motion graphics, and Premiere Pro when the project calls for it.
                </p>
                <p>
                  I've worked on <span className="font-semibold text-cyan-300">20+ freelance projects</span> — from cinematic wedding highlights and YouTube channel edits to Instagram reels and commercial content — delivering clean, polished work that clients actually come back for.
                </p>
                <p className="italic text-white/80">
                  I'm not just an editor — I'm someone who understands storytelling, pacing, and visual language. If you've got a story to tell, I'll help you tell it right.
                </p>
              </div>
            </div>
            <div className="glass-card relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl" />
              <div className="relative h-full min-h-72 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
                <h3 className="text-xl font-semibold">My Journey</h3>
                <ul className="mt-6 space-y-4 text-sm text-white/75">
                  <li>🎓 Currently pursuing B.E. in Engineering (3rd year) at Suryodaya College of Engineering</li>
                  <li>🎬 2+ years obsessed with creating videos that evoke emotion</li>
                  <li>🛠️ Mastered DaVinci Resolve - Color page specialist & Fusion motion work</li>
                  <li>📹 Proficient in Adobe After Effects & Premiere Pro</li>
                  <li>🚀 20+ freelance projects completed successfully</li>
                  <li>💡 Specialized in storytelling, pacing, and visual language</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="services" ref={(el) => (sectionsRef.current[2] = el)} className="px-6 md:px-12">
          <h2 className="section-title">Services</h2>
          <p className="section-subtitle mt-4">Premium post-production crafted with agency-level polish and storytelling strategy.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <m.div
                key={service}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-5 text-white/85"
              >
                {service}
              </m.div>
            ))}
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[3] = el)} className="px-6 md:px-12">
          <h2 className="section-title">Editing Stack</h2>
          <div className="mt-8 grid gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className="glass-card rounded-2xl p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="text-cyan-300">{skill.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <m.div initial={{ width: 0 }} whileInView={{ width: `${skill.value}%` }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[4] = el)} className="px-6 md:px-12">
          <h2 className="section-title">Testimonials</h2>
          <div className="glass-card mt-8 overflow-hidden rounded-3xl py-6">
            <div className="flex w-max animate-marquee gap-4 px-4">
              {marqueeItems.map((item, i) => (
                <m.div
                  key={`${item}-${i}`}
                  whileHover={{ scale: 1.02 }}
                  className="min-w-[280px] rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80"
                >
                  {item}
                </m.div>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" ref={(el) => (sectionsRef.current[5] = el)} className="px-6 md:px-12">
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card relative overflow-hidden rounded-3xl p-8 md:p-12"
          >
            <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-gradient-to-r from-violet-500/40 to-purple-600/30 blur-3xl" />
            <div className="absolute -right-12 bottom-8 h-48 w-48 rounded-full bg-gradient-to-r from-cyan-400/35 to-blue-500/25 blur-3xl" />

            <div className="relative z-10">
              <m.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-4 text-center text-4xl font-bold tracking-wide md:mb-6 md:text-6xl"
              >
                Resume & CV
              </m.h2>
              <m.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-12 text-center text-white/70"
              >
                Explore my professional journey and creative expertise
              </m.p>

              <div className="grid gap-8 lg:grid-cols-2">
                <m.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative group"
                >
                  <m.div
                    animate={{
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="glass-card relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <m.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      >
                        <FileText className="h-8 w-8 text-white" />
                      </m.div>
                      <h3 className="mb-3 text-2xl font-semibold text-white">Professional Resume</h3>
                      <p className="mb-6 text-sm text-white/70 leading-relaxed">
                        Worked on over 20+ projects in cinematic video editing, motion graphics, and creative direction.
                        Collaborated with various brands and innovative startups.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-300">
                          Adobe Premiere Pro
                        </span>
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                          After Effects
                        </span>
                        <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                          Cinema 4D
                        </span>
                      </div>
                    </div>
                  </m.div>
                </m.div>

                <m.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col justify-center space-y-4"
                >
                  <m.a
                    href="/video_editor_resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 40px rgba(34, 211, 238, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={triggerButtonClickAnimation}
                    className="group flex items-center justify-between rounded-2xl border border-white/20 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 p-6 backdrop-blur-sm transition-all hover:border-cyan-400/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                        <Eye className="h-6 w-6 text-cyan-300" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">View Resume</p>
                        <p className="text-sm text-white/60">Preview in browser</p>
                      </div>
                    </div>
                    <m.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-cyan-300"
                    >
                      →
                    </m.div>
                  </m.a>

                  <m.a
                    href="/video_editor_resume.pdf"
                    download="video_editor_resume.pdf"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={triggerButtonClickAnimation}
                    className="group flex items-center justify-between rounded-2xl border border-white/20 bg-gradient-to-r from-violet-500/20 to-purple-500/10 p-6 backdrop-blur-sm transition-all hover:border-violet-400/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                        <Download className="h-6 w-6 text-violet-300" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">Download Resume</p>
                        <p className="text-sm text-white/60">PDF format • 2.4 MB</p>
                      </div>
                    </div>
                    <m.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-violet-300"
                    >
                      ↓
                    </m.div>
                  </m.a>
                </m.div>
              </div>
            </div>
          </m.div>
        </section>

        <section id="personal-info" ref={(el) => (sectionsRef.current[6] = el)} className="px-6 md:px-12">
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="mb-4 text-4xl font-bold tracking-wide md:text-6xl">Personal Information</h2>
              <p className="text-white/70">Connect with me across different platforms</p>
            </m.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Nagpur, Maharashtra, India",
                  color: "from-green-500 to-emerald-600",
                  delay: 0.1
                },
                {
                  icon: Briefcase,
                  label: "Profession",
                  value: "Video Editor & Motion Designer",
                  color: "from-blue-500 to-indigo-600",
                  delay: 0.2
                },
                {
                  icon: User,
                  label: "Instagram",
                  value: "@___krish___2708",
                  href: "https://www.instagram.com/___krish___2708?igsh=MXN4NzFxNXRhN2J4eQ==",
                  color: "from-pink-500 to-rose-600",
                  delay: 0.3
                },
                {
                  icon: Link,
                  label: "LinkedIn",
                  value: "linkedin.com/in/krish-bangade-b42a53338",
                  href: "https://www.linkedin.com/in/krish-bangade-b42a53338?utm_source=share_via&utm_content=profile&utm_medium=member_android",
                  color: "from-blue-600 to-cyan-600",
                  delay: 0.4
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 96996 39856",
                  href: "tel:+919699639856",
                  color: "from-violet-500 to-purple-600",
                  delay: 0.5
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "krishbangade@gmail.com",
                  href: "mailto:krishbangade@gmail.com",
                  color: "from-cyan-500 to-teal-600",
                  delay: 0.6
                }
              ].map((info, index) => (
                <m.a
                  key={index}
                  href={info.href}
                  target={info.label === "Phone" || info.label === "Email" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: info.delay }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-xl block"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative p-6">
                    <m.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${info.color}`}
                    >
                      <info.icon className="h-6 w-6 text-white" />
                    </m.div>
                    <p className="mb-2 text-xs uppercase tracking-wider text-white/50">{info.label}</p>
                    <p className="text-sm font-medium text-white/90">{info.value}</p>
                  </div>
                </m.a>
              ))}
            </div>
          </m.div>
        </section>

        <section id="contact" ref={(el) => (sectionsRef.current[7] = el)} className="px-6 md:px-12">
          <div className="glass-card relative overflow-hidden rounded-3xl p-8 md:p-12">
            <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="absolute -right-14 bottom-8 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
            <div className="relative min-h-[600px]">
              <m.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-4 text-center text-5xl font-bold tracking-wide md:mb-6 md:text-7xl"
              >
                Let's Work Together
              </m.h2>
              <m.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-8 text-center text-white/70 md:mb-10"
              >
                Ready to bring your vision to life? Let's create something extraordinary.
              </m.p>
              <form onSubmit={handleFormSubmit} className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <m.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-12 pr-3 py-3 outline-none transition-all focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      required
                    />
                  </m.div>
                  <m.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative"
                  >
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Email Address"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-12 pr-3 py-3 outline-none transition-all focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      required
                    />
                  </m.div>
                  <m.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative md:col-span-2"
                  >
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="Phone Number"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-12 pr-3 py-3 outline-none transition-all focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    />
                  </m.div>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative md:col-span-2"
                  >
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Tell me about your project..."
                      className="min-h-[120px] w-full rounded-xl border border-white/15 bg-white/5 p-3 outline-none transition-all focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      required
                    />
                  </m.div>
                </div>

                {submitStatus && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-4 mt-4 rounded-lg p-3 text-center text-sm font-medium ${submitStatus === "success"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                      }`}
                  >
                    {submitMessage}
                  </m.div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <m.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05, boxShadow: isSubmitting ? "none" : "0 0 30px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    className={`glow rounded-full px-8 py-3 text-sm font-semibold transition-all ${isSubmitting
                      ? "cursor-not-allowed bg-gradient-to-r from-gray-500 to-gray-600 text-white/50"
                      : "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </m.button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {clickBursts.map((burst) => (
            <m.span
              key={burst.id}
              initial={{ opacity: 0.75, scale: 0 }}
              animate={{ opacity: 0, scale: 1.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none fixed z-[70] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-cyan-300/20"
              style={{ left: burst.x, top: burst.y }}
            />
          ))}
          {modalProject ? (
            <m.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => {
                setModalProject(null);
                document.body.style.overflow = 'auto';
              }}
            >
              <m.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden bg-black"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setModalProject(null);
                    document.body.style.overflow = 'auto';
                  }}
                  className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 hover:bg-black/80 transition"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Video Container */}
                <div className="aspect-video w-full bg-black">
                  <video
                    src={modalProject.videoUrl}
                    poster={modalProject.thumbnail}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                    autoPlay
                    onPlay={handleVideoPlay}
                  />
                </div>

                {/* Project Info */}
                <div className="p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
                  <h3 className="text-2xl font-semibold text-white">{modalProject.title}</h3>
                  <p className="mt-1 text-cyan-300">{modalProject.category}</p>
                  <p className="mt-3 text-sm text-white/75">{modalProject.description}</p>
                  <p className="mt-2 text-xs text-violet-300">{modalProject.software}</p>
                </div>
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

