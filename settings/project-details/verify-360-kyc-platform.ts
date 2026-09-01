import type { ProjectDetail } from "./types";

export const verify360KycPlatformDetail: ProjectDetail = {
  slug: "verify-360-kyc-platform",
  intro:
    "Verify 360 is a KYC and identity verification platform. It is what a business uses to confirm someone is who they say they are before opening an account. It runs document checks, 3D liveness detection, and location tracking. Each attempt then gets a risk score, so doubtful cases go to a person for review. React and React Native cover the front end. Node.js and MongoDB sit behind them.",
  ndaNotice:
    "A client owns this work, and the contract limits what I can share. So I have kept this to my own role and the shape of the system. The client, their data, and the exact rules behind the risk scoring are all left out.",
  overview:
    "Identity verification is a sequence of checks, not one action. A user submits an ID document. Then a liveness check proves a real person is there, not a photo or a screen recording. Location is captured along the way. Third-party identity services get called to confirm the details supplied.\n\nEach check gives off a signal, and no single signal settles anything on its own. The platform folds them into one risk score. A compliance team can then spend its time on the cases that need a human, and leave the clear ones alone.\n\nThere are two clients: a React web app and a React Native mobile app. Liveness detection needs a camera, and mobile is where most people finish that step.",
  role: [
    "Built the React web application and worked on the React Native mobile client",
    "Developed REST APIs on Node.js and Express for the verification flow",
    "Integrated AWS Rekognition for face and document checks",
    "Integrated third-party identity verification APIs",
    "Worked on real-time geolocation capture during verification",
    "Implemented the risk-scoring logic that flags suspicious verification attempts",
  ],
  problem:
    "Verification has to be strict enough to catch fraud and smooth enough that real users finish it. Every extra step costs you genuine applicants. Every weak check lets a bad one through. The hard part is that no single signal settles the question. A document can look valid, a face can match its photo, a location can seem fine, and the attempt can still be fake. So the system had to weigh several separate checks into one answer, and do it while the user sat waiting.",
  build:
    "Verification runs as a series of steps. Each one produces a result the next step can use. Users start on the React web app or the React Native mobile app. Mobile carries real weight here, because liveness detection needs camera access and a guided capture flow.\n\nThe Node.js and Express backend runs the whole process. It takes the document, calls AWS Rekognition for the face and document checks, then calls third-party identity services to confirm the details supplied. Location is captured as the user moves through the flow, which gives one more signal to weigh.\n\nMongoDB stores the verification records. Every check type and every outside service hands back a different response shape. A document store holds that variation as it arrives, with no rigid schema to squeeze it into.\n\nRisk scoring runs once the checks are done. There is no plain pass or fail. The signals combine into a score, and that score decides whether an attempt clears on its own or lands with a compliance reviewer.",
  features: [
    {
      title: "Document Verification",
      description:
        "An ID document is submitted and checked as the first stage. Everything after this leans on whether that document holds up.",
    },
    {
      title: "3D Liveness Detection",
      description:
        "A liveness check confirms a real person is there, not a photo, a screen, or a recording. It is what gives face matching any meaning. Without it, a printed photo could walk right through.",
    },
    {
      title: "Real-Time Geolocation",
      description:
        "Location is captured while the check is running. It adds a signal that no document check can give you on its own.",
    },
    {
      title: "Third-Party Identity Verification",
      description:
        "Outside identity services check the details a user gives against sources beyond the platform. The result never rests on the submitted files alone.",
    },
    {
      title: "Risk Scoring",
      description:
        "Signals from each check combine into a score, not a simple pass or fail. Odd attempts get flagged for human review. Clean ones clear on their own.",
    },
    {
      title: "Web and Mobile Clients",
      description:
        "A React web app and a React Native mobile app both talk to the same APIs. Mobile carries the liveness step, because camera capture works best on a phone.",
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
      "Both clients talk to the same REST API, so a check behaves the same whether it starts on web or mobile. The backend runs the pipeline. It takes the submitted document, calls AWS Rekognition for the face and document checks, calls third-party identity services for the supplied details, and records location along the way. Results land in MongoDB. Risk scoring then weighs the signals and decides whether an attempt clears or goes to review.",
  },
  decisions: [
    {
      title: "Risk scoring over a single pass-or-fail check",
      why: "No single check settles it. A document can look valid while the other signals do not add up. Rolling them into one score keeps real users moving and sends only the doubtful cases to a person.",
      tradeoff:
        "A score needs thresholds, and a threshold is a judgment call. Set it too tight and real users get blocked. Set it too loose and the review queue fills with cases nobody needed to see.",
    },
    {
      title: "React Native alongside the web client",
      why: "Liveness detection needs camera access and a guided capture flow. Both work far better on a phone than in a browser. Most users finish that step on mobile anyway.",
      tradeoff:
        "Two clients to build and keep in step. One shared REST API kept the logic in a single place, so nothing had to be written twice.",
    },
    {
      title: "MongoDB for verification records",
      why: "Check types and outside providers return different response shapes. A document store holds that variation as it is. A fixed schema would have flattened every provider's output to fit.",
      tradeoff:
        "The app has to keep records consistent on its own. The database will accept shapes nobody intended, so every write has to be careful.",
    },
    {
      title: "Managed services for face and document checks",
      why: "AWS Rekognition and the established identity providers already do this work well. Matching that standard alone would take years. Compliance work also benefits from services built for the job.",
      tradeoff:
        "It creates a dependency on outside services. Their uptime, their speed, and their pricing all become part of how the platform behaves.",
    },
  ],
  tradeoffs: [
    "Outside services can be slow or briefly down, and all of this happens while a user waits. Failed calls had to be treated as a normal case, not an exception.",
    "Risk thresholds balance fraud against friction. Every change hits both sides. Tighten the score and you catch more fraud, but you also stop more real users.",
    "Two clients and several outside services make for a wide surface area. Keeping the logic in the backend, well away from the clients, is what kept it manageable.",
  ],
  stack: [
    { group: "Frontend", items: ["React", "React Native"] },
    { group: "Backend", items: ["Node.js", "Express.js", "REST API"] },
    { group: "Database", items: ["MongoDB"] },
    {
      group: "Verification Services",
      items: ["AWS Rekognition", "Third-party identity APIs", "Geolocation"],
    },
  ],
  outcome: [
    "A KYC platform covering document verification, 3D liveness detection, and geolocation capture",
    "Risk scoring that flags suspicious attempts for compliance review instead of a single pass-or-fail result",
    "Integrations with AWS Rekognition and third-party identity verification services",
    "Web and mobile clients running on the same verification APIs",
    "Compliance workflows supporting 100+ client verifications",
  ],
  learned: [
    "When a decision rests on several separate signals, a score beats a yes or no. It keeps the uncertainty visible.",
    "Leaning on outside services means their failures become your behavior. Slow and missing responses need designing for, not filing under edge cases.",
    "Shared logic in the backend is what makes two clients sustainable. Copy the rules onto each platform and they will drift apart, guaranteed.",
  ],
  imageAlt:
    "KYC and identity verification platform showing document verification and liveness detection steps",
  relatedSlugs: ["pms-hr-management-system", "philantro-ai-ngo-management-platform"],
  internalLinks: [
    {
      sentence:
        "Third-party integrations, REST APIs, and production React work run through most of what I build.",
      anchor: "See my API and integration experience",
      href: "/skills/",
    },
    {
      sentence: "Other production platforms and full-stack builds sit next to this one.",
      anchor: "Open the full list of projects",
      href: "/work/",
    },
  ],
  seo: {
    title: "Verify 360 KYC Platform | React Native & Node.js | Jay Patel",
    description:
      "A KYC and identity verification platform with document checks, 3D liveness detection, geolocation and risk scoring, built with React Native and Node.js.",
    ogTitle: "Verify 360 - KYC & Identity Verification Platform",
    ogDescription:
      "An identity verification platform with document verification, 3D liveness detection, geolocation tracking and risk scoring, built on React, React Native and Node.js.",
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
