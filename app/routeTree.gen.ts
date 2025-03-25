/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UnauthorizedImport } from './routes/unauthorized'
import { Route as UnauthenticatedImport } from './routes/unauthenticated'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as SignInImport } from './routes/sign-in'
import { Route as ProfileImport } from './routes/profile'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as TeamsIndexImport } from './routes/teams/index'
import { Route as StatsIndexImport } from './routes/stats/index'
import { Route as StandingsIndexImport } from './routes/standings/index'
import { Route as ScheduleIndexImport } from './routes/schedule/index'
import { Route as PlayersIndexImport } from './routes/players/index'
import { Route as EditTeamsIndexImport } from './routes/edit-teams/index'
import { Route as EditGamesIndexImport } from './routes/edit-games/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as ContactUsIndexImport } from './routes/contact-us/index'
import { Route as AdminIndexImport } from './routes/admin/index'
import { Route as TeamsTeamNameImport } from './routes/teams/$teamName'
import { Route as PlayersPlayerIdImport } from './routes/players/$playerId'
import { Route as GamesGameIdImport } from './routes/games/$gameId'
import { Route as EditGamesGameIdImport } from './routes/edit-games/$gameId'

// Create/Update Routes

const UnauthorizedRoute = UnauthorizedImport.update({
  id: '/unauthorized',
  path: '/unauthorized',
  getParentRoute: () => rootRoute,
} as any)

const UnauthenticatedRoute = UnauthenticatedImport.update({
  id: '/unauthenticated',
  path: '/unauthenticated',
  getParentRoute: () => rootRoute,
} as any)

const SignUpRoute = SignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const SignInRoute = SignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TeamsIndexRoute = TeamsIndexImport.update({
  id: '/teams/',
  path: '/teams/',
  getParentRoute: () => rootRoute,
} as any)

const StatsIndexRoute = StatsIndexImport.update({
  id: '/stats/',
  path: '/stats/',
  getParentRoute: () => rootRoute,
} as any)

const StandingsIndexRoute = StandingsIndexImport.update({
  id: '/standings/',
  path: '/standings/',
  getParentRoute: () => rootRoute,
} as any)

const ScheduleIndexRoute = ScheduleIndexImport.update({
  id: '/schedule/',
  path: '/schedule/',
  getParentRoute: () => rootRoute,
} as any)

const PlayersIndexRoute = PlayersIndexImport.update({
  id: '/players/',
  path: '/players/',
  getParentRoute: () => rootRoute,
} as any)

const EditTeamsIndexRoute = EditTeamsIndexImport.update({
  id: '/edit-teams/',
  path: '/edit-teams/',
  getParentRoute: () => rootRoute,
} as any)

const EditGamesIndexRoute = EditGamesIndexImport.update({
  id: '/edit-games/',
  path: '/edit-games/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => rootRoute,
} as any)

const ContactUsIndexRoute = ContactUsIndexImport.update({
  id: '/contact-us/',
  path: '/contact-us/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  id: '/admin/',
  path: '/admin/',
  getParentRoute: () => rootRoute,
} as any)

const TeamsTeamNameRoute = TeamsTeamNameImport.update({
  id: '/teams/$teamName',
  path: '/teams/$teamName',
  getParentRoute: () => rootRoute,
} as any)

const PlayersPlayerIdRoute = PlayersPlayerIdImport.update({
  id: '/players/$playerId',
  path: '/players/$playerId',
  getParentRoute: () => rootRoute,
} as any)

const GamesGameIdRoute = GamesGameIdImport.update({
  id: '/games/$gameId',
  path: '/games/$gameId',
  getParentRoute: () => rootRoute,
} as any)

