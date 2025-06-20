import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cognome: text("cognome"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id"),
  utenteApiId: integer("utente_api_id"),
  nome: text("nome").notNull(),
  cognome: text("cognome").notNull(),
  dataNascita: timestamp("data_nascita"),
  codiceFiscale: text("codice_fiscale"),
  indirizzo: text("indirizzo"),
  numeroTelefono: text("numero_telefono"),
  email: text("email"),
  occupazione: text("occupazione"),
  redditoMensile: decimal("reddito_mensile", { precision: 10, scale: 2 }),
  importoRichiesto: decimal("importo_richiesto", { precision: 10, scale: 2 }).notNull(),
  numeroRate: integer("numero_rate").notNull(),
  rataMensile: decimal("rata_mensile", { precision: 10, scale: 2 }).notNull(),
  finalita: text("finalita"),
  stato: text("stato").notNull().default("In attesa"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  nome: true,
  cognome: true,
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

export const registerSchema = z.object({
  nome: z.string().min(1, "Nome richiesto"),
  cognome: z.string().optional(),
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password deve essere di almeno 6 caratteri"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
