import type { ProjectDetail } from "./types";

export const verify360KycPlatformDetail: ProjectDetail = {
  slug: "verify-360-kyc-platform",
  heading: "Verify 360: A KYC and Identity Verification Platform in React and Node.js",
  intro:
    "Before a business opens an account for someone, it needs to know that person actually is who they claim to be. That's what Verify 360 handles: document verification, 3D liveness detection, and location tracking, all folded into one identity verification process. Every attempt gets a risk score at the end, so only the doubtful cases land in front of a human reviewer. React and React Native cover the frontend, while Node.js and MongoDB run behind them.",
  ndaNotice:
    "This project is protected under an NDA. A client owns this work, and the contract limits what I can share publicly, so this write-up covers my own role and the general shape of the system, without the client, their data, or the exact logic behind the risk scoring. You can see this platform alongside other production work in the project portfolio.",
  overview:
    "Verifying someone's identity isn't one action, it's a sequence of checks. A user submits an ID document. A liveness check then proves a real person is actually present, not a photo or a screen recording held up to the camera. Location gets captured along the way, and third-party identity services get called in to confirm whatever details the user supplied.\n\nEach of those checks produces one signal, and no single signal settles anything by itself. This identity verification platform folds them all into a single risk score, freeing a compliance team to spend its attention on cases that genuinely need a person, while clean attempts clear on their own without adding friction.\n\nTwo clients exist for this KYC platform: a React web app and a React Native mobile app. Liveness detection needs a working camera, and most people end up finishing that step on their phone anyway.",
  role: [
    "Built the React web application and worked on the React Native mobile client",
    "Developed REST APIs on Node.js and Express for the verification flow",
    "Integrated AWS Rekognition for face and document checks",
    "Integrated third-party identity verification APIs",
    "Worked on real-time geolocation capture during verification",
    "Implemented the risk-scoring logic that flags suspicious verification attempts",
  ],
  problem:
    "Verification has to be strict enough to catch fraud, and smooth enough that genuine users actually make it through without giving up halfway. Every extra step costs real applicants who abandon the process. Every weak check lets a fraudulent attempt slip past.\n\nThe hard part is that no single signal ever settles the question definitively. A document can look completely valid, a face can match its photo, a location can seem reasonable, and the whole attempt can still be fake. So this identity verification service had to weigh several separate signals into one answer, and do it while a real person sat there waiting for the result.",
  build:
    "Verification runs as a series of steps, and each one hands off a result the next step can build on. Users start either on the React web app or the React Native mobile app, and mobile carries real weight here, since liveness detection needs camera access and a guided capture flow that simply works better on a phone.\n\nThe Node.js and Express backend runs the identity verification API behind both clients. It takes the submitted document, calls AWS Rekognition for the face and document checks, then calls third-party identity verification services to confirm whatever details the user provided. Location gets captured as the user moves through the flow, adding one more signal for the system to weigh alongside everything else.\n\nMongoDB stores every verification record. Each check type, and every outside provider, returns a different response shape, and a document store absorbs that variation as it arrives rather than forcing every response into a rigid structure.\n\nRisk scoring runs once all the checks are complete. There's no plain pass or fail here. Signals combine into a single score, and that score decides whether an attempt clears automatically or lands in front of a compliance reviewer. For more on how I approach this kind of integration-heavy backend work, see my Node.js and API integration skills and React Native mobile development skills.",
  features: [
    {
      title: "Document verification",
      description:
        "An ID document is submitted and checked as the first stage of the flow, and everything after this leans on whether that document actually holds up.",
    },
    {
      title: "3D liveness detection",
      description:
        "This confirms a real person is present, not a photo, screen, or recording, which is what gives face matching any real meaning. Without it, a printed photo could walk straight through undetected.",
    },
    {
      title: "Real-time geolocation",
      description:
        "Location gets captured while a check is running, adding a signal no document check alone could ever provide.",
    },
    {
      title: "Third-party identity verification",
      description:
        "Outside services check a user's supplied details against sources beyond the platform itself, so the final result never rests on submitted files alone.",
    },
    {
      title: "Risk scoring",
      description:
        "Signals from each check combine into one score rather than a simple pass or fail. Odd attempts get flagged for human review; clean ones clear on their own.",
    },
    {
      title: "Web and mobile clients",
      description:
        "A React web app and a React Native mobile app both talk to the exact same identity verification API, with mobile carrying the liveness step since camera capture works best there.",
    },
  ],
  architecture: {
    layers: [
      "React Web & React Native Clients",
      "REST API (Node.js / Express)",
      "Verification Pipeline",
      "AWS Rekognition + Third-Party Identity APIs",
      "Risk Scoring & MongoDB",
    ],
    explanation:
      "Both clients talk to the same REST API, so a check behaves identically whether it starts on web or mobile. The backend runs the full verification pipeline behind that shared layer.\n\nRoughly, it flows like this: React web and React Native clients call a REST API on Node.js and Express, which runs the verification pipeline through AWS Rekognition and third-party identity APIs, with results landing in MongoDB before risk scoring makes the final call.\n\nThe pipeline takes the submitted document, calls AWS Rekognition for face and document checks, calls third-party identity services for the supplied details, and records location along the way. Once results land in MongoDB, risk scoring weighs every signal and decides whether the attempt clears automatically or goes to a human.",
  },
  decisions: [
    {
      title: "Risk scoring over a single pass-or-fail check",
      why: "Choosing risk scoring over a single pass-or-fail check came from a simple truth: no individual signal settles identity on its own. A document can look valid while other signals don't quite add up. Rolling everything into one risk score keeps genuine users moving through the flow, while sending only the truly doubtful cases to a human reviewer.",
      tradeoff:
        "The trade-off is that a score needs thresholds, and setting one is always a judgment call. Too tight, and real users get blocked unnecessarily. Too loose, and the review queue fills with cases nobody actually needed to see.",
    },
    {
      title: "React Native alongside the web client",
      why: "Building React Native alongside the web client came from where liveness detection actually works best. It needs camera access and a guided capture flow, both of which perform far better on a phone than inside a browser, and most users finish that step on mobile regardless.",
      tradeoff:
        "The cost is maintaining two separate clients, which got manageable by keeping the underlying logic in one shared REST API rather than duplicating it across platforms.",
    },
    {
      title: "MongoDB for verification records",
      why: "MongoDB made sense for verification records because check types and outside providers all return different response shapes. A document store holds that variation exactly as it arrives, instead of flattening every provider's output just to fit a rigid schema.",
      tradeoff:
        "The trade-off is that the application itself has to keep records consistent on its own, since the database will accept shapes nobody actually intended.",
    },
    {
      title: "Managed services for face and document checks",
      why: "Leaning on managed services for face and document checks, rather than building that capability from scratch, came down to a simple reality: AWS Rekognition and established identity providers already do this work well, and matching that standard alone would take years. Compliance-sensitive work also benefits from tools built specifically for the job.",
      tradeoff:
        "The cost is a dependency on outside services, where their uptime, response speed, and pricing all become part of how this KYC platform behaves in production.",
    },
  ],
  tradeoffs: [
    "Outside services can be slow or briefly unavailable, and all of this happens while a real person waits on the other end. Failed calls had to be treated as a normal, expected case in the flow rather than a rare exception nobody planned for.",
    "Risk thresholds balance fraud detection against user friction directly, and every adjustment hits both sides at once. Tighten the score, and you catch more fraud, but you also block more genuine users along the way.",
    "Two clients and several outside identity services create a wide surface area to manage. Keeping the core logic in the backend, away from either client, is what kept the whole system manageable as it grew more complex over time.",
  ],
  stack: [
    { group: "Frontend", items: ["React", "React Native"] },
    { group: "Backend", items: ["Node.js", "Express.js", "REST API"] },
    { group: "Database", items: ["MongoDB"] },
    {
      group: "Verification services",
      items: ["AWS Rekognition", "third-party identity APIs", "geolocation"],
    },
  ],
  outcome: [
    "A KYC platform covering document verification, 3D liveness detection, and geolocation capture",
    "Risk scoring that flags suspicious attempts for compliance review instead of relying on a single pass-or-fail result",
    "Working integrations with AWS Rekognition and third-party identity services",
    "Web and mobile clients running on the exact same verification API",
    "And compliance workflows now supporting more than 100 client verifications",
  ],
  learned: [
    "When a decision rests on several separate signals, a score genuinely beats a plain yes or no. It keeps the underlying uncertainty visible instead of forcing it into a false binary.",
    "Leaning on outside services means their failures become part of your own product's behavior. Slow responses and missing data need to be designed for directly, not filed away as edge cases that probably won't happen.",
    "Shared logic in the backend is what makes two separate clients sustainable long-term. Copy verification rules onto each platform independently, and they'll drift apart from each other eventually, almost without fail.",
  ],
  faqs: [
    {
      question: "What does a KYC and identity verification platform actually do?",
      answer:
        "It confirms that a person is who they claim to be before a business opens an account or completes a transaction, typically combining document verification, liveness detection, and risk scoring into one process instead of relying on a single check.",
    },
    {
      question: "How does 3D liveness detection work?",
      answer:
        "It confirms a real person is present during verification, not a photo, screen, or pre-recorded video, usually by asking the user to complete a short guided action captured through the camera, something a static image can't convincingly reproduce.",
    },
    {
      question: "Why use a risk score instead of a simple pass or fail?",
      answer:
        "No single check in an identity verification flow is completely reliable by itself. A document can look valid while other signals don't line up. Combining several checks into one risk score routes doubtful cases to a human reviewer while letting genuinely clean attempts pass through without unnecessary delay.",
    },
    {
      question: "Why store verification records in MongoDB rather than a relational database?",
      answer:
        "Different checks and third-party identity providers return data in different shapes. MongoDB stores that as flexible documents rather than forcing every response into fixed rows and columns, which fits a system recording varied results from multiple outside services.",
    },
  ],
  imageAlt:
    "KYC and identity verification platform showing document verification and liveness detection steps",
  relatedSlugs: ["pms-hr-management-system", "philantro-ai-ngo-management-platform"],
  internalLinks: [
    {
      sentence:
        "Third-party integrations, REST APIs, and production React work run through most of what I build. See my",
      anchor: "API and integration experience",
      href: "/skills/",
    },
    {
      sentence: "Other production platforms and full-stack builds sit next to this one. Open the",
      anchor: "full list of projects",
      href: "/work/",
    },
    {
      sentence: "or check the",
      anchor: "identity verification and API integration services",
      href: "/services/backend-development/",
    },
  ],
  seo: {
    title: "Verify 360: KYC & Identity Verification Platform Project",
    description:
      "Verify 360 is a KYC and identity verification platform with document checks, 3D liveness detection, and risk scoring, built with React and Node.js.",
    ogTitle: "Verify 360: KYC & Identity Verification Platform Project",
    ogDescription:
      "Verify 360 is a KYC and identity verification platform with document checks, 3D liveness detection, and risk scoring, built with React and Node.js.",
    primaryTopic: "KYC and Identity Verification Platform",
    secondaryTopics: [
      "document verification",
      "3D liveness detection",
      "risk scoring",
      "AWS Rekognition",
      "third-party identity APIs",
      "React Native application",
      "Node.js REST API",
      "compliance workflows",
    ],
  },
};
