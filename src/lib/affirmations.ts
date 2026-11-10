export const AFFIRMATION_CATEGORIES = [
  "Self-belief",
  "Confidence",
  "Personal growth",
  "Success",
  "Career",
  "Gratitude",
  "Discipline",
  "New beginnings",
] as const;

export type AffirmationCategory = (typeof AFFIRMATION_CATEGORIES)[number];

export interface Affirmation {
  id: string;
  category: AffirmationCategory;
  text: string;
  custom?: boolean;
  createdDate?: string;
}

export const AFFIRMATIONS: Affirmation[] = [
  {
    id: "a1",
    category: "Self-belief",
    text: "I trust the version of myself I am becoming.",
  },
  {
    id: "a2",
    category: "Self-belief",
    text: "I am allowed to take up space and be fully seen.",
  },
  {
    id: "a3",
    category: "Self-belief",
    text: "My worth is not something I have to earn.",
  },
  {
    id: "a4",
    category: "Self-belief",
    text: "I speak to myself with the kindness I give to others.",
  },
  {
    id: "a5",
    category: "Self-belief",
    text: "I am enough exactly as I am today.",
  },

  {
    id: "a6",
    category: "Confidence",
    text: "I move through my day with quiet, steady confidence.",
  },
  {
    id: "a7",
    category: "Confidence",
    text: "I am capable of far more than I give myself credit for.",
  },
  {
    id: "a8",
    category: "Confidence",
    text: "I do not need permission to believe in myself.",
  },
  {
    id: "a9",
    category: "Confidence",
    text: "My voice matters and I use it with clarity.",
  },
  {
    id: "a10",
    category: "Confidence",
    text: "I meet challenges with curiosity instead of fear.",
  },

  {
    id: "a11",
    category: "Personal growth",
    text: "Every small step is proof that I am changing.",
  },
  {
    id: "a12",
    category: "Personal growth",
    text: "I grow at my own pace and that is exactly right.",
  },
  {
    id: "a13",
    category: "Personal growth",
    text: "I release who I was to make room for who I am becoming.",
  },
  {
    id: "a14",
    category: "Personal growth",
    text: "Discomfort is a sign that I am expanding.",
  },
  {
    id: "a15",
    category: "Personal growth",
    text: "I am learning, not failing.",
  },

  {
    id: "a16",
    category: "Success",
    text: "I am ready to receive the good things I am working for.",
  },
  {
    id: "a17",
    category: "Success",
    text: "My consistency is building something beautiful.",
  },
  {
    id: "a18",
    category: "Success",
    text: "I attract opportunities that match my effort.",
  },
  {
    id: "a19",
    category: "Success",
    text: "Success is a rhythm I practise daily.",
  },
  {
    id: "a20",
    category: "Success",
    text: "I celebrate every win, especially the quiet ones.",
  },

  {
    id: "a21",
    category: "Career",
    text: "My work is valuable and I express that with confidence.",
  },
  {
    id: "a22",
    category: "Career",
    text: "I am the kind of person people trust with big things.",
  },
  {
    id: "a23",
    category: "Career",
    text: "I bring clarity and calm to everything I lead.",
  },
  {
    id: "a24",
    category: "Career",
    text: "Opportunities find me because I am prepared for them.",
  },

  {
    id: "a25",
    category: "Gratitude",
    text: "I notice the good in my life and it multiplies.",
  },
  {
    id: "a26",
    category: "Gratitude",
    text: "I am grateful for the version of me that keeps showing up.",
  },
  {
    id: "a27",
    category: "Gratitude",
    text: "Today I choose to appreciate what is already here.",
  },
  {
    id: "a28",
    category: "Gratitude",
    text: "The ordinary parts of my life are full of warmth.",
  },

  { id: "a29", category: "Discipline", text: "I keep my promises to myself." },
  {
    id: "a30",
    category: "Discipline",
    text: "My habits carry me on the days motivation does not.",
  },
  {
    id: "a31",
    category: "Discipline",
    text: "I choose restraint over shortcuts.",
  },
  {
    id: "a32",
    category: "Discipline",
    text: "I can do hard things slowly and consistently.",
  },

  {
    id: "a33",
    category: "New beginnings",
    text: "Every morning is a fresh page and I write on it.",
  },
  {
    id: "a34",
    category: "New beginnings",
    text: "I am at the beginning of something that will make sense later.",
  },
  {
    id: "a35",
    category: "New beginnings",
    text: "I walk forward lightly, without carrying old stories.",
  },
  {
    id: "a36",
    category: "New beginnings",
    text: "This chapter gets to be different.",
  },
];

export const DAILY_PROMPTS: string[] = [
  "What is one thing you are proud of yourself for this week?",
  "Where did you show up for yourself today, even quietly?",
  "What belief about yourself are you ready to release?",
  "Describe the version of you that you are calling in.",
  "What did you notice that made you feel grateful today?",
  "What is one small thing you can do tomorrow to feel closer to your intentions?",
  "What would you say to yourself if you spoke with complete kindness?",
  "Which habit is quietly changing you the most?",
];

export const MOTIVATIONS: string[] = [
  "Small steps taken daily become the person you are becoming.",
  "You are allowed to begin again, as many times as you need.",
  "Today does not have to be perfect to be meaningful.",
  "Your consistency is a form of self-respect.",
  "The version of you that you miss is still inside you, practising.",
  "Progress is quiet before it is obvious.",
];

export function affirmationOfTheDay(dateKey: string): Affirmation {
  const seed = dateKey.split("-").join("");
  const index = Number(seed) % AFFIRMATIONS.length;

  return AFFIRMATIONS[index];
}

export function promptOfTheDay(dateKey: string): string {
  const seed = dateKey.split("-").join("");

  return DAILY_PROMPTS[Number(seed) % DAILY_PROMPTS.length];
}

export function motivationOfTheDay(dateKey: string): string {
  const seed = dateKey.split("-").join("");

  return MOTIVATIONS[Number(seed) % MOTIVATIONS.length];
}
