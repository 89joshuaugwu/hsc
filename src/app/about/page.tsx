"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import {
  Cross,
  BookOpen,
  Heart,
  Music,
  HandHelping,
  Flame,
} from "lucide-react";

interface ChapelInfo {
  chapelName: string;
  tagline: string;
  heroImageUrl: string;
  aboutContent: string;
  missionStatement: string;
  visionStatement: string;
  scriptureVerse: string;
  scriptureReference: string;
}

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

const BELIEFS = [
  { icon: Cross, title: "Faith in Christ", desc: "Jesus Christ is the cornerstone of our faith and the foundation upon which we build our lives." },
  { icon: BookOpen, title: "Biblical Foundation", desc: "We uphold the Holy Scriptures as the inspired, authoritative, and infallible Word of God." },
  { icon: HandHelping, title: "Community Service", desc: "We are called to serve one another and our community with love, compassion, and generosity." },
  { icon: Music, title: "Worship", desc: "We worship God in spirit and in truth through music, prayer, and the sacraments of the Church." },
  { icon: Flame, title: "Prayer", desc: "Prayer is the lifeline of our fellowship — we believe in the power of corporate and personal prayer." },
  { icon: Heart, title: "Outreach", desc: "We share the gospel and extend God's love beyond our walls through missions and evangelism." },
];

