"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEPARTMENTS } from "@/data/mock";
import type { Department } from "@/types";
import { cn } from "@/lib/utils";

interface IsometricOfficeProps {
  onDepartmentClick: (dept: Department) => void;
  selectedDepartment: string | null;
}

interface BuildingProps {
  dept: Department;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}

function IsometricBuilding({ dept, isSelected, isHovered, onClick, onHover }: BuildingProps) {
  const { position, color } = dept;
  const statusColors: Record<string, string> = {
    normal: "#10b981",
    warning: "#f59e0b",
    critical: "#ef4444",
  };
  const statusColor = statusColors[dept.status];

  const scale = isSelected ? 1.08 : isHovered ? 1.04 : 1;
  const brightness = isSelected ? 1.2 : isHovered ? 1.1 : 1;

  return (
    <motion.g
      transform={`translate(${position.x}, ${position.y})`}
      style={{ cursor: "pointer" }}
      animate={{ scale, filter: `brightness(${brightness})` }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={() => onHover(dept.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Shadow */}
      <ellipse cx="40" cy="75" rx="38" ry="10" fill="rgba(0,0,0,0.4)" />

      {/* Building base - isometric left face */}
      <polygon
        points="0,50 40,70 40,90 0,70"
        fill={`${color}33`}
        stroke={color}
        strokeWidth={isSelected ? "1.5" : "0.8"}
        strokeOpacity={0.6}
      />
      {/* Building base - isometric right face */}
      <polygon
        points="40,70 80,50 80,70 40,90"
        fill={`${color}22`}
        stroke={color}
        strokeWidth={isSelected ? "1.5" : "0.8"}
        strokeOpacity={0.4}
      />
      {/* Building top face */}
      <polygon
        points="0,50 40,30 80,50 40,70"
        fill={`${color}55`}
        stroke={color}
        strokeWidth={isSelected ? "1.5" : "0.8"}
        strokeOpacity={0.8}
      />

      {/* Building body upper */}
      <polygon
        points="10,15 40,0 70,15 70,50 40,65 10,50"
        fill={`${color}33`}
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity={0.3}
      />

      {/* Windows - left side */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`win-l-${i}`}
          x={8 + i * 14}
          y={35}
          width={8}
          height={6}
          rx={1}
          fill={isSelected || isHovered ? "#60a5fa" : "#1e3a5f"}
          stroke="#3b82f6"
          strokeWidth={0.5}
          strokeOpacity={0.5}
          opacity={isSelected ? 1 : 0.7}
        />
      ))}

      {/* Glow effect when selected */}
      {isSelected && (
        <polygon
          points="0,50 40,30 80,50 40,70"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeOpacity={0.4}
          filter="url(#glow)"
        />
      )}

      {/* Status indicator */}
      <circle cx="40" cy="0" r="5" fill={statusColor} opacity={0.9} />
      <circle cx="40" cy="0" r="5" fill={statusColor} opacity={0.4}>
        <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Department icon */}
      <text x="40" y="48" textAnchor="middle" fontSize="16" dominantBaseline="middle">
        {dept.icon}
      </text>

      {/* Department label */}
      <text
        x="40"
        y="82"
        textAnchor="middle"
        fontSize="8"
        fill={isSelected ? color : "#9ca3af"}
        fontWeight={isSelected ? "700" : "500"}
        fontFamily="system-ui, sans-serif"
      >
        {dept.shortName}
      </text>

      {/* Headcount badge */}
      {dept.headcount > 0 && (
        <>
          <rect x="54" y="-8" width="20" height="10" rx="5" fill={color} opacity={0.9} />
          <text x="64" y="-2" textAnchor="middle" fontSize="6" fill="white" fontWeight="700">
            {dept.headcount}
          </text>
        </>
      )}
    </motion.g>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    cx: 80 + Math.random() * 560,
    cy: 40 + Math.random() * 400,
    r: 1 + Math.random() * 2,
    dur: 3 + Math.random() * 5,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#3b82f6" opacity={0.3}>
          <animate
            attributeName="opacity"
            values={`0.1;0.5;0.1`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${p.cy};${p.cy - 20};${p.cy}`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  );
}

function ConnectionLines({ departments }: { departments: Department[] }) {
  const connections = [
    ["noc", "dco"],
    ["dco", "pm"],
    ["dco", "cm"],
    ["pm", "eng"],
    ["cm", "eng"],
    ["eng", "inv"],
    ["exec", "noc"],
    ["ai", "noc"],
    ["ai", "exec"],
  ];

  return (
    <>
      {connections.map(([from, to]) => {
        const a = departments.find((d) => d.id === from);
        const b = departments.find((d) => d.id === to);
        if (!a || !b) return null;

        const x1 = a.position.x + 40;
        const y1 = a.position.y + 35;
        const x2 = b.position.x + 40;
        const y2 = b.position.y + 35;

        return (
          <g key={`${from}-${to}`}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(59,130,246,0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle r="2" fill="#3b82f6" opacity="0.6">
              <animateMotion dur="4s" repeatCount="indefinite">
                <mpath xlinkHref={`#path-${from}-${to}`} />
              </animateMotion>
            </circle>
            <path
              id={`path-${from}-${to}`}
              d={`M${x1},${y1} L${x2},${y2}`}
              fill="none"
            />
          </g>
        );
      })}
    </>
  );
}

