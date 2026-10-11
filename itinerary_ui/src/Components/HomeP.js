import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllCss/Homep.css";
import { motion } from "framer-motion";
import CinematicIntro from "./CinematicIntro";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import { FiCpu, FiEdit3, FiArrowRight } from 'react-icons/fi';
import imgMysuru from './images/mysuru.png';
import imgCoorg from './images/coorg.png';
import './AllCss/Dashboard.css';

const destinations = [
  { name: "Bora Bora", badge: "Island", district: "French Polynesia", days: "5–7 days", variant: "gokarna", desc: "Crystal-clear waters and luxurious overwater bungalows." },
  { name: "Santorini", badge: "Coastal", district: "Greece", days: "3–5 days", variant: "gokarna", desc: "Iconic blue-domed churches and stunning sunset views over the Aegean Sea." },
  { name: "Maui", badge: "Nature", district: "Hawaii, USA", days: "5–7 days", variant: "coorg", desc: "Lush valleys, volcanic landscapes, and pristine beaches." },
  { name: "Kyoto", badge: "Culture", district: "Japan", days: "4–6 days", variant: "mysuru", desc: "Ancient temples, traditional tea houses, and beautiful cherry blossoms." },
  { name: "Banff", badge: "Nature", district: "Canada", days: "4–6 days", variant: "coorg", desc: "Turquoise glacial lakes and majestic mountain peaks." },
  { name: "The Maldives", badge: "Island", district: "Maldives", days: "5–7 days", variant: "gokarna", desc: "White sand beaches, vibrant coral reefs, and ultimate relaxation." },
  { name: "Amalfi Coast", badge: "Coastal", district: "Italy", days: "4–5 days", variant: "gokarna", desc: "Picturesque cliffside villages and sparkling Mediterranean waters." },
  { name: "Machu Picchu", badge: "Heritage", district: "Peru", days: "3–4 days", variant: "hampi", desc: "The legendary Incan citadel set high in the Andes Mountains." },
  { name: "Galapagos", badge: "Nature", district: "Ecuador", days: "5–8 days", variant: "coorg", desc: "Unmatched wildlife viewing and unique volcanic landscapes." },
  { name: "Reykjavik", badge: "Nature", district: "Iceland", days: "3–5 days", variant: "coorg", desc: "Geothermal spas, stunning northern lights, and vibrant culture." },
];

function HomeP() {
  const navigate = useNavigate();
  const [navState, setNavState] = useState("transparent");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      
      if (scrollY < vh * 5.8) {
        setNavState("transparent");
      } else if (scrollY >= vh * 5.8 && scrollY < vh * 6.5) {
        setNavState("glass");
      } else {
        setNavState("solid");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`payana-nav-new ${navState}`}>
        <div className="payana-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Payana.</div>
        <div className="payana-nav-center">
          <span className="payana-nav-item" onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}>Destinations</span>
          <span className="payana-nav-item" onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}>Experiences</span>
        </div>
        <div className="payana-nav-links">
          <button className="nav-btn-ghost" onClick={() => navigate("/Login")}>Sign In</button>
          <button className="nav-btn-primary" onClick={() => navigate("/Login")}>Plan My Trip</button>
        </div>
      </nav>

      <div className="payana-landing">
        <CinematicIntro />
        <HeroSection />

        <div className="payana-content" id="destinations" style={{ background: '#0a1628', position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '80px' }}>
          
          {/* ── ACTION CARDS ── */}
          <section className="payana-destinations" style={{ marginBottom: '60px' }}>
            <div className="destinations-header">
              <span className="destinations-label">Start Your Journey</span>
              <h2 className="destinations-title">Plan your next <span className="italic-gold">adventure</span></h2>
            </div>
            <div className="pdash__actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
              
              {/* AI Trip Planner Card */}
              <motion.div
                className="pdash__action-card"
                onClick={() => navigate("/Login")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="pdash__card-photo" style={{ backgroundImage: `url(${imgMysuru})` }} />
                <div className="pdash__card-fade" />
                <div className="pdash__card-content">
                  <div className="pdash__card-icon"><FiCpu /></div>
                  <h3 className="pdash__card-title">AI Trip Planner</h3>
                  <p className="pdash__card-desc">Tell us your mood and preferences. Our AI builds a personalized Karnataka itinerary in seconds.</p>
                  <div className="pdash__card-cta">
                    Start Planning <FiArrowRight className="pdash__card-arrow" />
                  </div>
                </div>
              </motion.div>

              {/* Manual Itinerary Card */}
              <motion.div
                className="pdash__action-card"
                onClick={() => navigate("/Login")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="pdash__card-photo" style={{ backgroundImage: `url(${imgCoorg})` }} />
                <div className="pdash__card-fade" />
                <div className="pdash__card-content">
                  <div className="pdash__card-icon"><FiEdit3 /></div>
                  <h3 className="pdash__card-title">Manual Itinerary</h3>
                  <p className="pdash__card-desc">Pick your districts, days, and destinations. Full control over your Karnataka journey.</p>
                  <div className="pdash__card-cta">
                    Build Manually <FiArrowRight className="pdash__card-arrow" />
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* ── DESTINATION CARDS ── */}
          <section className="payana-destinations">
            <div className="destinations-header">
              <span className="destinations-label">Explore the World</span>
              <h2 className="destinations-title">Curated for every kind of <span className="italic-gold">traveller</span></h2>
            </div>
            
            <div className="payana-cards-row">
              {destinations.map((dest, i) => (
                <motion.div
                  className="payana-card"
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className={`payana-card__image payana-card__image--${dest.variant}`}>
                    <span className="payana-card__badge">{dest.badge}</span>
                  </div>
                  <div className="payana-card__body">
                    <h3 className="payana-card__name">{dest.name}</h3>
                    <p className="payana-card__meta">
                      {dest.district} · {dest.days}
                    </p>
                    <p className="payana-card__desc">
                      {dest.desc}
                    </p>
                    <div className="payana-card__cta-wrap">
                      <span className="payana-card__cta">Plan this trip →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── STATS ── */}
          <motion.section
            id="features"
            className="payana-stats"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="payana-stat">
              <div className="payana-stat__value">31</div>
              <div className="payana-stat__label">Districts covered</div>
              <div className="payana-stat__subtitle">Across Karnataka</div>
            </div>
            <div className="payana-stat">
              <div className="payana-stat__value">AI</div>
              <div className="payana-stat__label">Mood-based planning</div>
              <div className="payana-stat__subtitle">Powered by Claude</div>
            </div>
            <div className="payana-stat">
              <div className="payana-stat__value">∞</div>
              <div className="payana-stat__label">Routes possible</div>
              <div className="payana-stat__subtitle">No two trips alike</div>
            </div>
          </motion.section>
        </div>

        {/* ── FOOTER (Sibling to content) ── */}
        <Footer />
      </div>
    </>
  );
}

export default HomeP;