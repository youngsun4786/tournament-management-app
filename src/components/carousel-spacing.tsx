import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export function CarouselSpacing() {
  return (
    <div>
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/6 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center px-8">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
