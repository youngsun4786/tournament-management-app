"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { AspectRatio } from "~/lib/components/ui/aspect-ratio";
import { cn } from "~/lib/utils/cn";

interface ImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  autoplayInterval?: number;
  aspectRatio?: number;
}

export function ImageCarousel({
  images,
  className,
  autoplayInterval = 4000,
  aspectRatio = 16 / 9,
  ...props
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const autoplayTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  // Setup autoplay
  React.useEffect(() => {
    if (!isHovering && autoplayInterval > 0) {
      autoplayTimerRef.current = setInterval(goToNext, autoplayInterval);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [goToNext, isHovering, autoplayInterval]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <AspectRatio ratio={aspectRatio} className="bg-muted">
        <div className="relative h-full w-full overflow-hidden">
          {images.map((src, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out",
                index === currentIndex
                  ? "translate-x-0"
                  : index < currentIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
              )}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </AspectRatio>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={goToPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-opacity hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={goToNext}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-opacity hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index === currentIndex
                ? "bg-foreground"
                : "bg-foreground/30 hover:bg-foreground/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
