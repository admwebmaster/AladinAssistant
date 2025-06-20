import { users, quotes, type User, type InsertUser, type Quote } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getQuotes(): Promise<Quote[]>;
  getQuotesByUserId(userId: number): Promise<Quote[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<number, Quote>;
  private currentUserId: number;
  private currentQuoteId: number;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.currentUserId = 1;
    this.currentQuoteId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async getQuotesByUserId(userId: number): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(
      (quote) => quote.utenteApiId === userId,
    );
  }
}

export const storage = new MemStorage();
