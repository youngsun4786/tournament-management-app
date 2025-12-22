import { createFileRoute } from "@tanstack/react-router";
// import { CarouselSpacing } from "~/lib/components/carousel-spacing";
// import { TeamRankings } from "~/lib/components/standings/team-rankings";
// import TeamSlider from "~/lib/components/team-slider";
// import { ImageCarousel } from "~/lib/components/ui/image-carousel";
// import WinnerBanner from "~/lib/components/winner-banner";
import { useEffect, useState } from 'react';
import { Button } from '~/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/lib/components/ui/dialog';

import { ContactForm } from '~/lib/components/preseason/contact-form';
import { getTeams } from '~/lib/data/team-lists';


export const Route = createFileRoute("/")({
  component: LandingPage,
  loader: async () => await getTeams(),
});

// function Index() {
//   return (
//     <div>
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold">Upcoming Games</h1>
//       </div>
//       <div className="w-full bg-slate-100 dark:bg-gray-800">
//         <div className="container mx-auto">
//           <CarouselSpacing isTeamInfo={false} />
//         </div>
//       </div>

//       {/* Winner Banner */}
//       <WinnerBanner
//         teamName="Cash"
//         seasonName="Spring 2025"
//         buttonText="View Team Stats"
//         buttonUrl="/teams/cash"
//       />

//       {/* Main Content Section */}
//       <div className="container mx-auto px-4 lg:px-6 py-8">
//         <div className="flex flex-col lg:flex-row">
//           {/* Main Content - 75% */}
//           <div className="w-full lg:w-3/4 lg:pr-8">
//             <h2 className="text-xl font-bold mb-4">Season Highlights</h2>
//             {/* Main Image Section */}
//             <div className="mb-8">
//               <ImageCarousel
//                 images={[]}
//                 autoplayInterval={4000}
//                 aspectRatio={16 / 9}
//                 className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg shadow-md"
//               />
//             </div>

