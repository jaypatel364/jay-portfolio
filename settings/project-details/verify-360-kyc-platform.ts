import type { ProjectDetail } from "./types";

export const verify360KycPlatformDetail: ProjectDetail = {
  slug: "verify-360-kyc-platform",
  intro:
    "Verify 360 is a KYC platform, the system a business uses to confirm that someone is who they claim to be before opening an account. It handles document verification, 3D liveness checks, and location tracking during verification, and it scores each attempt for risk so that suspicious cases get flagged for review. It was built with React and React Native on the front, and Node.js with MongoDB behind it.",
  ndaNotice:
    "This project was built for a production environment and cannot be documented publicly in full. What follows covers my responsibilities and the general engineering approach, without client details, internal data, or proprietary verification logic.",
  overview:
    "Identity verification is a sequence of checks rather than one action. A user submits an identity document, then completes a liveness check to prove a real person is present rather than a photo or a recording. Location is captured during the process, and third-party identity verification services are called to validate the details supplied.\n\nEach of those checks produces a signal, and on its own no single signal is conclusive. The platform combines them into a risk score, so a compliance team can concentrate on the cases that need a human decision instead of reviewing everything equally.\n\nThere are two clients, a React web application and a React Native mobile app, because liveness detection needs a camera and mobile is where most people complete that step.",
  role: [
    "Built the React web application and worked on the React Native mobile client",
    "Developed REST APIs on Node.js and Express for the verification flow",
    "Integrated AWS Rekognition for face and document checks",
    "Integrated third-party identity verification APIs",
    "Worked on real-time geolocation capture during verification",
    "Implemented the risk-scoring logic that flags suspicious verification attempts",
  ],
  problem:
    "Verification has to be strict enough to catch fraud and smooth enough that genuine users finish it. Every extra step loses real applicants, but a weak check lets bad ones through. The technical difficulty is that no individual signal settles it. A document can look valid, a face can match a photo, a location can be plausible, and the attempt can still be fraudulent. The system needed to combine several independent checks into one assessment, and do it while the user was waiting.",
  build:
    "Verification runs as a sequence of steps, each producing a result the next stage can use. Users start on either the React web app or the React Native mobile app; mobile matters here because liveness detection needs camera access and a guided capture flow.\n\nThe Node.js and Express backend coordinates the process. It handles document submission, calls AWS Rekognition for the face and document checks, and calls third-party identity verification services to validate the supplied details. Geolocation is captured as the user moves through the flow, giving another signal alongside the document and liveness results.\n\nMongoDB stores verification records. Different verification types and different third-party services return differently shaped responses, and a document store handles that variation without forcing every provider's output into one rigid schema.\n\nRisk scoring runs once the checks have completed. Rather than a single pass-or-fail, the signals are combined into a score that determines whether an attempt clears automatically or goes to a compliance reviewer.",
  features: [
    {
      title: "Document Verification",
      description:
        "Identity documents are submitted and checked as the first stage of verification. Everything after this point builds on whether the document itself holds up.",
    },
    {
      title: "3D Liveness Detection",
      description:
        "A liveness check confirms a real person is present rather than a photo, a screen, or a recording. This is what makes face matching meaningful, because without it a printed photograph could pass.",
    },
    {
      title: "Real-Time Geolocation",
      description:
        "Location is captured while the verification is happening, adding a signal that a document check alone cannot provide.",
    },
    {
      title: "Third-Party Identity Verification",
      description:
        "External identity services are called to validate the details a user supplies against sources outside the platform, so verification does not rest only on what was submitted.",
    },
    {
      title: "Risk Scoring",
      description:
        "The signals from each check are combined into a score rather than a simple pass or fail. Suspicious attempts get flagged for human review while straightforward ones clear without it.",
    },
    {
      title: "Web and Mobile Clients",
      description:
        "A React web application and a React Native mobile app both connect to the same APIs. Mobile carries the liveness step, since that is where camera-based capture works best.",
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
      "Both clients talk to the same REST API, so verification behaves consistently whether it is started on web or mobile. The backend runs the verification pipeline: it takes the submitted document, calls AWS Rekognition for the face and document checks, calls third-party identity services for the supplied details, and records geolocation along the way. Results are stored in MongoDB, and risk scoring combines the signals into an assessment that decides whether an attempt clears or goes to review.",
  },
  decisions: [
    {
      title: "Risk scoring instead of a single pass-or-fail check",
      why: "No individual check is conclusive. A document can look valid while other signals do not add up. Combining the signals into a score keeps genuine users moving while sending the uncertain cases to a person.",
      tradeoff:
        "A score needs thresholds, and thresholds are a judgement call. Set them too strictly and real users get blocked; too loosely and review queues fill with cases that did not need attention.",
    },
    {
      title: "React Native alongside the web client",
      why: "Liveness detection depends on camera access and a guided capture flow, which is far more reliable on a phone than in a browser. Most users complete that step on mobile.",
      tradeoff:
        "Two clients to build and keep in step. Sharing one REST API between them kept the verification logic in a single place rather than duplicated per platform.",
    },
    {
      title: "MongoDB for verification records",
      why: "Verification types and third-party providers return different response shapes. A document store holds that variation directly instead of flattening every provider's output into one fixed schema.",
      tradeoff:
        "Consistency has to be maintained by the application. Records need to be written carefully, since the database itself will accept shapes that were never intended.",
    },
    {
      title: "Managed services for face and document checks",
      why: "AWS Rekognition and established identity providers already do this work at a standard that would take a long time to approach independently, and compliance work benefits from services built for it.",
      tradeoff:
        "It creates a dependency on external services. Their availability, response times, and pricing all become part of the platform's behaviour.",
    },
  ],
  tradeoffs: [
    "Third-party services can be slow or briefly unavailable, and verification happens while a user is waiting. Failures in those calls had to be handled as an expected case rather than an exception.",
    "Risk thresholds are a balance between fraud and friction. Any change affects both sides, since tightening the score catches more fraud but also stops more genuine users.",
    "Two clients and several external services means the surface area is wide. Keeping the verification logic in the backend rather than in the clients was what kept that manageable.",
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
    "When a decision depends on several independent signals, scoring is more useful than a binary result. It preserves the uncertainty instead of discarding it.",
    "Depending on external services means their failures become your behaviour. Slow and unavailable responses have to be designed for, not treated as edge cases.",
    "Keeping shared logic in the backend is what makes multiple clients sustainable. Duplicating verification rules per platform would have guaranteed they drift.",
  ],
  imageAlt:
    "KYC and identity verification platform showing document verification and liveness detection steps",
  relatedSlugs: ["pms-hr-management-system", "philantro-ai-ngo-management-platform"],
  internalLinks: [
    {
      sentence:
        "Third-party integrations, REST APIs, and production React work run through most of what I build.",
      anchor: "See the technologies I work with",
      href: "/skills/",
    },
    {
      sentence:
        "There are more production platforms and full-stack applications alongside this one.",
      anchor: "Browse all of my work",
      href: "/work/",
    },
  ],
  seo: {
    title: "Verify 360 - KYC Platform | React Native, Node.js & AWS | Jay Patel",
    description:
      "A KYC and identity verification platform with document checks, 3D liveness detection, geolocation and risk scoring, built with React Native, Node.js and MongoDB.",
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
