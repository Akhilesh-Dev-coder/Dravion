import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import StudyMaterial from "@/models/study/StudyMaterial";
import Question from "@/models/study/Question";
import MCQ from "@/models/study/MCQ";

export async function ensureSeedData() {
  await dbConnect();

  const semesterCount = await Semester.countDocuments();
  if (semesterCount > 0) {
    return; // Already seeded
  }

  // 1. Create Semesters 1 to 6
  const semestersData = [
    { name: "Semester 1", number: 1, slug: "semester-1", description: "Fundamentals of Computer Science, Mathematics, and Basic Programming." },
    { name: "Semester 2", number: 2, slug: "semester-2", description: "Object Oriented Programming, Discrete Mathematics, and C Programming." },
    { name: "Semester 3", number: 3, slug: "semester-3", description: "Data Structures & Algorithms, Digital Electronics, and Database Systems." },
    { name: "Semester 4", number: 4, slug: "semester-4", description: "Java Programming, Operating Systems, Computer Networks, and Software Engineering." },
    { name: "Semester 5", number: 5, slug: "semester-5", description: "Web Development, Python Programming, Computer Architecture, and Security." },
    { name: "Semester 6", number: 6, slug: "semester-6", description: "Artificial Intelligence, Cloud Computing, Major Project, and Electives." },
  ];

  const createdSemesters = await Semester.insertMany(semestersData);

  const sem4 = createdSemesters.find((s) => s.number === 4) || createdSemesters[0];
  const sem3 = createdSemesters.find((s) => s.number === 3) || createdSemesters[0];

  // 2. Create Sample Subjects
  const javaSubject = await Subject.create({
    name: "Java Programming",
    code: "CS401",
    semesterId: sem4._id,
    slug: "java-programming",
    description: "Core Java concepts including String class, OOP principles, Exception Handling, and Multithreading.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
    published: true,
  });

  const dsSubject = await Subject.create({
    name: "Data Structures & Algorithms",
    code: "CS301",
    semesterId: sem3._id,
    slug: "data-structures",
    description: "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, and Sorting Algorithms.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
    published: true,
  });

  const osSubject = await Subject.create({
    name: "Operating Systems",
    code: "CS402",
    semesterId: sem4._id,
    slug: "operating-systems",
    description: "Process Management, CPU Scheduling, Memory Management, and File Systems.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    published: true,
  });

  // 3. Create Sample Chapters
  const stringChapter = await Chapter.create({
    name: "String Class & Methods",
    subjectId: javaSubject._id,
    chapterNumber: 1,
    slug: "string-class-methods",
    description: "In-depth study of String, StringBuilder, and StringBuffer classes in Java.",
    published: true,
  });

  const oopChapter = await Chapter.create({
    name: "Inheritance & Polymorphism",
    subjectId: javaSubject._id,
    chapterNumber: 2,
    slug: "inheritance-polymorphism",
    description: "Class hierarchies, method overriding, overloading, and abstract classes.",
    published: true,
  });

  const arrayChapter = await Chapter.create({
    name: "Arrays and Linked Lists",
    subjectId: dsSubject._id,
    chapterNumber: 1,
    slug: "arrays-and-linked-lists",
    description: "Memory allocation, traversal, insertion, and deletion operations.",
    published: true,
  });

  // Sample public PDF link for testing
  const samplePdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  // 4. Create Sample Study Materials
  await StudyMaterial.create([
    {
      title: "String Class Complete Notes",
      description: "Detailed handwritten & typed notes explaining String immutability, memory allocation in String Constant Pool, and key methods.",
      chapterId: stringChapter._id,
      subjectId: javaSubject._id,
      semesterId: sem4._id,
      type: "notes",
      fileUrl: samplePdfUrl,
      size: 1420000,
      pageCount: 18,
      downloadCount: 127,
      viewCount: 450,
      published: true,
    },
    {
      title: "Java Programming 2025 Previous Year Paper",
      description: "University semester 4 end-exam question paper with model solution keys.",
      chapterId: stringChapter._id,
      subjectId: javaSubject._id,
      semesterId: sem4._id,
      type: "question-paper",
      fileUrl: samplePdfUrl,
      size: 850000,
      pageCount: 6,
      year: 2025,
      downloadCount: 230,
      viewCount: 890,
      published: true,
    },
    {
      title: "Inheritance & Polymorphism Reference Notes",
      description: "Comprehensive notes with code examples on super keyword, interfaces, and dynamic binding.",
      chapterId: oopChapter._id,
      subjectId: javaSubject._id,
      semesterId: sem4._id,
      type: "notes",
      fileUrl: samplePdfUrl,
      size: 1980000,
      pageCount: 24,
      downloadCount: 89,
      viewCount: 310,
      published: true,
    },
    {
      title: "Data Structures - Linked List Operations PDF",
      description: "Singly and Doubly Linked Lists visual diagrams, algorithms, and C++/Java implementation.",
      chapterId: arrayChapter._id,
      subjectId: dsSubject._id,
      semesterId: sem3._id,
      type: "notes",
      fileUrl: samplePdfUrl,
      size: 2100000,
      pageCount: 14,
      downloadCount: 195,
      viewCount: 620,
      published: true,
    },
  ]);

  // 5. Create Sample Important Questions
  await Question.create([
    {
      question: "Explain String class immutability in Java and why strings are immutable.",
      answer: "Strings in Java are immutable for security, thread-safety, caching in String Pool, and performance optimization.",
      subjectId: javaSubject._id,
      chapterId: stringChapter._id,
      marks: 10,
      year: 2025,
      isImportant: true,
      published: true,
    },
    {
      question: "Differentiate between String, StringBuilder, and StringBuffer with code examples.",
      answer: "String is immutable. StringBuilder is mutable and non-thread-safe. StringBuffer is mutable and thread-safe (synchronized).",
      subjectId: javaSubject._id,
      chapterId: stringChapter._id,
      marks: 10,
      year: 2024,
      isImportant: true,
      published: true,
    },
    {
      question: "What is method overloading vs method overriding?",
      answer: "Overloading occurs within the same class with different parameters. Overriding occurs in a subclass with the same signature.",
      subjectId: javaSubject._id,
      chapterId: oopChapter._id,
      marks: 5,
      year: 2025,
      isImportant: true,
      published: true,
    },
  ]);

  // 6. Create Sample MCQs
  await MCQ.create([
    {
      question: "What is a String in Java?",
      options: ["Primitive datatype", "Class", "Operator", "Package"],
      correctAnswer: 1,
      explanation: "In Java, String is an object that represents a sequence of char values. It is a predefined class in java.lang package.",
      subjectId: javaSubject._id,
      chapterId: stringChapter._id,
      difficulty: "easy",
      published: true,
    },
    {
      question: "Which memory region holds String literals in Java?",
      options: ["Stack Memory", "Heap Memory (String Constant Pool)", "Native Stack", "Registers"],
      correctAnswer: 1,
      explanation: "String literals are stored in a special area of Heap memory known as the String Constant Pool (SCP).",
      subjectId: javaSubject._id,
      chapterId: stringChapter._id,
      difficulty: "medium",
      published: true,
    },
    {
      question: "Which of the following is MUTABLE in Java?",
      options: ["java.lang.String", "java.lang.StringBuilder", "java.lang.Integer", "java.lang.Double"],
      correctAnswer: 1,
      explanation: "StringBuilder and StringBuffer are mutable classes in Java.",
      subjectId: javaSubject._id,
      chapterId: stringChapter._id,
      difficulty: "easy",
      published: true,
    },
  ]);
}
