import type { ProjectDetail } from "./types";

export const realTimeChatApplicationDetail: ProjectDetail = {
  slug: "real-time-chat-application",
  intro:
    "This is a group chat application where messages appear instantly, without anyone needing to refresh the page. People join a room, type, and everyone else in that room sees the message right away. I built the interface in Next.js and the WebSocket server in Node.js, and kept them in one Turborepo monorepo so the two sides share the same TypeScript types.",
  overview:
    "The application handles the parts of chat that people notice most: messages arriving immediately, a small indicator when someone is typing, and a marker showing when a message has been seen. Rooms keep conversations separate, so a message sent in one room does not reach people in another.\n\nWhat made this interesting to build was the synchronization. A chat app is easy to fake with polling, but doing it properly means the server has to track who is connected, who is in which room, and push updates the moment something changes. I used raw WebSockets rather than a hosted realtime service, which meant writing that connection and room logic myself.",
  role: [
    "Built the chat interface in Next.js and React",
    "Wrote the WebSocket server on Node.js and Express",
    "Designed the socket event names and message payloads",
    "Set up the Turborepo monorepo and the shared TypeScript types package",
    "Handled room membership, typing state, and seen status on the server",
    "Deployed the client and the socket server separately",
  ],
  problem:
    "Several people in the same room needed to stay in sync without refreshing. That sounds simple, but it means the server has to know who is currently connected, which room each person is in, and push every new message, typing signal, and seen update to exactly the right people. The other constraint was that I wanted to do this without a hosted realtime service, so all of that connection handling had to be written and reasoned about directly.",
  build:
    "The repo is split into three parts: a Next.js app for the interface, a Node.js server for the sockets, and a small shared package that holds the TypeScript types both sides use.\n\nWhen the client loads, it opens one WebSocket connection and joins a room. From then on, everything travels over that connection. Sending a message emits an event; the server receives it, works out who else is in that room, and pushes it to them. Typing indicators and seen status work the same way, as small events rather than full page updates.\n\nThe server keeps room state in memory: who is connected, who is in which room, and the messages from the current session. React state on the client mirrors whatever the server last sent. New messages get appended to the transcript, and typing or seen events update just that piece of the UI instead of re-rendering everything.\n\nHTTP is only used for loading the Next.js app itself. None of the chat traffic goes through REST.",
  features: [
    {
      title: "Real-Time Messaging",
      description:
        "Messages are delivered over WebSockets, so they show up for everyone in the room as soon as they are sent. There is no polling and no refresh.",
    },
    {
      title: "Chat Rooms",
      description:
        "Conversations are scoped to a room. The server tracks who is in each room and only sends events to the people who belong there.",
    },
    {
      title: "Typing Indicators",
      description:
        "When someone starts typing, the server tells the other people in that room. It is a small signal, but it is the kind of thing that makes a chat feel live rather than delayed.",
    },
    {
      title: "Seen Status",
      description:
        "Read state is shared between participants, so you can tell whether a message has actually been looked at.",
    },
    {
      title: "Shared Message Types",
      description:
        "The event names and message shapes live in one shared package used by both the client and the server. If one side changes a payload, the other side fails to compile instead of failing silently in production.",
    },
    {
      title: "Responsive Interface",
      description:
        "The interface is built with Tailwind CSS and works on both desktop and mobile without a separate app.",
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
      "The frontend and backend run as two separate applications. The Next.js client renders the interface and holds local React state. It keeps one open WebSocket connection to the Node.js server. The server is responsible for connections, room membership, and passing events to the right people. Session data lives in the server's memory: who is connected, and what has been sent in this session. That keeps the system easy to follow, with the known limit that it belongs to a single server process.",
  },
  decisions: [
    {
      title: "WebSockets instead of a hosted realtime service",
      why: "The feature set here is small: messages, typing, and seen status. I wanted to understand the connection handling rather than hand it to a vendor SDK. Writing it directly meant I controlled the event names, the payloads, and what happens when someone joins or leaves.",
      tradeoff:
        "A hosted service would have handled reconnection and scaling for me. With this setup, running more than one server instance would need shared state or a pub/sub layer between them.",
    },
    {
      title: "A monorepo with shared types",
      why: "The client and the server talk constantly, so their message shapes have to match. Putting those types in one shared package means a change on one side is checked against the other at compile time.",
      tradeoff:
        "Slightly more setup than two separate repos, and Turborepo is one more tool to learn. It was worth it. Mismatched payloads between a client and a socket server are painful to debug once they are live.",
    },
    {
      title: "Keeping room state in memory",
      why: "Chat events happen constantly. Writing every message and typing signal to a database would have added a round trip to something that needs to feel instant, and this project did not need message history to survive.",
      tradeoff:
        "Restarting the server clears the rooms. For a demo that is fine, but adding persistence would mean a database write on send and loading history on join.",
    },
    {
      title: "A display name instead of full authentication",
      why: "The interesting problem in this project is synchronization, not accounts. Asking for a name and a room keeps the focus there and lets anyone try the demo immediately.",
      tradeoff:
        "It is not something you would put in front of real users without an auth layer on top, since there is nothing verifying who someone claims to be.",
    },
  ],
  tradeoffs: [
    "Connection lifecycle took the most care. People open second tabs, close them, and lose network, so join and leave events have to be handled properly or rooms end up showing people who already left.",
    "In-memory state made development fast but means nothing survives a restart. That was an accepted limit rather than an oversight.",
    "There is one WebSocket connection per client with no reconnection backoff. On a flaky network a real deployment would need to retry with increasing delays instead of hammering the server.",
  ],
  stack: [
    { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express.js", "WebSockets"] },
    { group: "Tooling", items: ["Turborepo", "Shared TypeScript package"] },
    { group: "Deployment", items: ["Vercel (client)", "Node.js host (socket server)"] },
  ],
  outcome: [
    "A working chat application with rooms, typing indicators, and seen status",
    "A live demo that can be opened without any local setup",
    "A defined socket event contract shared between the client and server packages",
    "An architecture that stays readable, with two applications and one shared types package",
  ],
  learned: [
    "Realtime bugs are usually connection bugs. Most of the issues I hit were not about messages but about what happens when someone disconnects unexpectedly.",
    "Sharing types between a client and a server catches an entire category of mistakes before the code ever runs.",
    "Keeping state in memory is a legitimate choice when you are honest about what it costs you. In this case, that means history which does not survive a restart.",
  ],
  imageAlt:
    "Real-time chat application interface showing a group chat room with messages and typing status",
  relatedSlugs: ["social-media-backend-api", "minilist-headless-cms"],
  internalLinks: [
    {
      sentence:
        "Next.js, TypeScript, Node.js, and WebSockets are part of the stack I work with across projects.",
      anchor: "See the full stack I build with",
      href: "/skills/",
    },
    {
      sentence: "This is one of several full-stack and backend projects I have built.",
      anchor: "Browse all of my work",
      href: "/work/",
    },
  ],
  seo: {
    title: "Real-Time Chat Application | Next.js & WebSockets | Jay Patel",
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