export default function AboutPage() {
  const [info, setInfo] = useState<ChapelInfo | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  const heroRef = useRef(null);
  const historyRef = useRef(null);
  const beliefsRef = useRef(null);
  const missionRef = useRef(null);
  const asfRef = useRef(null);
  const leaderRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const historyInView = useInView(historyRef, { once: true, margin: "-100px" });
  const beliefsInView = useInView(beliefsRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const asfInView = useInView(asfRef, { once: true, margin: "-100px" });
  const leaderInView = useInView(leaderRef, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, "chapel_info", "main"));
        if (snap.exists()) setInfo(snap.data() as ChapelInfo);

        const lq = query(collection(db, "leadership"), where("isActive", "==", true), orderBy("order", "asc"));
        const lSnap = await getDocs(lq);
        setLeaders(lSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Leader));
      } catch (err) {
        console.error("About fetch error:", err);
      }
    }
    fetch();
  }, []);

  return (
    <>
      {/* ── SECTION 1: Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      >
        {info?.heroImageUrl ? (
          <Image src={info.heroImageUrl} alt="Chapel" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-500 via-chapel-400 to-navy-700" />
        )}
        <div className="absolute inset-0 bg-navy-700/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-gold-500 uppercase mb-4">
            Holy Spirit Chapel · ESUT Agbani
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">
            Our Story
          </h1>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-6 rounded-full" />
        </motion.div>
      </section>

      {/* ── SECTION 2: Foundation of Faith ── */}
      <section ref={historyRef} className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            animate={historyInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start"
          >
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-4">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy-500">
                Foundation of Faith
              </h2>
              <div className="font-body text-base text-text-muted leading-relaxed space-y-4">
                <p>
                  {info?.aboutContent ||
                    "Holy Spirit Chapel stands as a beacon of faith and community at the Enugu State University of Technology, Agbani. For decades, this sacred space has been nurturing young minds in the Anglican tradition, fostering spiritual growth, academic excellence, and a deep sense of fellowship among students and staff alike."}
                </p>
                <p>
                  Our chapel serves as a spiritual home for hundreds of students, providing a welcoming environment where faith meets knowledge, and tradition meets the energy of youth. Through worship, study, and service, we continue to shape leaders who carry the light of Christ into every sphere of life.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div className="bg-ivory rounded-2xl p-6 md:p-8 border border-border/60">
                <p className="font-display text-xl md:text-2xl font-bold text-gold-600 mb-4">
                  DOMINUS REGNANT
                </p>
                <blockquote className="font-quote text-lg italic text-navy-500/80 leading-relaxed border-l-4 border-gold-500 pl-4">
                  {info?.visionStatement ||
                    "To raise a generation of Spirit-filled Anglicans who will be the light of the world and the salt of the earth."}
                </blockquote>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: Core Beliefs ── */}
      <section ref={beliefsRef} className="py-16 md:py-20 bg-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate={beliefsInView ? "visible" : "hidden"}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-navy-500">
                What We Believe
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BELIEFS.map((b) => {
                const Icon = b.icon;
                return (
                  <motion.div key={b.title} variants={fadeUp}>
                    <div className="bg-white rounded-xl p-6 border border-border/60 h-full hover:shadow-chapel transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-chapel-400/10 flex items-center justify-center mb-4">
                        <Icon size={24} className="text-chapel-400" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-navy-500 mb-2">
                        {b.title}
                      </h3>
                      <p className="font-body text-sm text-text-muted leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: Mission & Vision ── */}
      <section ref={missionRef} className="py-16 md:py-20 bg-navy-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-gold-500 uppercase">
                Our Mission
              </span>
              <p className="font-quote text-xl md:text-2xl italic text-white/90 leading-relaxed">
                {info?.missionStatement ||
                  "To foster spiritual growth, academic excellence, and community service among students of ESUT Agbani through the Anglican tradition of worship, fellowship, and discipleship."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4 md:border-l md:border-gold-500/30 md:pl-12">
              <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-gold-500 uppercase">
                Our Vision
              </span>
              <p className="font-quote text-xl md:text-2xl italic text-white/90 leading-relaxed">
                {info?.visionStatement ||
                  "To raise a generation of Spirit-filled Anglicans who will be the light of the world and the salt of the earth, impacting their communities and beyond."}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: Fellowship Identity ── */}
      <section ref={asfRef} className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            animate={asfInView ? "visible" : "hidden"}
            className="text-center space-y-6"
          >
            <motion.div variants={fadeUp} className="inline-block bg-red-50 rounded-2xl p-6">
              <Image src="/flogo.png" alt="ASF Logo" width={120} height={120} className="mx-auto" />
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-500">
                Anglican Students&apos; Fellowship
              </h2>
              <p className="font-display text-sm font-semibold text-red-600 tracking-[0.2em] uppercase mt-2">
                Arise, Shine
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="font-body text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
                The Anglican Students&apos; Fellowship (ASF) is the backbone of our chapel community.
                As the fellowship arm of the chapel, ASF organizes Bible studies, prayer meetings,
                outreach programs, and social events that bring students together in faith and friendship.
                Every Anglican student at ESUT Agbani is welcomed into this vibrant community.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 6: Meet Leadership ── */}
      {leaders.length > 0 && (
        <section ref={leaderRef} className="py-16 md:py-20 bg-ivory-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              animate={leaderInView ? "visible" : "hidden"}
              className="space-y-10"
            >
              <motion.div variants={fadeUp} className="text-center">
                <h2 className="font-heading text-2xl md:text-4xl font-bold text-navy-500">
                  Meet Our Leadership
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaders.map((leader) => (
                  <motion.div key={leader.id} variants={fadeUp}>
                    <div className="bg-white rounded-xl p-6 text-center border border-border/60 hover:shadow-chapel transition-shadow">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-ivory-dark mb-4">
                        {leader.photoUrl ? (
                          <Image
                            src={leader.photoUrl}
                            alt={leader.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-chapel-400/10">
                            <span className="font-display text-xl font-bold text-chapel-400">
                              {leader.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="inline-block px-3 py-0.5 bg-gold-500/10 text-gold-600 font-body text-[0.65rem] font-bold rounded-full uppercase tracking-wider mb-2">
                        {leader.role}
                      </span>
                      <h3 className="font-heading text-base font-bold text-navy-500">
                        {leader.name}
                      </h3>
                      {leader.bio && (
                        <p className="font-body text-xs text-text-muted mt-2 line-clamp-3">
                          {leader.bio}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
