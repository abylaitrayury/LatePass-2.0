/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  Moon, 
  Clock, 
  Bus, 
  FileText, 
  Thermometer, 
  Car, 
  Users, 
  Coffee, 
  MoreHorizontal,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { generateExcuses, ExcuseOutput } from "./services/gemini";

const SITUATIONS = [
  { id: "late", label: "Woke up late", icon: Clock, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "bus", label: "Missed the bus", icon: Bus, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "forgot", label: "Forgot assignment", icon: FileText, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "sick", label: "Sick", icon: Thermometer, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  { id: "traffic", label: "Traffic", icon: Car, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { id: "family", label: "Family emergency", icon: Users, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "overslept", label: "Overslept after studying", icon: Coffee, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400" },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState<"choose" | "details" | "result">("choose");
  const [selectedSituation, setSelectedSituation] = useState<string>("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [excuses, setExcuses] = useState<ExcuseOutput | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStep("result");
    try {
      const situationLabel = SITUATIONS.find(s => s.id === selectedSituation)?.label || selectedSituation;
      const data = await generateExcuses(situationLabel, teacherName, className);
      setExcuses(data);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("choose");
    setSelectedSituation("");
    setExcuses(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-bottom border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              LatePass
            </h1>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            id="theme-toggle"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {step === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">
                  Oops! What happened?
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Pick a situation and we'll craft the perfect excuse for you.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SITUATIONS.map((situation) => (
                  <motion.button
                    key={situation.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSituation(situation.id);
                      setStep("details");
                    }}
                    className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
                    id={`btn-${situation.id}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${situation.color}`}>
                      <situation.icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white block">
                      {situation.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto space-y-8"
            >
              <div className="space-y-4">
                <button 
                  onClick={() => setStep("choose")}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Go back
                </button>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  Add some flavor
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Optional details to make the excuse more believable.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Teacher Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Smith"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Class Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. History 101"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                Generate Excuse
              </button>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                    Here are your passes
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Use them wisely. We are not responsible for detention!
                  </p>
                </div>
                
                {excuses && (
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {excuses.beliefPercentage}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Believability</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Chance teacher buys it</p>
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex items-center justify-center">
                       <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin opacity-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ExcuseCard 
                    title="Formal" 
                    content={excuses?.formal || ""} 
                    onCopy={() => handleCopy(excuses?.formal || "", "formal")} 
                    copied={copiedId === "formal"}
                  />
                  <ExcuseCard 
                    title="Casual" 
                    content={excuses?.casual || ""} 
                    onCopy={() => handleCopy(excuses?.casual || "", "casual")} 
                    copied={copiedId === "casual"}
                  />
                  <ExcuseCard 
                    title="Convincing" 
                    content={excuses?.convincing || ""} 
                    onCopy={() => handleCopy(excuses?.convincing || "", "convincing")} 
                    copied={copiedId === "convincing"}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> Generate Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Powered by Gemini AI • Play nice 🎓
          </p>
      </footer>
    </div>
  );
}

function ExcuseCard({ title, content, onCopy, copied }: { title: string, content: string, onCopy: () => void, copied: boolean }) {
  return (
    <div className="group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={onCopy}
          className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
      <p className="flex-grow text-slate-600 dark:text-slate-400 leading-relaxed text-sm italic">
        "{content}"
      </p>
    </div>
  );
}
