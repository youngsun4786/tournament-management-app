import { createFileRoute } from "@tanstack/react-router";
import { CarouselSpacing } from "../../lib/components/carousel-spacing";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-xl font-bold">Upcoming Games</h1>
      </div>
      <div className="flex justify-center items-center bg-slate-100 h-1/5">
        <CarouselSpacing></CarouselSpacing>
      </div>
    </div>
  );
}
