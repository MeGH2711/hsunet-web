/**
 * Presentation Slides Registry
 * Theme: Pristine Light Theme - Pure #ffffff (White) & #801214 (Ahmedabad University Crimson)
 * Architecture: HyperScale-UNet (ISLES 2026 / ATLAS 3.0)
 */

export const PRESENTATION_METADATA = {
  title: "HyperScale-UNet: Scale-Invariant Architecture for Ischemic Stroke Lesion Segmentation",
  subtitle: "A Single Architecture for Small (< 1.5 mL), Medium, and Large Lesions across 55 Clinical Sites",
  presenters: "Megh Patel and Konark Karia",
  institution: "School of Engineering and Applied Science",
  university: "Ahmedabad University",
  benchmark: "ATLAS 3.0 / ISLES 2026 Benchmark",
  logoUrl: "/au_logo.png",
  colors: {
    primary: "#801214",
    primaryDark: "#52090b",
    primaryLight: "#9e171a",
    white: "#ffffff",
    surface: "#ffffff",
    surfaceMuted: "#faf5f5",
    border: "rgba(128, 18, 20, 0.25)",
  },
};

export const SLIDES_CONFIG = [
  {
    id: "title",
    slideNumber: 1,
    hasSlideNumber: false, // Title slide must NOT have slide number
    navTitle: "Title & Cover",
    category: "HyperScale-UNet",
  },
  {
    id: "introduction",
    slideNumber: 2,
    hasSlideNumber: true, // Content slide MUST have slide number at bottom-right
    navTitle: "Project & Challenge",
    category: "Clinical Challenge",
  },
  {
    id: "architecture",
    slideNumber: 3,
    hasSlideNumber: true, // Content slide MUST have slide number at bottom-right
    navTitle: "Proposed Architecture",
    category: "HyperScale-UNet Spec",
  },
  {
    id: "references",
    slideNumber: 4,
    hasSlideNumber: true, // Content slide MUST have slide number at bottom-right
    navTitle: "Publications & References",
    category: "Academic Lineage",
  },
  {
    id: "conclusion",
    slideNumber: 5,
    hasSlideNumber: false, // Conclusion slide must NOT have slide number
    navTitle: "Conclusion & Q&A",
    category: "Discussion",
  },
];
