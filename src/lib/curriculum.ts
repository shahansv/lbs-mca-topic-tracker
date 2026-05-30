export type SubjectKey = "cs" | "math" | "eng" | "quant" | "gk";

export interface Topic {
  code: string;
  name: string;
}

export interface Subject {
  name: string;
  key: SubjectKey;
  topics: Topic[];
}

export interface Day {
  day: number;
  exams?: string[];
  subjects: Subject[];
}

export const SUBJECT_META: Record<
  SubjectKey,
  { label: string; color: string; accent: string }
> = {
  cs: { label: "Computer Science", color: "#c084fc", accent: "#a855f7" },
  math: { label: "Mathematics", color: "#67e8f9", accent: "#06b6d4" },
  eng: { label: "English", color: "#86efac", accent: "#22c55e" },
  quant: {
    label: "Quantitative Aptitude",
    color: "#fde68a",
    accent: "#f59e0b",
  },
  gk: { label: "General Knowledge", color: "#fca5a5", accent: "#ef4444" },
};

export const CURRICULUM: Day[] = [
  {
    day: 1,
    subjects: [
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 1", name: "Logic & Algorithms" },
          { code: "CS 2", name: "Language Translators" },
          { code: "CS 3", name: "C Program Structure" },
        ],
      },
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 1", name: "Algebra & Operations" },
          { code: "Maths 3", name: "Algebraic Expansions" },
          { code: "Maths 5", name: "Factorisation Techniques" },
          { code: "Maths 7", name: "Quadratic Equations" },
          { code: "Maths 11", name: "Laws of Indices" },
          { code: "Maths 13", name: "Logarithm Basics & Practice" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 3", name: "Present Tense" }],
      },
    ],
  },
  {
    day: 2,
    exams: ["Week 1 (I) Exam"],
    subjects: [
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [{ code: "Quant 1", name: "Averages" }],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 4", name: "Introduction to C" },
          { code: "CS 5", name: "C Operators" },
          { code: "CS 6", name: "Decision Making" },
          { code: "CS 7", name: "Loops & Iterations" },
          { code: "CS 8", name: "Jump Statements" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 5", name: "Past Tense" }],
      },
    ],
  },
  {
    day: 3,
    exams: ["Week 2 (I) Exam"],
    subjects: [
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [{ code: "Quant 31", name: "Arrangements" }],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 9", name: "Functions & Recursions" },
          { code: "CS 10", name: "Arrays & Pointers" },
          { code: "CS 11", name: "Custom Data Types" },
          { code: "CS 12", name: "String Handling" },
          { code: "CS 13", name: "File Handling" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 7", name: "Future Tense" }],
      },
    ],
  },
  {
    day: 4,
    exams: ["Week 1 (II) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 15", name: "AP, GP, HP Progressions" },
          { code: "Maths 17", name: "Progressions Practice" },
        ],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 3", name: "Ratio & Proportion" },
          { code: "Quant 19", name: "Simple Interest" },
          { code: "Quant 21", name: "Compound Interest & Problem Solving" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 14", name: "Introduction to C++ (Part 1)" },
          { code: "CS 15", name: "Introduction to C++ (Part 2)" },
        ],
      },
    ],
  },
  {
    day: 5,
    exams: ["Week 2 (II) Exam", "Week 3 (I) Exam"],
    subjects: [
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 11", name: "Work & Time" },
          { code: "Quant 13", name: "Pipes & Cisterns" },
          { code: "Quant 23", name: "Profit & Loss" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [
          { code: "Eng 24", name: "Noun & Pronoun" },
          { code: "Eng 26", name: "Verb" },
          { code: "Eng 28", name: "Adjective & Adverb" },
        ],
      },
    ],
  },
  {
    day: 6,
    subjects: [
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 25", name: "Coding — Decoding" },
          { code: "Quant 27", name: "Number Series" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [
          { code: "Eng 30", name: "Prepositions & Conjunctions" },
          { code: "Eng 22", name: "Jumbled Sentence" },
          { code: "Eng 20", name: "Reading Comprehension" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 17", name: "Number Systems (Part 1)" },
          { code: "CS 18", name: "Number Systems (Part 2)" },
        ],
      },
    ],
  },
  {
    day: 7,
    exams: ["Week 4 (II) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 20", name: "Permutations & Combinations" },
          { code: "Maths 22", name: "P&C Problems & Solutions" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 20", name: "Integer Representation" },
          { code: "CS 21", name: "Fraction Representation" },
          { code: "CS 22", name: "Character Representation" },
          { code: "CS 23", name: "Binary Arithmetic" },
          { code: "CS 24", name: "Sign Arithmetic" },
        ],
      },
    ],
  },
  {
    day: 8,
    exams: ["Week 4 (I) Exam"],
    subjects: [
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 41", name: "Calendar Problems" },
          { code: "Quant 29", name: "Letter Series" },
          { code: "Quant 39", name: "Mixture & Allegation" },
        ],
      },
      {
        name: "Mathematics",
        key: "math",
        topics: [{ code: "Maths 18", name: "Binomial & Multinomial Theorems" }],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 15", name: "Sentence Correction" }],
      },
    ],
  },
  {
    day: 9,
    exams: ["Week 5 (I) Exam", "Week 5 (II) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 24", name: "Lines and Coordinates" },
          { code: "Maths 26", name: "Conic Sections" },
          { code: "Maths 28", name: "Geometric Transformations" },
          { code: "Maths 30", name: "Coordinate Geometry Practice" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 25", name: "Boolean Algebra" },
          { code: "CS 26", name: "Truth Tables" },
          { code: "CS 28", name: "Venn Diagrams" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 1", name: "Articles & Determiners" }],
      },
    ],
  },
  {
    day: 10,
    exams: ["Week 6 (I) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 36", name: "Probability Concepts" },
          { code: "Maths 38", name: "Probability Practice" },
        ],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [{ code: "Quant 43", name: "Clock Problems" }],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 34", name: "Computer Block Diagram" },
          { code: "CS 36", name: "Processor I/O Link" },
        ],
      },
    ],
  },
  {
    day: 11,
    exams: ["Week 6 (II) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 32", name: "Trigonometry Equations" },
          { code: "Maths 34", name: "Trigonometry Practice" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 27", name: "K-map Basics" },
          { code: "CS 30", name: "Digital Logic" },
          { code: "CS 31", name: "Combinational Circuits" },
          { code: "CS 32", name: "Sequential Circuits" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 19", name: "Essential Vocabulary Guide" }],
      },
    ],
  },
  {
    day: 12,
    exams: ["Week 7 (I) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 40", name: "Statistics Fundamentals" },
          { code: "Maths 42", name: "Statistics Practice" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 38", name: "Interrupt Handling" },
          { code: "CS 40", name: "CPU Organization" },
          { code: "CS 42", name: "CPU Instructions" },
          { code: "CS 44", name: "I/O Devices" },
        ],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [{ code: "Quant 15", name: "Time, Speed & Distance" }],
      },
    ],
  },
  {
    day: 13,
    exams: ["Week 8 (I) Exam"],
    subjects: [
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 46", name: "Primary Memory" },
          { code: "CS 48", name: "Secondary Storage" },
          { code: "CS 50", name: "Cache and Registers" },
          { code: "CS 51", name: "Virtual Memory Management" },
        ],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 17", name: "Boats & Streams" },
          { code: "Quant 37", name: "Directions" },
          { code: "Quant 9", name: "Partnership" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 9", name: "Question Tags" }],
      },
    ],
  },
  {
    day: 14,
    exams: ["Week 7 (II) Exam", "Week 8 (II) Exam"],
    subjects: [
      {
        name: "Mathematics",
        key: "math",
        topics: [
          { code: "Maths 44", name: "Mensuration Concepts" },
          { code: "Maths 46", name: "Mensuration Practice 1" },
          { code: "Maths 47", name: "Mensuration Practice 2" },
        ],
      },
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 53", name: "ACID Properties in DBMS" },
          { code: "CS 55", name: "ER Modeling & Relational Models" },
        ],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 33", name: "Syllogism" },
          { code: "Quant 7", name: "Problems on Ages" },
        ],
      },
    ],
  },
  {
    day: 15,
    exams: ["Week 3 (II) Exam", "Week 9 (I) Exam", "Week 9 (II) Exam"],
    subjects: [
      {
        name: "Computer Science",
        key: "cs",
        topics: [
          { code: "CS 57", name: "Database Normalization" },
          { code: "CS 59", name: "SQL Commands & Queries" },
        ],
      },
      {
        name: "English",
        key: "eng",
        topics: [{ code: "Eng 17", name: "Active & Passive Voice" }],
      },
      {
        name: "Quantitative Aptitude",
        key: "quant",
        topics: [
          { code: "Quant 5", name: "Percentage Concepts" },
          { code: "Quant 35", name: "Blood Relations" },
        ],
      },
    ],
  },
  {
    day: 16,
    subjects: [
      {
        name: "General Knowledge",
        key: "gk",
        topics: [
          { code: "GK 1", name: "Current Affairs" },
          { code: "GK 3", name: "Current Affairs" },
          { code: "GK 5", name: "Current Affairs" },
          { code: "GK 7", name: "Current Affairs" },
          { code: "GK 8", name: "Current Affairs" },
          { code: "GK 9", name: "Current Affairs" },
          { code: "GK 10", name: "Current Affairs" },
          { code: "GK 11", name: "Current Affairs" },
          { code: "CA Jan", name: "January Current Affairs" },
          { code: "CA Feb", name: "February Current Affairs" },
          { code: "CA Mar", name: "March Current Affairs" },
        ],
      },
    ],
  },
];
