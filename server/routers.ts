import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const COOKIE_NAME = "session";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Supervisor-only procedure
const supervisorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!["admin", "supervisor"].includes(ctx.user?.role || "")) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Supervisor access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      return {
        totalEmployees: 45,
        totalClients: 28,
        presentToday: 42,
        pendingLeaves: 3,
        role: ctx.user?.role,
      };
    }),
  }),

  // Employee Management
  employees: router({
    search: supervisorProcedure
      .input(z.object({
        query: z.string().optional(),
        department: z.string().optional(),
        position: z.string().optional(),
        status: z.enum(['active', 'inactive', 'on_leave']).optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const { searchEmployees } = await import('./db');
        return await searchEmployees({
          query: input.query,
          department: input.department,
          position: input.position,
          status: input.status,
          limit: input.limit,
          offset: input.offset,
        });
      }),

    list: supervisorProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input }) => {
        // Mock data - replace with real DB queries
        return [
          {
            id: 1,
            name: "أحمد محمد",
            email: "ahmed@example.com",
            phone: "0501234567",
            position: "مهندس برمجيات",
            department: "التطوير",
            status: "active",
          },
          {
            id: 2,
            name: "فاطمة علي",
            email: "fatima@example.com",
            phone: "0502345678",
            position: "مدير المشاريع",
            department: "الإدارة",
            status: "active",
          },
        ];
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return {
          id: input.id,
          name: "أحمد محمد",
          email: "ahmed@example.com",
          phone: "0501234567",
          nationalId: "1234567890",
          position: "مهندس برمجيات",
          department: "التطوير",
          monthlySalary: 5000,
          dailySalary: 250,
          hireDate: "2022-01-15",
          address: "الرياض، المملكة العربية السعودية",
          emergencyContact: "محمد محمد",
          emergencyPhone: "0509876543",
          bankAccount: "1234567890",
          insuranceNumber: "INS123456",
          status: "active",
        };
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        nationalId: z.string().optional(),
        position: z.string().optional(),
        department: z.string().optional(),
        monthlySalary: z.string().optional(),
        dailySalary: z.string().optional(),
        hireDate: z.string().optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        bankAccount: z.string().optional(),
        insuranceNumber: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Mock creation - replace with real DB insert
        return { id: 3, ...input, status: "active" };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ input }) => {
        return { id: input.id, ...input.data };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return { success: true, id: input.id };
      }),
  }),

  // Client Management
  clients: router({
    search: supervisorProcedure
      .input(z.object({
        query: z.string().optional(),
        city: z.string().optional(),
        status: z.enum(['active', 'inactive', 'prospect']).optional(),
        minSpent: z.number().optional(),
        maxSpent: z.number().optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const { searchClients } = await import('./db');
        return await searchClients({
          query: input.query,
          city: input.city,
          status: input.status,
          minSpent: input.minSpent,
          maxSpent: input.maxSpent,
          limit: input.limit,
          offset: input.offset,
        });
      }),

    list: supervisorProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return [
          {
            id: 1,
            name: "شركة التقنية المتقدمة",
            email: "info@tech.com",
            phone: "0112345678",
            city: "الرياض",
            status: "active",
            totalSpent: 50000,
          },
          {
            id: 2,
            name: "مؤسسة الاستشارات الهندسية",
            email: "contact@eng.com",
            phone: "0112345679",
            city: "جدة",
            status: "active",
            totalSpent: 75000,
          },
        ];
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return {
          id: input.id,
          name: "شركة التقنية المتقدمة",
          email: "info@tech.com",
          phone: "0112345678",
          city: "الرياض",
          address: "الرياض، المملكة العربية السعودية",
          status: "active",
          totalOrders: 15,
          totalSpent: 50000,
        };
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { id: 3, ...input, status: "active" };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ input }) => {
        return { id: input.id, ...input.data };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return { success: true, id: input.id };
      }),
  }),

  // Attendance Management
  attendance: router({
    recordCheckIn: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        date: z.string(),
      }))
      .mutation(async ({ input }) => {
        return {
          success: true,
          employeeId: input.employeeId,
          checkIn: new Date().toLocaleTimeString('ar-SA'),
        };
      }),

    recordCheckOut: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        date: z.string(),
      }))
      .mutation(async ({ input }) => {
        return {
          success: true,
          employeeId: input.employeeId,
          checkOut: new Date().toLocaleTimeString('ar-SA'),
        };
      }),
  }),

  // Payroll Management
  payroll: router({
    calculate: supervisorProcedure
      .input(z.object({
        employeeId: z.number(),
        month: z.number(),
        year: z.number(),
        baseSalary: z.number(),
        workingDaysInMonth: z.number(),
        presentDays: z.number(),
        absentDays: z.number(),
      }))
      .query(async ({ input }) => {
        const dailySalary = input.baseSalary / input.workingDaysInMonth;
        const deduction = dailySalary * input.absentDays;
        const grossSalary = input.baseSalary;
        const netSalary = grossSalary - deduction;

        return {
          employeeId: input.employeeId,
          month: input.month,
          year: input.year,
          grossSalary,
          deductions: deduction,
          netSalary,
        };
      }),
  }),

  // Reports
  reports: router({
    exportPayroll: supervisorProcedure
      .input(z.object({
        month: z.number(),
        year: z.number(),
        format: z.enum(['excel', 'pdf']),
      }))
      .query(async ({ input }) => {
        return {
          success: true,
          fileName: `payroll_${input.month}_${input.year}.${input.format === 'excel' ? 'xlsx' : 'pdf'}`,
          downloadUrl: `/api/reports/payroll/${input.month}/${input.year}`,
        };
      }),

    exportAttendance: supervisorProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
        format: z.enum(['excel', 'pdf']),
      }))
      .query(async ({ input }) => {
        return {
          success: true,
          fileName: `attendance_${input.startDate}_${input.endDate}.${input.format === 'excel' ? 'xlsx' : 'pdf'}`,
          downloadUrl: `/api/reports/attendance/${input.startDate}/${input.endDate}`,
        };
      }),

    generateSalarySlip: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        month: z.number(),
        year: z.number(),
      }))
      .query(async ({ input }) => {
        return {
          success: true,
          fileName: `salary_slip_${input.employeeId}_${input.month}_${input.year}.pdf`,
          downloadUrl: `/api/reports/salary-slip/${input.employeeId}/${input.month}/${input.year}`,
        };
      }),

    getDashboardStats: protectedProcedure.query(async () => {
      return {
        totalEmployees: 45,
        totalClients: 28,
        totalOrders: 156,
        monthlyPayroll: 225000,
      };
    }),
  }),

  // Leaves Management
  leaves: router({
    getBalance: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        return {
          employeeId: input.employeeId,
          annualLeaveTotal: 30,
          annualLeaveUsed: 5,
          annualLeaveRemaining: 25,
          sickLeaveTotal: 15,
          sickLeaveUsed: 3,
          sickLeaveRemaining: 12,
        };
      }),
  }),

  // Advances Management
  advances: router({
    request: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        amount: z.string(),
        reason: z.string(),
      }))
      .mutation(async ({ input }) => {
        return {
          id: 1,
          employeeId: input.employeeId,
          amount: input.amount,
          reason: input.reason,
          status: 'pending',
          requestDate: new Date().toISOString(),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