const EditGamesGameIdRoute = EditGamesGameIdImport.update({
  id: '/edit-games/$gameId',
  path: '/edit-games/$gameId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/sign-up': {
      id: '/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    '/unauthenticated': {
      id: '/unauthenticated'
      path: '/unauthenticated'
      fullPath: '/unauthenticated'
      preLoaderRoute: typeof UnauthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/unauthorized': {
      id: '/unauthorized'
      path: '/unauthorized'
      fullPath: '/unauthorized'
      preLoaderRoute: typeof UnauthorizedImport
      parentRoute: typeof rootRoute
    }
    '/edit-games/$gameId': {
      id: '/edit-games/$gameId'
      path: '/edit-games/$gameId'
      fullPath: '/edit-games/$gameId'
      preLoaderRoute: typeof EditGamesGameIdImport
      parentRoute: typeof rootRoute
    }
    '/games/$gameId': {
      id: '/games/$gameId'
      path: '/games/$gameId'
      fullPath: '/games/$gameId'
      preLoaderRoute: typeof GamesGameIdImport
      parentRoute: typeof rootRoute
    }
    '/players/$playerId': {
      id: '/players/$playerId'
      path: '/players/$playerId'
      fullPath: '/players/$playerId'
      preLoaderRoute: typeof PlayersPlayerIdImport
      parentRoute: typeof rootRoute
    }
    '/teams/$teamName': {
      id: '/teams/$teamName'
      path: '/teams/$teamName'
      fullPath: '/teams/$teamName'
      preLoaderRoute: typeof TeamsTeamNameImport
      parentRoute: typeof rootRoute
    }
    '/admin/': {
      id: '/admin/'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof rootRoute
    }
    '/contact-us/': {
      id: '/contact-us/'
      path: '/contact-us'
      fullPath: '/contact-us'
      preLoaderRoute: typeof ContactUsIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof rootRoute
    }
    '/edit-games/': {
      id: '/edit-games/'
      path: '/edit-games'
      fullPath: '/edit-games'
      preLoaderRoute: typeof EditGamesIndexImport
      parentRoute: typeof rootRoute
    }
    '/edit-teams/': {
      id: '/edit-teams/'
      path: '/edit-teams'
      fullPath: '/edit-teams'
      preLoaderRoute: typeof EditTeamsIndexImport
      parentRoute: typeof rootRoute
    }
    '/players/': {
      id: '/players/'
      path: '/players'
      fullPath: '/players'
      preLoaderRoute: typeof PlayersIndexImport
      parentRoute: typeof rootRoute
    }
    '/schedule/': {
      id: '/schedule/'
      path: '/schedule'
      fullPath: '/schedule'
      preLoaderRoute: typeof ScheduleIndexImport
      parentRoute: typeof rootRoute
    }
    '/standings/': {
      id: '/standings/'
      path: '/standings'
      fullPath: '/standings'
      preLoaderRoute: typeof StandingsIndexImport
      parentRoute: typeof rootRoute
    }
    '/stats/': {
      id: '/stats/'
      path: '/stats'
      fullPath: '/stats'
      preLoaderRoute: typeof StatsIndexImport
      parentRoute: typeof rootRoute
    }
    '/teams/': {
      id: '/teams/'
      path: '/teams'
      fullPath: '/teams'
      preLoaderRoute: typeof TeamsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/profile': typeof ProfileRoute
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/edit-games/$gameId': typeof EditGamesGameIdRoute
  '/games/$gameId': typeof GamesGameIdRoute
  '/players/$playerId': typeof PlayersPlayerIdRoute
  '/teams/$teamName': typeof TeamsTeamNameRoute
  '/admin': typeof AdminIndexRoute
  '/contact-us': typeof ContactUsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
  '/edit-games': typeof EditGamesIndexRoute
  '/edit-teams': typeof EditTeamsIndexRoute
  '/players': typeof PlayersIndexRoute
  '/schedule': typeof ScheduleIndexRoute
  '/standings': typeof StandingsIndexRoute
  '/stats': typeof StatsIndexRoute
  '/teams': typeof TeamsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/profile': typeof ProfileRoute
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/edit-games/$gameId': typeof EditGamesGameIdRoute
  '/games/$gameId': typeof GamesGameIdRoute
  '/players/$playerId': typeof PlayersPlayerIdRoute
  '/teams/$teamName': typeof TeamsTeamNameRoute
  '/admin': typeof AdminIndexRoute
  '/contact-us': typeof ContactUsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
  '/edit-games': typeof EditGamesIndexRoute
  '/edit-teams': typeof EditTeamsIndexRoute
  '/players': typeof PlayersIndexRoute
  '/schedule': typeof ScheduleIndexRoute
  '/standings': typeof StandingsIndexRoute
  '/stats': typeof StatsIndexRoute
  '/teams': typeof TeamsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/profile': typeof ProfileRoute
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/edit-games/$gameId': typeof EditGamesGameIdRoute
  '/games/$gameId': typeof GamesGameIdRoute
  '/players/$playerId': typeof PlayersPlayerIdRoute
  '/teams/$teamName': typeof TeamsTeamNameRoute
  '/admin/': typeof AdminIndexRoute
  '/contact-us/': typeof ContactUsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/edit-games/': typeof EditGamesIndexRoute
  '/edit-teams/': typeof EditTeamsIndexRoute
  '/players/': typeof PlayersIndexRoute
  '/schedule/': typeof ScheduleIndexRoute
  '/standings/': typeof StandingsIndexRoute
  '/stats/': typeof StatsIndexRoute
  '/teams/': typeof TeamsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/profile'
    | '/sign-in'
    | '/sign-up'
    | '/unauthenticated'
    | '/unauthorized'
    | '/edit-games/$gameId'
    | '/games/$gameId'
    | '/players/$playerId'
    | '/teams/$teamName'
    | '/admin'
    | '/contact-us'
    | '/dashboard'
    | '/edit-games'
    | '/edit-teams'
    | '/players'
    | '/schedule'
    | '/standings'
    | '/stats'
    | '/teams'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/profile'
    | '/sign-in'
    | '/sign-up'
    | '/unauthenticated'
    | '/unauthorized'
    | '/edit-games/$gameId'
    | '/games/$gameId'
    | '/players/$playerId'
    | '/teams/$teamName'
    | '/admin'
    | '/contact-us'
    | '/dashboard'
    | '/edit-games'
    | '/edit-teams'
    | '/players'
    | '/schedule'
    | '/standings'
    | '/stats'
    | '/teams'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/profile'
    | '/sign-in'
    | '/sign-up'
    | '/unauthenticated'
    | '/unauthorized'
    | '/edit-games/$gameId'
    | '/games/$gameId'
    | '/players/$playerId'
    | '/teams/$teamName'
    | '/admin/'
    | '/contact-us/'
    | '/dashboard/'
    | '/edit-games/'
    | '/edit-teams/'
    | '/players/'
    | '/schedule/'
    | '/standings/'
    | '/stats/'
    | '/teams/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  ProfileRoute: typeof ProfileRoute
  SignInRoute: typeof SignInRoute
  SignUpRoute: typeof SignUpRoute
  UnauthenticatedRoute: typeof UnauthenticatedRoute
  UnauthorizedRoute: typeof UnauthorizedRoute
  EditGamesGameIdRoute: typeof EditGamesGameIdRoute
  GamesGameIdRoute: typeof GamesGameIdRoute
  PlayersPlayerIdRoute: typeof PlayersPlayerIdRoute
  TeamsTeamNameRoute: typeof TeamsTeamNameRoute
  AdminIndexRoute: typeof AdminIndexRoute
  ContactUsIndexRoute: typeof ContactUsIndexRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  EditGamesIndexRoute: typeof EditGamesIndexRoute
  EditTeamsIndexRoute: typeof EditTeamsIndexRoute
  PlayersIndexRoute: typeof PlayersIndexRoute
  ScheduleIndexRoute: typeof ScheduleIndexRoute
  StandingsIndexRoute: typeof StandingsIndexRoute
  StatsIndexRoute: typeof StatsIndexRoute
  TeamsIndexRoute: typeof TeamsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ProfileRoute: ProfileRoute,
  SignInRoute: SignInRoute,
  SignUpRoute: SignUpRoute,
  UnauthenticatedRoute: UnauthenticatedRoute,
  UnauthorizedRoute: UnauthorizedRoute,
  EditGamesGameIdRoute: EditGamesGameIdRoute,
  GamesGameIdRoute: GamesGameIdRoute,
  PlayersPlayerIdRoute: PlayersPlayerIdRoute,
  TeamsTeamNameRoute: TeamsTeamNameRoute,
  AdminIndexRoute: AdminIndexRoute,
  ContactUsIndexRoute: ContactUsIndexRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  EditGamesIndexRoute: EditGamesIndexRoute,
  EditTeamsIndexRoute: EditTeamsIndexRoute,
  PlayersIndexRoute: PlayersIndexRoute,
  ScheduleIndexRoute: ScheduleIndexRoute,
  StandingsIndexRoute: StandingsIndexRoute,
  StatsIndexRoute: StatsIndexRoute,
  TeamsIndexRoute: TeamsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/profile",
        "/sign-in",
        "/sign-up",
        "/unauthenticated",
        "/unauthorized",
        "/edit-games/$gameId",
        "/games/$gameId",
        "/players/$playerId",
        "/teams/$teamName",
        "/admin/",
        "/contact-us/",
        "/dashboard/",
        "/edit-games/",
        "/edit-teams/",
        "/players/",
        "/schedule/",
        "/standings/",
        "/stats/",
        "/teams/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/unauthenticated": {
      "filePath": "unauthenticated.tsx"
    },
    "/unauthorized": {
      "filePath": "unauthorized.tsx"
    },
    "/edit-games/$gameId": {
      "filePath": "edit-games/$gameId.tsx"
    },
    "/games/$gameId": {
      "filePath": "games/$gameId.tsx"
    },
    "/players/$playerId": {
      "filePath": "players/$playerId.tsx"
    },
    "/teams/$teamName": {
      "filePath": "teams/$teamName.tsx"
    },
    "/admin/": {
      "filePath": "admin/index.tsx"
    },
    "/contact-us/": {
      "filePath": "contact-us/index.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx"
    },
    "/edit-games/": {
      "filePath": "edit-games/index.tsx"
    },
    "/edit-teams/": {
      "filePath": "edit-teams/index.tsx"
    },
    "/players/": {
      "filePath": "players/index.tsx"
    },
    "/schedule/": {
      "filePath": "schedule/index.tsx"
    },
    "/standings/": {
      "filePath": "standings/index.tsx"
    },
    "/stats/": {
      "filePath": "stats/index.tsx"
    },
    "/teams/": {
      "filePath": "teams/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
