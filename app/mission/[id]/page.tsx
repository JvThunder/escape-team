"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MISSIONS } from "@/data/missions";

type PhaseRecord = {
  phase: number;
  elapsed: number;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function WrongAttemptIcons({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${i < count
              ? "bg-red-500/20 text-red-400 border border-red-500/60"
              : "bg-gray-800 text-gray-700 border border-gray-700"
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function CodeInput({
  value,
  onChange,
  onSubmit,
  disabled,
  shake,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  shake: boolean;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d*$/.test(char)) return;
    const newVal = value.split("");
    newVal[idx] = char.slice(-1);
    const joined = newVal.join("").padEnd(5, " ").slice(0, 5);
    onChange(joined.trimEnd());
    if (char && idx < 4) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0) {
        const newVal = value.split("");
        newVal[idx - 1] = "";
        onChange(newVal.join("").trimEnd());
        inputs.current[idx - 1]?.focus();
      } else {
        const newVal = value.split("");
        newVal[idx] = "";
        onChange(newVal.join("").trimEnd());
      }
    } else if (e.key === "Enter") {
      onSubmit();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 4) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (text) {
      onChange(text);
      inputs.current[Math.min(text.length, 4)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className={`flex gap-2 sm:gap-3 justify-center ${shake ? "animate-shake" : ""}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono font-bold rounded-lg border-2 bg-gray-900 text-amber-300 border-gray-600 focus:border-amber-400 focus:outline-none focus:ring-0 disabled:opacity-40 disabled:cursor-not-allowed caret-transparent transition-colors"
        />
      ))}
    </div>
  );
}

export default function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mission = MISSIONS.find((m) => m.id === Number(id));

  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseStart, setPhaseStart] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [code, setCode] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [phaseHistory, setPhaseHistory] = useState<PhaseRecord[]>([]);
  const [shake, setShake] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400 font-mono">
        Mission not found.
      </div>
    );
  }

  const phase = mission.phases[currentPhase];

  const handleStart = () => {
    setStarted(true);
    setElapsed(0);
    setPhaseStart(0);
    startTimer();
  };

  const handleSubmit = () => {
    if (!started || completed) return;
    if (code.length !== 5) return;

    if (code === phase.code) {
      const phaseElapsed = elapsed - phaseStart;
      const newHistory = [...phaseHistory, { phase: currentPhase + 1, elapsed: phaseElapsed }];
      setPhaseHistory(newHistory);
      setFlash("success");
      setTimeout(() => setFlash(null), 600);
      setCode("");

      if (currentPhase + 1 >= mission.phases.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCompleted(true);
      } else {
        setCurrentPhase((p) => p + 1);
        setPhaseStart(elapsed);
        setHintsRevealed(0);
      }
    } else {
      setWrongAttempts((w) => w + 1);
      setShake(true);
      setFlash("error");
      setTimeout(() => {
        setShake(false);
        setFlash(null);
      }, 600);
      setCode("");
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setElapsed(0);
    setPhaseStart(0);
    setCurrentPhase(0);
    setCode("");
    setWrongAttempts(0);
    setPhaseHistory([]);
    setCompleted(false);
    setFlash(null);
    setHintsRevealed(0);
  };

  const handleRevealHint = () => {
    if (phase && hintsRevealed < phase.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const totalWrongAttempts = wrongAttempts;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Flash overlay */}
      {flash && (
        <div
          className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${flash === "success" ? "bg-green-500/10" : "bg-red-500/10"
            }`}
        />
      )}

      {/* Top bar */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-amber-400 transition-colors text-sm font-mono"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">MISSIONS</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 tracking-widest hidden sm:inline">
              MISSION {String(mission.id).padStart(2, "0")}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
            <span className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-none">
              {mission.name}
            </span>
          </div>

          {/* Timer */}
          <div
            className={`font-mono text-2xl sm:text-3xl font-bold tabular-nums tracking-widest ${completed ? "text-green-400" : started ? "text-amber-300" : "text-gray-600"
              }`}
          >
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-6 flex-1">

        {/* Mission info */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-gray-400 text-sm leading-relaxed">{mission.description}</p>
        </div>

        {!completed ? (
          <>
            {/* Phase progress */}
            <div className="flex items-center gap-2 flex-wrap">
              {mission.phases.map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-lg font-mono font-bold text-sm w-10 h-10 border-2 transition-all duration-300 ${i < currentPhase
                      ? "bg-green-500/20 border-green-500/60 text-green-400"
                      : i === currentPhase
                        ? "bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                        : "bg-gray-900 border-gray-700 text-gray-600"
                    }`}
                >
                  {i < currentPhase ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              ))}
              <span className="text-xs font-mono text-gray-500 ml-1">
                {currentPhase < mission.phases.length
                  ? `PHASE ${currentPhase + 1} / ${mission.phases.length}`
                  : "COMPLETE"}
              </span>
            </div>

            {/* Current phase card */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-mono text-gray-500 tracking-widest mb-1">CURRENT PHASE</div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                    {currentPhase + 1}
                    <span className="text-gray-600 text-lg"> / {mission.phases.length}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-500 tracking-widest mb-1">PHASE TIME</div>
                  <div className="text-xl font-mono font-bold text-gray-300 tabular-nums">
                    {started ? formatTime(elapsed - phaseStart) : "00:00"}
                  </div>
                </div>
              </div>

              {/* Wrong attempts */}
              <div className="mb-5">
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-2">WRONG ATTEMPTS</div>
                <WrongAttemptIcons count={wrongAttempts} />
              </div>

              {/* Hints section */}
              {phase.hints.length > 0 && (
                <div className="mb-5 border-t border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-mono text-gray-500 tracking-widest">HINTS</div>
                    <span className="text-xs font-mono text-gray-600">
                      {hintsRevealed} / {phase.hints.length}
                    </span>
                  </div>
                  {hintsRevealed > 0 && (
                    <div className="space-y-2 mb-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/40">
                      {Array.from({ length: hintsRevealed }).map((_, i) => (
                        <div key={i} className="text-sm text-gray-300 leading-relaxed">
                          <span className="text-amber-400 font-mono text-xs mr-2">
                            Hint {i + 1}:
                          </span>
                          {phase.hints[i]}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleRevealHint}
                    disabled={!started || hintsRevealed >= phase.hints.length}
                    className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-amber-300 text-xs font-mono font-bold tracking-widest transition-colors"
                  >
                    {hintsRevealed >= phase.hints.length ? "ALL HINTS REVEALED" : "REVEAL NEXT HINT"}
                  </button>
                </div>
              )}

              {/* Code input */}
              <div className="mb-4">
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-3 text-center">
                  ENTER 5-DIGIT CODE
                </div>
                <CodeInput
                  value={code}
                  onChange={setCode}
                  onSubmit={handleSubmit}
                  disabled={!started}
                  shake={shake}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                {!started ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm tracking-widest font-mono transition-colors"
                  >
                    START MISSION
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={code.length !== 5}
                      className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-gray-950 font-bold text-sm tracking-widest font-mono transition-colors"
                    >
                      SUBMIT CODE
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 rounded-lg border border-gray-700 hover:border-red-500/60 hover:text-red-400 text-gray-400 text-sm font-mono transition-colors"
                    >
                      RESET
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Completed state */
          <div className="rounded-xl border border-green-500/40 bg-green-500/5 p-6 text-center">
            <div className="text-4xl mb-3">🔓</div>
            <div className="text-2xl font-bold text-green-400 font-mono tracking-widest mb-1">
              MISSION COMPLETE
            </div>
            <div className="text-gray-400 text-sm mb-4">
              All {mission.phases.length} phases cleared
            </div>
            <div className="text-4xl font-mono font-bold text-amber-300 tabular-nums mb-2">
              {formatTime(elapsed)}
            </div>
            <div className="text-xs font-mono text-gray-500 mb-6">TOTAL TIME</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm tracking-widest font-mono transition-colors"
              >
                RETRY
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 rounded-lg border border-gray-700 hover:border-amber-500/60 hover:text-amber-400 text-gray-400 text-sm font-mono transition-colors"
              >
                MISSIONS
              </button>
            </div>
          </div>
        )}

        {/* Phase history */}
        {phaseHistory.length > 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 sm:p-5">
            <div className="text-xs font-mono text-gray-500 tracking-widest mb-3">PHASE LOG</div>
            <div className="space-y-2">
              {phaseHistory.map((record) => (
                <div
                  key={record.phase}
                  className="flex items-center justify-between rounded-lg bg-gray-800/60 border border-gray-700/60 px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20 border border-green-500/50">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-mono text-sm text-gray-300">
                      Phase {record.phase}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                    {formatTime(record.elapsed)}
                  </span>
                </div>
              ))}

              {completed && (
                <div className="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 mt-1">
                  <span className="font-mono text-sm font-bold text-amber-300">TOTAL</span>
                  <span className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                    {formatTime(elapsed)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
