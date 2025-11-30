import { createFileRoute } from "@tanstack/react-router";
import { CarouselSpacing } from "~/lib/components/carousel-spacing";
import { TeamRankings } from "~/lib/components/standings/team-rankings";
import TeamSlider from "~/lib/components/team-slider";
import { ImageCarousel } from "~/lib/components/ui/image-carousel";
import WinnerBanner from "~/lib/components/winner-banner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Upcoming Games</h1>
      </div>
      <div className="w-full bg-slate-100 dark:bg-gray-800">
        <div className="container mx-auto">
          <CarouselSpacing isTeamInfo={false} />
        </div>
      </div>

      {/* Winner Banner */}
      <WinnerBanner
        teamName="Cash"
        seasonName="Spring 2025"
        buttonText="View Team Stats"
        buttonUrl="/teams/cash"
      />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content - 75% */}
          <div className="w-full lg:w-3/4 lg:pr-8">
            <h2 className="text-xl font-bold mb-4">Season Highlights</h2>
            {/* Main Image Section */}
            <div className="mb-8">
              <ImageCarousel
                images={[]}
                autoplayInterval={4000}
                aspectRatio={16 / 9}
                className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg shadow-md"
              />
            </div>

            {/* News Section */}
            {/* <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">SHORTS</h2>
                <Link
                  to="/"
                  className="text-blue-600 dark:text-blue-400 flex items-center"
                >
                  See more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-md"
                  >
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={`/game_display/short_${index}.jpg`}
                        alt={`News item ${index}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "game_display/home_1.jpg";
                        }}
                      />
                    </AspectRatio>
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">
                        Player Highlight
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2025.03.12
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar - 20% */}
          <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
            {/* Team Rankings */}
            <TeamRankings />
          </div>
        </div>

        <div className="pt-4 pb-20 px-6 flex items-center justify-center">
          <TeamSlider></TeamSlider>
        </div>

        {/* ------------- SPONSORS --------------- */}

        <div className="flex flex-col lg:flex-row">
          {/* Title Sponsors - 66% */}
          <div className="w-full lg:w-2/3 lg:pr-4">
            <div className="w-full">
              <h2 className="text-xl font-bold mb-2">Title Sponsors</h2>
              <div className="flex items-center gap-2 py-4">
                <img
                  src="title_sponsors/Parker-Xiong-400x600.png"
                  alt="sponsor 1"
                  className="h-72 object-contain"
                />
                <img
                  src="title_sponsors/calgary-brothers.png"
                  alt="title sponsor"
                  className="h-48 object-contain"
                />
                <img
                  src="title_sponsors/Shane-Wan-400x600.png"
                  alt="sponsor 2"
                  className="h-72 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Sponsors - 33% */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="w-full">
              <h2 className="text-xl font-bold mb-2">Sponsors</h2>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div>
                  <img
                    src="sponsors/sponsor_enning_blinds.png"
                    alt="sponsor 1"
                    className="h-24 object-contain"
                  />
                </div>
                <div>
                  <img
                    src="sponsors/sponsor_top_kitchen.png"
                    alt="sponsor 4"
                    className="h-24 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
