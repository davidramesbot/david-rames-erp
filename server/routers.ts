import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
            country: "السعودية",
            status: "active",
          },
          {
            id: 2,
            name: "مؤسسة الحلول الذكية",
            email: "info@smart.com",
            phone: "0112345679",
            city: "جدة",
            country: "السعودية",
            status: "active",
          },
        ];
      }),

    get: supervisorProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return {
          id: input.id,
          name: "شركة التقنية المتقدمة",
          email: "info@tech.com",
          phone: "0112345678",
          address: "شارع الملك فهد، الرياض",
          city: "الرياض",
          country: "السعودية",
          taxId: "123456789",
          contactPerson: "محمد أحمد",
          contactPhone: "0501111111",
          notes: "عميل VIP",
          status: "active",
        };
      }),

    create: supervisorProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
        contactPerson: z.string().optional(),
        contactPhone: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { id: 3, ...input, status: "active" };
      }),

    update: supervisorProcedure
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
        return { success: true, employeeId: input.employeeId, checkInTime: new Date() };
      }),

    recordCheckOut: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        date: z.string(),
      }))
      .mutation(async ({ input }) => {
        return { success: true, employeeId: input.employeeId, checkOutTime: new Date() };
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
        sickLeaveDays: z.number().optional(),
        annualLeaveDays: z.number().optional(),
        emergencyLeaveDays: z.number().optional(),
        advanceAmount: z.number().optional(),
        bonusAmount: z.number().optional(),
        insuranceDeduction: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const dailySalary = input.baseSalary / input.workingDaysInMonth;
        const salaryForPresentDays = dailySalary * input.presentDays;
        const absentDeduction = dailySalary * input.absentDays;
        const sickLeaveDeduction = (dailySalary * (input.sickLeaveDays || 0)) * 0.5;
        const emergencyLeaveDeduction = dailySalary * (input.emergencyLeaveDays || 0);
        const totalDeductions = absentDeduction + sickLeaveDeduction + emergencyLeaveDeduction + (input.advanceAmount || 0) + (input.insuranceDeduction || 0);
        const netSalary = salaryForPresentDays - totalDeductions + (input.bonusAmount || 0);

        return {
          employeeId: input.employeeId,
          month: input.month,
          year: input.year,
          baseSalary: input.baseSalary,
          salaryForPresentDays,
          totalDeductions,
          bonusAmount: input.bonusAmount || 0,
          netSalary: Math.max(0, netSalary),
          status: "draft",
        };
      }),
  }),

  // Leaves Management
  leaves: router({
    request: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        leaveType: z.enum(["annual", "sick", "emergency", "unpaid"]),
        startDate: z.string(),
        endDate: z.string(),
        numberOfDays: z.number(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { id: 1, ...input, status: "pending" };
      }),

    getBalance: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        return {
          annualLeaveTotal: 30,
          annualLeaveUsed: 10,
          annualLeaveRemaining: 20,
          sickLeaveTotal: 15,
          sickLeaveUsed: 3,
          sickLeaveRemaining: 12,
          emergencyLeaveTotal: 5,
          emergencyLeaveUsed: 1,
          emergencyLeaveRemaining: 4,
        };
      }),
  }),

  // Advances Management
  advances: router({
    request: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        amount: z.string(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { id: 1, ...input, status: "pending", requestDate: new Date() };
      }),
  }),
});

export type AppRouter = typeof appRouter;
