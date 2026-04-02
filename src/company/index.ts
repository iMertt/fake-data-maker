import { getRng, pickRandom } from "../utils/random";

const ADJECTIVES = [
  "Global",
  "Bright",
  "Swift",
  "Quantum",
  "Nova",
  "Summit",
  "Silver",
  "Blue",
  "Urban",
  "Pacific",
  "Apex",
  "North",
  "Digital",
  "Prime",
  "Vertex",
] as const;

const NOUNS = [
  "Systems",
  "Labs",
  "Solutions",
  "Works",
  "Dynamics",
  "Group",
  "Partners",
  "Holdings",
  "Ventures",
  "Industries",
  "Analytics",
  "Networks",
  "Media",
  "Robotics",
  "Cloud",
] as const;

const SUFFIXES = ["Ltd", "Inc", "A.Ş.", "GmbH", "LLC", "Corp"] as const;

const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Finance",
  "HR",
  "Sales",
  "Legal",
  "Design",
  "Operations",
  "Product",
  "Data",
] as const;

const JOB_TITLES = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "DevOps Engineer",
  "Sales Director",
  "HR Specialist",
  "Financial Controller",
  "Marketing Lead",
  "Customer Success Manager",
  "QA Engineer",
  "Security Engineer",
  "Technical Writer",
  "Solutions Architect",
  "Engineering Manager",
] as const;

/**
 * Generates a plausible company name.
 *
 * @returns A company name string.
 */
export const companyName = (): string => {
  const rng = getRng();
  const adj = pickRandom(ADJECTIVES);
  const noun = pickRandom(NOUNS);
  if (rng() < 0.65) {
    return `${adj} ${noun} ${pickRandom(SUFFIXES)}`;
  }
  return `${adj} ${noun}`;
};

/**
 * Random department name.
 *
 * @returns A department string.
 */
export const department = (): string => pickRandom(DEPARTMENTS);

/**
 * Random job title.
 *
 * @returns A job title string.
 */
export const jobTitle = (): string => pickRandom(JOB_TITLES);
