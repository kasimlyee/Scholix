export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  type: "physical" | "ebook" | "audiobook" | "pdf";
  copies: number;
  available: number;
  publishedYear: number;
  coverImage?: string;
  barcode?: string;
  genre?: string;
  digitalFile?: string;
  reservations: number[];
  language: string;
  metadata?: {
    pages?: number;
    duration?: string;
    fileSize?: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "librarian";
  membershipDate: Date;
  booksBorrowed: number;
  contact: {
    phone: string;
    preferences: {
      notifications: "email" | "sms" | "push";
      language: string;
    };
  };
  borrowingHistory: BorrowRecord[];
}

export interface Transaction {
  id: number;
  userId: number;
  book: Book;
  type: "physical" | "digital";
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "Returned" | "Overdue" | "Borrowed";
  renewalCount: number;
  fineAmount: number;
}

export interface BorrowRecord {
  bookId: number;
  borrowDate: Date;
  returnDate?: Date;
  status: string;
}
