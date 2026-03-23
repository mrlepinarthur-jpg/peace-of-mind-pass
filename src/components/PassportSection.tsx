import { motion } from "framer-motion";
import { LucideIcon, ChevronRight, Lock, Crown } from "lucide-react";

interface PassportSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  completed?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

const PassportSection = ({
  icon: Icon,
  title,
  description,
  index,
  completed = false,
  locked = false,
  onClick,
}: PassportSectionProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={`w-full bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-300 flex items-center gap-4 text-left group hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.99] ${
        locked ? "opacity-75" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          locked
            ? "bg-muted text-muted-foreground"
            : completed
            ? "bg-sage-light text-sage"
            : "bg-muted text-muted-foreground group-hover:bg-sage-light group-hover:text-sage"
        }`}
      >
        {locked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          {locked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy/10 text-navy text-[10px] font-semibold flex-shrink-0">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {locked ? "Passer à Sérénité pour débloquer" : description}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </motion.button>
  );
};

export default PassportSection;
