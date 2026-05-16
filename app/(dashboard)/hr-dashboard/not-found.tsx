"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HrNotFound() {
  const starsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (starsRef.current) {
      for (let i = 0; i < 60; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2.5 + 0.5;
        star.style.cssText = `
          position:absolute;
          width:${size}px;height:${size}px;
          top:${Math.random() * 100}%;left:${Math.random() * 100}%;
          background:#fff;border-radius:50%;
          animation:twinkle ${(Math.random() * 3 + 1.5).toFixed(1)}s ease-in-out infinite alternate;
          animation-delay:${(Math.random() * 4).toFixed(1)}s;
        `;
        starsRef.current.appendChild(star);
      }
    }
    if (dotsRef.current) {
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement("div");
        dot.style.cssText = `
          position:absolute;
          width:4px;height:4px;border-radius:50%;
          background:rgba(167,139,250,0.6);
          top:${Math.random() * 100}%;left:${Math.random() * 100}%;
          animation:floatDot ${(Math.random() * 3 + 2).toFixed(1)}s ease-in-out infinite;
          animation-delay:${(Math.random() * 3).toFixed(1)}s;
        `;
        dotsRef.current.appendChild(dot);
      }
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Syne:wght@800&display=swap');

        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(0.8); }
          to   { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes drift {
          from { transform: translate(0, 0); }
          to   { transform: translate(30px, 20px); }
        }
        @keyframes floatPlanet {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes pulseNum {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(0.97); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); opacity: 0.6; }
          50%      { transform: translateY(-20px); opacity: 1; }
        }

        .nf-planet {
          animation: floatPlanet 4s ease-in-out infinite;
        }
        .nf-num {
          animation: pulseNum 3s ease-in-out infinite;
        }
        .nf-orb1 {
          animation: drift 8s ease-in-out infinite alternate;
        }
        .nf-orb2 {
          animation: drift 8s ease-in-out infinite alternate;
          animation-delay: -4s;
        }
        .nf-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 12px 40px rgba(124,58,237,0.5);
        }
        .nf-btn:hover .nf-arrow {
          transform: translateX(-3px);
        }
        .nf-arrow {
          display: inline-block;
          transition: transform 0.2s;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          overflow: "hidden",
          position: "relative",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Stars */}
        <div
          ref={starsRef}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}
        />

        {/* Floating dots */}
        <div
          ref={dotsRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Glow orbs */}
        <div
          className="nf-orb1"
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(99,60,255,0.25)",
            filter: "blur(60px)",
            top: -80,
            left: -80,
          }}
        />
        <div
          className="nf-orb2"
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,60,140,0.2)",
            filter: "blur(60px)",
            bottom: -60,
            right: -60,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "2rem",
          }}
        >
          {/* 404 with planet */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              className="nf-num"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(80px, 18vw, 140px)",
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(135deg,#a78bfa,#f472b6,#fb923c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              4
            </span>

            {/* Planet */}
            <div
              className="nf-planet"
              style={{
                width: "clamp(60px, 12vw, 100px)",
                height: "clamp(60px, 12vw, 100px)",
                background:
                  "radial-gradient(circle at 35% 35%, #6366f1, #312e81)",
                borderRadius: "50%",
                position: "relative",
                boxShadow: "0 0 30px rgba(99,102,241,0.5)",
                flexShrink: 0,
              }}
            >
              {/* Ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "50%",
                  border: "3px solid rgba(167,139,250,0.4)",
                  borderTopColor: "rgba(167,139,250,0.8)",
                  transform: "rotate(-20deg)",
                }}
              />
              {/* Shine */}
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "20%",
                  width: "60%",
                  height: "20%",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                }}
              />
            </div>

            <span
              className="nf-num"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(80px, 18vw, 140px)",
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(135deg,#a78bfa,#f472b6,#fb923c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animationDelay: "0.3s",
              }}
            >
              4
            </span>
          </div>

          <p
            style={{
              fontSize: "clamp(11px, 2.5vw, 13px)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            Houston, we have a problem
          </p>

          <p
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 700,
              marginBottom: "2rem",
            }}
          >
            This page drifted into deep space
          </p>

          <Link
            href="/admin-dashboard"
            className="nf-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 32px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span className="nf-arrow">&#8592;</span> Return Dashboard Home
          </Link>
        </div>
      </div>
    </>
  );
}
