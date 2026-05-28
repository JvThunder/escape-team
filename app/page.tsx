import Link from "next/link";
import { MISSIONS, intensityLabel, intensityColor } from "@/data/missions";
import DownloadButton from "@/components/DownloadButton";

function IntensityDots({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full border transition-colors ${i < intensity
            ? "bg-current border-current opacity-80"
            : "bg-transparent border-gray-600 opacity-40"
            }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="mb-4">
            <span className="text-xs font-mono tracking-[0.3em] text-gray-500 uppercase border border-gray-700 px-3 py-1 rounded">
              Escape Team Digital Companion
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white mb-3 leading-none">
            Choose your<br />
            <span className="text-[#fb4f13]">Mission.</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The clock is ticking. Enter codes phase by phase, complete the mission before time runs out.
          </p>
        </header>

        {/* Mission 0 - separate centered row */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-full sm:max-w-xs">
            {MISSIONS.slice(0, 1).map((mission) => (
              <Link
                key={mission.id}
                href={`/mission/${mission.id}`}
                className="group relative block rounded-xl border border-gray-800 bg-gray-900/80 hover:border-[#fb4f13]/50 hover:bg-gray-900 transition-all duration-200 p-5 overflow-hidden"
              >
                {/* Subtle top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fb4f13]/0 to-transparent group-hover:via-[#fb4f13]/60 transition-all duration-300" />

                {/* Download button top right */}
                <div className="absolute top-4 right-4">
                  <DownloadButton missionId={mission.id} missionName={mission.name} />
                </div>

                {/* Mission number label */}
                <div className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-3">
                  {mission.missionNumber}
                </div>

                {/* Dashed divider */}
                <div className="border-t border-dashed border-gray-700/60 mb-3" />

                {/* Mission name */}
                <h2 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-[#fb4f13] transition-colors duration-150 mb-2 leading-tight">
                  {mission.name}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 h-10">
                  {mission.description}
                </p>

                {/* Dashed divider */}
                <div className="border-t border-dashed border-gray-700/60 mb-3" />

                {/* Stats row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{mission.duration}:00 <span className="text-gray-600">min.</span></span>
                  </div>

                  {/* Players */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>2–4</span>
                  </div>

                  {/* Intensity */}
                  <div className={`flex items-center gap-1.5 text-xs font-mono ${intensityColor(mission.intensity)}`}>
                    <IntensityDots intensity={mission.intensity} />
                    <span className="hidden sm:inline">{intensityLabel(mission.intensity)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Remaining missions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MISSIONS.slice(1).map((mission) => (
            <Link
              key={mission.id}
              href={`/mission/${mission.id}`}
              className="group relative block rounded-xl border border-gray-800 bg-gray-900/80 hover:border-[#fb4f13]/50 hover:bg-gray-900 transition-all duration-200 p-5 overflow-hidden"
            >
              {/* Subtle top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fb4f13]/0 to-transparent group-hover:via-[#fb4f13]/60 transition-all duration-300" />

              {/* Download button top right */}
              <div className="absolute top-4 right-4">
                <DownloadButton missionId={mission.id} missionName={mission.name} />
              </div>

              {/* Mission number label */}
              <div className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-3">
                {mission.missionNumber}
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed border-gray-700/60 mb-3" />

              {/* Mission name */}
              <h2 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-[#fb4f13] transition-colors duration-150 mb-2 leading-tight">
                {mission.name}
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4 h-10">
                {mission.description}
              </p>

              {/* Dashed divider */}
              <div className="border-t border-dashed border-gray-700/60 mb-3" />

              {/* Stats row */}
              <div className="flex items-center justify-between gap-3">
                {/* Duration */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{mission.duration}:00 <span className="text-gray-600">min.</span></span>
                </div>

                {/* Players */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>2–4</span>
                </div>

                {/* Intensity */}
                <div className={`flex items-center gap-1.5 text-xs font-mono ${intensityColor(mission.intensity)}`}>
                  <IntensityDots intensity={mission.intensity} />
                  <span className="hidden sm:inline">{intensityLabel(mission.intensity)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs font-mono text-gray-700 mt-10 tracking-widest uppercase">
          Escape Team: an escape room to play at home.
        </p>
      </div>
    </div>
  );
}
