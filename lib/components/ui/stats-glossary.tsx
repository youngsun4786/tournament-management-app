import { CircleHelp } from "lucide-react";
import React from "react";
import { Button } from "~/lib/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/lib/components/ui/tooltip";

export interface GlossaryItem {
  key: string;
  label: string;
  description?: string;
}

interface StatsGlossaryProps {
  items: GlossaryItem[];
  title?: string;
  className?: string;
}

/**
 * A component that shows a button with a tooltip containing a glossary of stat abbreviations
 */
export const StatsGlossary: React.FC<StatsGlossaryProps> = ({
  items,
  title = "Stats Glossary",
  className,
}) => {
  // Create a mapping of descriptions for common stats if not provided
  const getDescription = (key: string, label: string): string => {
    // If a custom description is provided, use that
    const item = items.find((item) => item.key === key);
    if (item?.description) return item.description;

    // Otherwise use default descriptions for common stats
    const descriptions: Record<string, string> = {
      // Game stats
      "PTS": "Points",
      "PPG": "Points Per Game",
      "AST": "Assists",
      "APG": "Assists Per Game",
      "STL": "Steals",
      "SPG": "Steals Per Game",
      "BLK": "Blocks",
      "BPG": "Blocks Per Game",
      "REB": "Rebounds",
      "RBG": "Rebounds Per Game",
      "OREB": "Offensive Rebounds",
      "DREB": "Defensive Rebounds",

      // Field goal stats
      "FGM": "Field Goals Made",
      "FGA": "Field Goals Attempted",
      "FG%": "Field Goal Percentage",

      // Two-point stats
      "2PM": "Two-Point Field Goals Made",
      "2PA": "Two-Point Field Goals Attempted",
      "2PT%": "Two-Point Field Goal Percentage",
      "2P%": "Two-Point Field Goal Percentage",

      // Three-point stats
      "3PM": "Three-Point Field Goals Made",
      "3PA": "Three-Point Field Goals Attempted",
      "3PT%": "Three-Point Field Goal Percentage",
      "3P%": "Three-Point Field Goal Percentage",

      // Free throw stats
      "FTM": "Free Throws Made",
      "FTA": "Free Throws Attempted",
      "FT%": "Free Throw Percentage",

      "PF": "Personal Fouls",
      "PFPG": "Personal Fouls Per Game",
      "MIN": "Minutes Played",
      "GP": "Games Played",
      "W": "Wins",
      "L": "Losses",
      "WIN%": "Win Percentage",
      "+/-": "Plus/Minus (Point differential when player is on court)",

      // Add more descriptions as needed
    };

    return descriptions[label] || label;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label="View stats glossary"
        >
          <CircleHelp className="h-5 w-5" />
          <span className="sr-only">Stats Glossary</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-80 p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">{title}</h3>
          <ul className="space-y-2 text-xs">
            {items.map((item) => (
              <li
                key={item.key + "-" + item.label}
                className="flex justify-between"
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {getDescription(item.key, item.label)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
