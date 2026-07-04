import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, clients, inventory, orders, attendance, InsertEmployee, InsertClient, InsertInventoryItem, InsertOrder, InsertAttendance } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Employee queries
export async function getEmployees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees);
}

export async function searchEmployees({
  query,
  department,
  position,
  status,
  limit = 10,
  offset = 0,
}: {
  query?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { data: [], total: 0, limit, offset, hasMore: false };

  let queryBuilder = db.select().from(employees);

  // Build WHERE conditions
  const conditions = [];

  if (query) {
    const q = `%${query}%`;
    // Note: This is a simplified approach. For production, use proper SQL LIKE or full-text search
    // conditions.push(or(
    //   like(employees.name, q),
    //   like(employees.email, q),
    //   like(employees.phone, q)
    // ));
  }

  if (department) {
    // conditions.push(eq(employees.department, department));
  }

  if (position) {
    // conditions.push(eq(employees.position, position));
  }

  if (status) {
    // conditions.push(eq(employees.status, status));
  }

  // For now, return all employees (mock implementation)
  const allEmployees = await queryBuilder;

  // Apply in-memory filtering for now
  let filtered = allEmployees;

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(e =>
      (e.name?.toLowerCase().includes(q) || false) ||
      (e.email?.toLowerCase().includes(q) || false) ||
      (e.phone?.includes(q) || false)
    );
  }

  if (department) {
    filtered = filtered.filter(e => e.department === department);
  }

  if (position) {
    filtered = filtered.filter(e => e.position === position);
  }

  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }

  const total = filtered.length;
  const results = filtered.slice(offset, offset + limit);

  return {
    data: results,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmployee(data: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(employees).values(data);
  return result;
}

// Client queries
export async function getClients() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clients);
}

export async function searchClients({
  query,
  city,
  status,
  minSpent,
  maxSpent,
  limit = 10,
  offset = 0,
}: {
  query?: string;
  city?: string;
  status?: 'active' | 'inactive' | 'prospect';
  minSpent?: number;
  maxSpent?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { data: [], total: 0, limit, offset, hasMore: false };

  let queryBuilder = db.select().from(clients);

  // For now, return all clients (mock implementation)
  const allClients = await queryBuilder;

  // Apply in-memory filtering
  let filtered = allClients;

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(c =>
      (c.name?.toLowerCase().includes(q) || false) ||
      (c.email?.toLowerCase().includes(q) || false) ||
      (c.phone?.includes(q) || false)
    );
  }

  if (city) {
    filtered = filtered.filter(c => c.city === city);
  }

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  if (minSpent !== undefined) {
    filtered = filtered.filter(c => {
      const spent = c.totalSpent ? parseFloat(c.totalSpent.toString()) : 0;
      return spent >= minSpent;
    });
  }

  if (maxSpent !== undefined) {
    filtered = filtered.filter(c => {
      const spent = c.totalSpent ? parseFloat(c.totalSpent.toString()) : 0;
      return spent <= maxSpent;
    });
  }

  const total = filtered.length;
  const results = filtered.slice(offset, offset + limit);

  return {
    data: results,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(data: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(clients).values(data);
}

// Inventory queries
export async function getInventory() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inventory);
}

export async function getInventoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inventory).where(eq(inventory.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createInventoryItem(data: InsertInventoryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(inventory).values(data);
}

// Order queries
export async function getOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(orders).values(data);
}

// Attendance queries
export async function getAttendance(employeeId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (employeeId) {
    return await db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
  }
  return await db.select().from(attendance);
}

export async function createAttendance(data: InsertAttendance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(attendance).values(data);
}
