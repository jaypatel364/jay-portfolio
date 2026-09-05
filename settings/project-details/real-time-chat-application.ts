import type { ProjectDetail } from "./types";

export const realTimeChatApplicationDetail: ProjectDetail = {
  slug: "real-time-chat-application",
  intro:
    "This is a real-time chat application where messages land instantly, with nobody refreshing the page. People join a room, type, and everyone else in that room sees the message right away. I built the interface in Next.js and the WebSocket server in Node.js, then kept both in one Turborepo monorepo so the two sides share the same TypeScript types.",
  overview:
    "The app handles the parts of chat people notice most: messages arriving at once, a small indicator when someone is typing, and a marker once a message has been seen. Rooms keep conversations apart, so a message sent in one room never reaches people in another.\n\nSynchronization is what made this interesting to build. You can fake a chat app with polling. Doing it properly means the server tracks who is connected, who is in which room, and pushes updates the second something changes. I used raw WebSockets, not a hosted realtime service, so all of that connection and room logic was mine to write.",
  role: [
    "Built the chat interface in Next.js and React",
    "Wrote the WebSocket server on Node.js and Express",
    "Designed the socket event names and message payloads",
    "Set up the Turborepo monorepo and the shared TypeScript types package",
    "Handled room membership, typing state, and seen status on the server",
    "Deployed the client and the socket server separately",
  ],
  problem:
    "Several people in one room needed to stay in sync without refreshing. That sounds simple. In practice the server has to know who is connected right now, which room each person sits in, and then push every new message, typing signal, and seen update to exactly the right people. I also wanted to do it without a hosted realtime service. So every bit of that connection handling had to be written and reasoned about by hand.",
  build:
    "The repo splits into three parts: a Next.js app for the interface, a Node.js server for the sockets, and a small shared package holding the TypeScript types both sides use.\n\nWhen the client loads, it opens one WebSocket connection and joins a room. From then on, everything travels over that connection. Sending a message emits an event. The server receives it, works out who else is in that room, and pushes it to them. Typing indicators and seen status ride along as small events of their own.\n\nThe server keeps room state in memory: who is connected, who is in which room, and the messages from the current session. React state on the client mirrors whatever the server last sent. New messages get appended to the transcript, while typing and seen events update one small piece of the UI.\n\nHTTP is only used to load the Next.js app itself. None of the chat traffic goes through REST.",
  features: [
    {
      title: "Real-Time Messaging",
      description:
        "Messages travel over WebSockets, so they show up for everyone in the room the moment they are sent. No polling, no refresh.",
    },
    {
      title: "Chat Rooms",
      description:
        "Conversations are scoped to a room. The server tracks who is in each room and sends events only to the people who belong there.",
    },
    {
      title: "Typing Indicators",
      description:
        "When someone starts typing, the server tells everyone else in that room. It is a small signal that does a lot of work. Without it, a chat feels laggy even when it is not.",
    },
    {
      title: "Seen Status",
      description:
        "Read state is shared between participants, so you can tell whether a message has actually been looked at.",
    },
    {
      title: "Shared Message Types",
      description:
        "Event names and message shapes live in one shared package that the client and the server both import. Change a payload on one side and the other side stops compiling. Nothing fails quietly in production.",
    },
    {
      title: "Responsive Interface",
      description:
        "The interface is built with Tailwind CSS and works on desktop and mobile without a separate app.",
    },
  ],
  architecture: {
    layers: [
      "Next.js Client",
      "WebSocket Connection",
      "Node.js / Express Server",
      "Room & Event Logic",
      "In-Memory Session State",
    ],
    explanation:
      "The frontend and backend run as two separate apps. The Next.js client renders the interface and holds local React state. It keeps one open WebSocket connection to the Node.js server. That server owns connections, room membership, and routing events to the right people. Session data lives in the server's memory: who is connected, and what has been sent so far. It keeps the system easy to follow, with one known limit. All of it belongs to a single server process.",
  },
  decisions: [
    {
      title: "Raw WebSockets over a hosted realtime service",
      why: "The feature set here is small: messages, typing, and seen status. I wanted to understand connection handling myself, not hand it to a vendor SDK. Writing it directly left me in charge of the event names, the payloads, and what happens when someone joins or leaves.",
      tradeoff:
        "A hosted service would have handled reconnection and scaling for me. In this setup, running a second server instance would need shared state or a pub/sub layer between them.",
    },
    {
      title: "A monorepo with shared types",
      why: "The client and the server talk constantly, so their message shapes have to match. One shared types package means a change on either side gets checked against the other at compile time.",
      tradeoff:
        "A little more setup than two separate repos, and Turborepo is one more tool to learn. Still worth it. Mismatched payloads between a client and a socket server are miserable to debug once they are live.",
    },
    {
      title: "Keeping room state in memory",
      why: "Chat events fire constantly. Writing every message and typing signal to a database adds a round trip to something that has to feel instant. This project also never needed history to survive a restart.",
      tradeoff:
        "Restart the server and the rooms are empty. Fine for a demo. Real persistence would mean a database write on every send and a history load on every join.",
    },
    {
      title: "A display name in place of full authentication",
      why: "The interesting problem here is synchronization, not accounts. Asking for a name and a room keeps the focus where it belongs and lets anyone open the demo straight away.",
      tradeoff:
        "Nothing verifies who a person claims to be, so this would need an auth layer before it went anywhere near real users.",
    },
  ],
  tradeoffs: [
    "The connection lifecycle took the most care. People open second tabs, close them, and drop off wifi. Handle join and leave sloppily and rooms fill up with people who already left.",
    "In-memory state made development fast and means nothing survives a restart. That was a deliberate limit, not an oversight.",
    "There is one WebSocket connection per client and no reconnection backoff. On a flaky network, a real deployment would need to retry with growing delays so it does not hammer the server.",
  ],
  stack: [
    { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express.js", "WebSockets"] },
    { group: "Tooling", items: ["Turborepo", "Shared TypeScript package"] },
    { group: "Deployment", items: ["Vercel (client)", "Node.js host (socket server)"] },
  ],
  outcome: [
    "A working chat application with rooms, typing indicators, and seen status",
    "A public demo running the Next.js client against the deployed socket server",
    "A defined socket event contract shared between the client and server packages",
    "An architecture that stays readable: two apps and one shared types package",
  ],
  learned: [
    "Realtime bugs are usually connection bugs. Almost nothing I hit was about messages. It was about what happens when someone drops off without warning.",
    "Sharing types between a client and a server catches an entire category of mistake before the code ever runs.",
    "Keeping state in memory is a fair choice as long as you are honest about the cost. Here the cost is history that does not survive a restart.",
  ],
  imageAlt:
    "Real-time chat application interface showing a group chat room with messages and typing status",
  relatedSlugs: ["social-media-backend-api", "minilist-headless-cms"],
  internalLinks: [
    {
      sentence:
        "Next.js, TypeScript, Node.js, and WebSockets turn up across most of the work I take on.",
      anchor: "Check my Node.js and TypeScript experience",
      href: "/skills/",
    },
    {
      sentence: "This is one of several full-stack and backend builds in the portfolio.",
      anchor: "See what else I have worked on",
      href: "/work/",
    },
  ],
  seo: {
    title: "Real-Time Chat Application | WebSockets | Jay Patel",
    description:
      "A real-time group chat app built with Next.js, Node.js, TypeScript and WebSockets, with chat rooms, typing indicators and seen status in a Turborepo monorepo.",
    ogTitle: "Real-Time Chat Application | Next.js & WebSockets",
    ogDescription:
      "A full-stack chat application built with Next.js, Node.js, TypeScript and WebSockets for real-time messaging, typing indicators and seen status.",
    primaryTopic: "Real-Time Chat Application",
    secondaryTopics: [
      "WebSockets",
      "Next.js chat application",
      "Node.js real-time server",
      "chat rooms",
      "typing indicators",
      "seen status",
      "Turborepo monorepo",
      "TypeScript",
    ],
  },
};
