import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  check
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define user roles as a const object for better type safety and maintainability
export const USER_ROLES = {
  FOUNDER: "founder",
  INVESTOR: "investor",
  SUPPORT: "support",
  MODERATOR: "755940",
  ADMIN: "6203875"
} as const;

// Type for user roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Array of valid role values for check constraint
export const VALID_USER_ROLES = Object.values(USER_ROLES);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role")
    .notNull()
    .default(USER_ROLES.FOUNDER),
  banned: boolean("banned").$defaultFn(() => false).notNull(),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => ({
  roleCheck: check("role_check", sql`${table.role} IN (${sql.join(VALID_USER_ROLES.map(role => sql`${role}`), sql`, `)})`),
  banConstraint: check("ban_constraint", sql`
        (${table.banned} = false) OR
        (${table.banned} = true AND ${table.banReason} IS NOT NULL)
      `)
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