//             {/* News Section */}
//             {/* <div className="mb-8">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold">SHORTS</h2>
//                 <Link
//                   to="/"
//                   className="text-blue-600 dark:text-blue-400 flex items-center"
//                 >
//                   See more
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {[1, 2, 3, 4].map((index) => (
//                   <div
//                     key={index}
//                     className="rounded-lg overflow-hidden shadow-md"
//                   >
//                     <AspectRatio ratio={4 / 3}>
//                       <img
//                         src={`/game_display/short_${index}.jpg`}
//                         alt={`News item ${index}`}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = "game_display/home_1.jpg";
//                         }}
//                       />
//                     </AspectRatio>
//                     <div className="p-3">
//                       <h3 className="font-medium text-sm truncate">
//                         Player Highlight
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         2025.03.12
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div> */}
//           </div>

//           {/* Sidebar - 20% */}
//           <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
//             {/* Team Rankings */}
//             <TeamRankings />
//           </div>
//         </div>

//         <div className="pt-4 pb-20 px-6 flex items-center justify-center">
//           <TeamSlider></TeamSlider>
//         </div>

//         {/* ------------- SPONSORS --------------- */}

//         <div className="flex flex-col lg:flex-row">
//           {/* Title Sponsors - 66% */}
//           <div className="w-full lg:w-2/3 lg:pr-4">
//             <div className="w-full">
//               <h2 className="text-xl font-bold mb-2">Title Sponsors</h2>
//               <div className="flex items-center gap-2 py-4">
//                 <img
//                   src="title_sponsors/Parker-Xiong-400x600.png"
//                   alt="sponsor 1"
//                   className="h-72 object-contain"
//                 />
//                 <img
//                   src="title_sponsors/calgary-brothers.png"
//                   alt="title sponsor"
//                   className="h-48 object-contain"
//                 />
//                 <img
//                   src="title_sponsors/Shane-Wan-400x600.png"
//                   alt="sponsor 2"
//                   className="h-72 object-contain"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Sponsors - 33% */}
//           <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
//             <div className="w-full">
//               <h2 className="text-xl font-bold mb-2">Sponsors</h2>
//               <div className="grid grid-cols-2 gap-4 p-4">
//                 <div>
//                   <img
//                     src="sponsors/sponsor_enning_blinds.png"
//                     alt="sponsor 1"
//                     className="h-24 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <img
//                     src="sponsors/sponsor_top_kitchen.png"
//                     alt="sponsor 4"
//                     className="h-24 object-contain"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
function LandingPage() {
  const teams = Route.useLoaderData();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'join' | 'sponsor'>('join')

  function calculateTimeLeft() {
    const difference = +new Date('2026-02-06') - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  // Helper to pad numbers with leading zero
  const pad = (num: number) => (num < 10 ? `0${num}` : num)

  return (
    <div className="relative min-h-full w-full font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background_img.png"
          alt="Basketball Court Background"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#020617]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* HERO SECTION - Centered Viewport Content */}
        <div className="flex miany-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 text-center py-10 w-full">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                Calgary Chinese Basketball Club Asian League Season 5
            </span>
            </div>

            {/* Main Heading */}
            <div className="mb-2 flex flex-col items-center leading-none">
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                COMING SOON
            </h1>
            
            <div className="mt-4 flex items-start justify-center gap-2 sm:gap-4 md:gap-6">
                {/* @ts-ignore */}
                {timeLeft.days !== undefined ? (
                <>
                    {/* Days */}
                    {/* Days */}
                    <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl tabular-nums leading-none">
                        {/* @ts-ignore */}
                        {pad(timeLeft.days)}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-widest text-white uppercase sm:text-sm">
                        Days
                    </span>
                    </div>

                    {/* Separator */}
                    <div className="pt-0 bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black text-transparent sm:text-6xl md:text-7xl lg:text-8xl leading-none flex items-center pb-2 sm:pb-4">:</div>

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl tabular-nums leading-none">
                        {/* @ts-ignore */}
                        {pad(timeLeft.hours)}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-widest text-white uppercase sm:text-sm">
                        Hours
                    </span>
                    </div>

                    {/* Separator */}
                    <div className="pt-0 bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black text-transparent sm:text-6xl md:text-7xl lg:text-8xl leading-none flex items-center pb-2 sm:pb-4">:</div>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl tabular-nums leading-none">
                        {/* @ts-ignore */}
                        {pad(timeLeft.minutes)}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-widest text-white uppercase sm:text-sm">
                        Minutes
                    </span>
                    </div>

                    {/* Separator */}
                    <div className="pt-0 bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black text-transparent sm:text-6xl md:text-7xl lg:text-8xl leading-none flex items-center pb-2 sm:pb-4">:</div>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-b from-orange-500 to-orange-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl tabular-nums leading-none">
                        {/* @ts-ignore */}
                        {pad(timeLeft.seconds)}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-widest text-white uppercase sm:text-sm">
                        Seconds
                    </span>
                    </div>
                </>
                ) : (
                <span className="text-4xl font-bold text-white">SEASON STARTED</span>
                )}
            </div>
            </div>


            {/* Action Buttons Container */}
            <div className="mt-8 flex w-1/2 md:w-full max-w-lg flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md md:flex-row md:p-2">
            <Button 
                onClick={() => {
                setModalType('join')
                setIsModalOpen(true)
                }}
                className="h-10 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold tracking-wider text-white hover:from-orange-400 hover:to-orange-500 sm:flex-1"
            >
                MAKE OR JOIN TEAM
            </Button>
            
            <Button 
                variant="ghost" 
                onClick={() => {
                setModalType('sponsor')
                setIsModalOpen(true)
                }}
                className="h-10 w-full border border-white/10 bg-white/5 text-xs font-bold tracking-wider text-white hover:bg-white/10 sm:flex-1"
            >
                SPONSOR LEAGUE
            </Button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="border-white/10 bg-zinc-950/80 text-white backdrop-blur-xl sm:max-w-[500px] sm:rounded-2xl">
                <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    {modalType === 'join' ? 'MAKE OR JOIN A TEAM' : 'SPONSOR THE LEAGUE'}
                </DialogTitle>
                <DialogDescription className="text-base text-zinc-400">
                    {modalType === 'join' 
                    ? 'Enter your details below to get started with a team.' 
                    : 'Interested in sponsoring? Let us know!'}
                </DialogDescription>
                </DialogHeader>
                <ContactForm 
                type={modalType} 
                onSuccess={() => setIsModalOpen(false)} 
                />
            </DialogContent>
            </Dialog>

            {/* Team Logos Carousel */}
            <div className="mt-8 w-full max-w-5xl overflow-hidden pause-on-hover">
            <div className="flex w-max animate-marquee gap-16">
                {[...teams, ...teams].map((team, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-transform hover:scale-110 sm:h-24 sm:w-24">
                    <img
                        src={team.logo}
                        alt={team.name}
                        className="h-full w-full object-contain"
                    />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    {team.name}
                    </span>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Schedule Image Section */}
        <div className="pb-20 px-4 w-full flex justify-center">
            <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
                <img 
                    src="/schedule.png" 
                    alt="Season Schedule" 
                    className="w-full h-auto rounded-lg"
                />
            </div>
        </div>
      </div>
    </div>
  )
}
