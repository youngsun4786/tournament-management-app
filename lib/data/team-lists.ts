import { createServerFn } from '@tanstack/react-start'

export const getTeams = createServerFn({
  method: 'GET',
}).handler(async () => [
  { name: 'BBB', logo: '/team_logos/bbb.png' },
  { name: 'Team Aegis', logo: '/team_logos/aegis.png' },
  { name: 'Calgary Brothers', logo: '/team_logos/calgary-brothers.png' },
  { name: 'Cash', logo: '/team_logos/cash.png' },
  { name: 'Pinoy Finest', logo: '/team_logos/pinoy-finest.png' },
  { name: 'South Pole', logo: '/team_logos/south-pole.png' },
  { name: 'Team Korea', logo: '/team_logos/team-korea.png' },
  { name: 'YYC Shooters', logo: '/team_logos/yyc-shooters.png' },
])
