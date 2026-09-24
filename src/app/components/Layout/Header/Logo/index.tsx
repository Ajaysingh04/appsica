"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

const Logo: React.FC<HeaderProps> = ({ className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [shadow, setShadow] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 16;
    const shadowX = -rotateY * 1.2;
    const shadowY = rotateX * 1.2 + 8;

    setTransform(
      `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) scale3d(1.04, 1.04, 1.04)`
    );
    setShadow(
      `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 20px rgba(0, 82, 204, 0.22), 0 3px 8px rgba(255, 91, 0, 0.18)`
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)");
    setShadow("0 4px 14px rgba(0, 82, 204, 0.10), 0 2px 6px rgba(255, 91, 0, 0.08)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <Link href="/" className={`inline-block group focus:outline-none ${className}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transform || "perspective(700px) rotateY(-2deg) rotateX(1deg)",
          boxShadow: shadow || "0 4px 14px rgba(0, 82, 204, 0.10), 0 2px 6px rgba(255, 91, 0, 0.08)",
          transition: transform
            ? "transform 0.1s ease-out, box-shadow 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease",
        }}
        className="relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md cursor-pointer select-none overflow-hidden transition-all duration-300"
      >
        {/* Dynamic 3D Glare effect */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-2xl z-20"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)`,
            opacity: glare.opacity,
          }}
        />

        {/* Ambient 3D Shimmer stripe */}
        <div className="logo-3d-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full z-10" />

        {/* 3D Elevated Logo Image */}
        <div
          className="relative z-10 flex items-center"
          style={{
            transform: "translateZ(12px)",
            filter: "drop-shadow(0 2px 5px rgba(11, 27, 61, 0.18))",
          }}
        >
          <Image
            src="/images/logo/logo.png"
            alt="Appsica Technologies"
            width={180}
            height={50}
            quality={100}
            priority
            style={{ width: "auto", height: "36px" }}
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