export function IsometricOffice({ onDepartmentClick, selectedDepartment }: IsometricOfficeProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden rounded-xl border border-white/10">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/80" />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div>
          <h2 className="text-sm font-semibold text-white">AI Data Center Virtual Office</h2>
          <p className="text-xs text-gray-500">{time.toLocaleTimeString()} — Digital Twin View</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">LIVE</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 z-10">
        {[
          { color: "#10b981", label: "Normal" },
          { color: "#f59e0b", label: "Warning" },
          { color: "#ef4444", label: "Critical" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Office Map */}
      <svg
        viewBox="0 0 700 500"
        className="w-full h-full"
        style={{ minHeight: 400 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect width="700" height="500" fill="url(#bgGrad)" />

        {/* Grid floor */}
        <g opacity={0.3}>
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1="50" y1={60 + i * 55}
              x2="650" y2={60 + i * 55}
              stroke="#1e3a5f"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={50 + i * 50} y1="60"
              x2={50 + i * 50} y2="480"
              stroke="#1e3a5f"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Animated particles */}
        <FloatingParticles />

        {/* Connection lines */}
        <ConnectionLines departments={DEPARTMENTS} />

        {/* Floor platform */}
        <polygon
          points="60,460 350,410 640,460 350,510"
          fill="rgba(30,58,95,0.2)"
          stroke="rgba(59,130,246,0.15)"
          strokeWidth="1"
        />

        {/* Department buildings */}
        {DEPARTMENTS.map((dept) => (
          <IsometricBuilding
            key={dept.id}
            dept={dept}
            isSelected={selectedDepartment === dept.id}
            isHovered={hoveredDept === dept.id}
            onClick={() => onDepartmentClick(dept)}
            onHover={setHoveredDept}
          />
        ))}

        {/* Floating mini characters */}
        {[
          { x: 200, y: 350, color: "#60a5fa" },
          { x: 380, y: 290, color: "#34d399" },
          { x: 500, y: 370, color: "#a78bfa" },
        ].map((char, i) => (
          <g key={i} transform={`translate(${char.x}, ${char.y})`}>
            <circle r="6" fill={char.color} opacity={0.8} />
            <circle r="4" fill={char.color} cy="-10" opacity={0.9} />
            <line x1="0" y1="-4" x2="-6" y2="4" stroke={char.color} strokeWidth="1.5" opacity={0.7} />
            <line x1="0" y1="-4" x2="6" y2="4" stroke={char.color} strokeWidth="1.5" opacity={0.7} />
            <animate attributeName="transform" attributeType="XML"
              type="translate"
              values={`${char.x},${char.y};${char.x},${char.y - 8};${char.x},${char.y}`}
              dur={`${2.5 + i * 0.7}s`}
              repeatCount="indefinite"
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDept && !selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-white/10 rounded-lg px-4 py-2.5 pointer-events-none z-20"
          >
            {(() => {
              const dept = DEPARTMENTS.find((d) => d.id === hoveredDept);
              if (!dept) return null;
              return (
                <div className="text-center">
                  <p className="text-sm font-medium text-white">{dept.name}</p>
                  <p className="text-xs text-gray-400">{dept.description}</p>
                  <p className="text-xs text-blue-400 mt-1">Click to view details</p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
