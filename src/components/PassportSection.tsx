import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface PassportSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  completed?: boolean;
  onClick?: () => void;
}

const PassportSection = ({
  icon: Icon,
  title,
  description,
  index,
  completed = false,
  onClick,
}: PassportSectionProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-300 flex items-center gap-4 text-left group hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.99]"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          completed
            ? "bg-sage-light text-sage"
            : "bg-muted text-muted-foreground group-hover:bg-sage-light group-hover:text-sage"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </motion.button>
  );
};

export default PassportSection;
