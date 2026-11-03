import type { Certification, Education } from "./types";

export const education: Education[] = [
  {
    id: "thd",
    institution: "Deggendorf Institute of Technology (THD)",
    program: "Master's studies in Robotics",
    location: "Campus Cham, Bavaria, Germany",
    period: "Oct 2025 – present",
    details: [
      "Graduate studies in robotics alongside software engineering work.",
    ],
    // TODO(ali): confirm the official program title and degree type before launch.
    note: "Program title pending confirmation.",
  },
  {
    id: "fast-nuces",
    institution: "FAST – National University of Computer and Emerging Sciences",
    program: "B.Sc. Software Engineering",
    location: "Islamabad, Pakistan",
    period: "Aug 2020 – Jun 2024",
    details: [
      "Final-year project: DepEase, an academic project management and automated deployment platform.",
      "Coursework included data structures and algorithms, software design and patterns, databases, operating systems, computer networks, applied AI and cloud security.",
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: "aws-ccp",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    link: {
      label: "View credential",
      href: "https://www.credly.com/badges/89a36857-8372-4228-9794-13ded9bd8005",
      kind: "doc",
    },
  },
  {
    id: "aws-security-foundations",
    title: "AWS Academy Graduate – Cloud Security Foundations",
    issuer: "AWS Academy",
    year: "2024",
    link: {
      label: "View credential",
      href: "https://www.credly.com/badges/bf10a56b-a7a9-438a-88dc-a0d91648e357",
      kind: "doc",
    },
  },
];
