import { CATEGORIES, CATEGORY_IDS } from "@/lib/tournament";
import type { CategoryId } from "@/lib/types";

interface CategoryTabsProps {
  value: CategoryId;
  onChange: (category: CategoryId) => void;
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div role="tablist" className="grid grid-cols-3 gap-2 sm:gap-4">
      {CATEGORY_IDS.map((id) => {
        const { name, description } = CATEGORIES[id];
        const active = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`glass rounded-2xl px-3 py-3 text-left transition sm:px-5 ${
              active
                ? "border-primary-neon bg-primary-neon/10 shadow-neon"
                : "hover:bg-white/10"
            }`}
          >
            <span
              className={`display block text-2xl sm:text-3xl ${active ? "text-primary-neon" : ""}`}
            >
              {name}
            </span>
            <span className="block truncate text-xs text-white/60 sm:text-sm">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
