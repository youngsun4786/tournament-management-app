import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import React from "react";

interface WinnerBannerProps {
  teamName: string;
  seasonName: string;
  buttonText: string;
  buttonUrl: string;
}

function WinnerMarquee({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="relative flex w-full overflow-x-hidden bg-background border-y border-border">
      <div className="animate-marquee whitespace-nowrap py-6">
        {items.map((item, index) => (
          <span key={index} className="mx-8">
            {item}
          </span>
        ))}
      </div>

      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-6">
        {items.map((item, index) => (
          <span key={index} className="mx-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function WinnerBanner({ teamName, seasonName }: WinnerBannerProps) {
  const marqueeItems = Array(6).fill(
    <div className="inline-flex items-center gap-3">
      <Trophy className="h-6 w-6 text-amber-500" />
      <span className="text-xl font-bold">{teamName}</span>
      <span className="text-muted-foreground">Season Champion</span>
    </div>
  );

  return (
    <section className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="py-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {seasonName} Champions
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight mb-4"
          >
            Congratulations to <span className="text-primary">{teamName}</span>!
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* <Button asChild>
              <a href={buttonUrl}>{buttonText}</a>
            </Button> */}
          </motion.div>
        </div>
      </div>

      <WinnerMarquee items={marqueeItems} />
    </section>
  );
}

export default WinnerBanner;
