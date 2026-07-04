import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generatePayrollExcelData, generateAttendanceExcelData, generateSalarySlipData, arrayToCSV } from './export';
import * as db from './db';

// Mock database functions
vi.mock('./db', () => ({
  getEmployees: vi.fn(),
  getAttendance: vi.fn(),
}));

describe('Export Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generatePayrollExcelData', () => {
    it('should generate payroll data with correct headers', async () => {
      const mockEmployees = [
        {
          id: 1,
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '0501234567',
          position: 'مهندس',
          department: 'التطوير',
          salary: '5000.00',
          joiningDate: new Date('2022-01-15'),
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getEmployees).mockResolvedValue(mockEmployees);

      const result = await generatePayrollExcelData(7, 2026);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('الرقم');
      expect(result[0]).toContain('اسم الموظف');
      expect(result[0]).toContain('الراتب الأساسي');
    });

    it('should calculate salary deductions correctly', async () => {
      const mockEmployees = [
        {
          id: 1,
          name: 'فاطمة علي',
          email: 'fatima@example.com',
          phone: '0502345678',
          position: 'مدير',
          department: 'الإدارة',
          salary: '6000.00',
          joiningDate: new Date('2021-06-10'),
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getEmployees).mockResolvedValue(mockEmployees);

      const result = await generatePayrollExcelData(7, 2026);

      expect(result.length).toBe(2); // header + 1 employee
      expect(result[1]).toBeDefined();
      expect(result[1][3]).toBe('6000'); // base salary
    });

    it('should handle empty employee list', async () => {
      vi.mocked(db.getEmployees).mockResolvedValue([]);

      const result = await generatePayrollExcelData(7, 2026);

      expect(result.length).toBe(1); // only header
      expect(result[0]).toContain('الرقم');
    });
  });

  describe('generateAttendanceExcelData', () => {
    it('should generate attendance data with correct headers', async () => {
      const mockAttendance = [
        {
          id: 1,
          employeeId: 1,
          date: new Date('2026-07-01'),
          checkIn: '08:00',
          checkOut: '16:00',
          status: 'present' as const,
          notes: null,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getAttendance).mockResolvedValue(mockAttendance);

      const result = await generateAttendanceExcelData('2026-07-01', '2026-07-31');

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('الرقم');
      expect(result[0]).toContain('الموظف');
      expect(result[0]).toContain('الحالة');
    });

    it('should handle attendance records with missing times', async () => {
      const mockAttendance = [
        {
          id: 1,
          employeeId: 1,
          date: new Date('2026-07-01'),
          checkIn: null,
          checkOut: null,
          status: 'absent' as const,
          notes: 'في إجازة',
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getAttendance).mockResolvedValue(mockAttendance);

      const result = await generateAttendanceExcelData('2026-07-01', '2026-07-31');

      expect(result.length).toBe(2); // header + 1 record
      expect(result[1][3]).toBe('-'); // check-in should be '-'
      expect(result[1][4]).toBe('-'); // check-out should be '-'
    });

    it('should handle empty attendance list', async () => {
      vi.mocked(db.getAttendance).mockResolvedValue([]);

      const result = await generateAttendanceExcelData('2026-07-01', '2026-07-31');

      expect(result.length).toBe(1); // only header
    });
  });

  describe('generateSalarySlipData', () => {
    it('should generate salary slip HTML', async () => {
      const mockEmployees = [
        {
          id: 1,
          name: 'محمد أحمد',
          email: 'mohammad@example.com',
          phone: '0503456789',
          position: 'مهندس برمجيات',
          department: 'التطوير',
          salary: '5500.00',
          joiningDate: new Date('2020-01-15'),
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getEmployees).mockResolvedValue(mockEmployees);

      const result = await generateSalarySlipData(1, 7, 2026);

      expect(result).toBeDefined();
      expect(result).toContain('كشف الراتب');
      expect(result).toContain('محمد أحمد');
      expect(result).toContain('5500');
    });

    it('should throw error for non-existent employee', async () => {
      vi.mocked(db.getEmployees).mockResolvedValue([]);

      await expect(generateSalarySlipData(999, 7, 2026)).rejects.toThrow('الموظف غير موجود');
    });

    it('should include employee details in salary slip', async () => {
      const mockEmployees = [
        {
          id: 2,
          name: 'سارة علي',
          email: 'sarah@example.com',
          phone: '0504567890',
          position: 'محللة نظم',
          department: 'تحليل البيانات',
          salary: '4800.00',
          joiningDate: new Date('2021-03-20'),
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getEmployees).mockResolvedValue(mockEmployees);

      const result = await generateSalarySlipData(2, 7, 2026);

      expect(result).toContain('سارة علي');
      expect(result).toContain('محللة نظم');
      expect(result).toContain('تحليل البيانات');
    });
  });

  describe('arrayToCSV', () => {
    it('should convert array to CSV format', () => {
      const data = [
        ['الرقم', 'الاسم', 'المنصب'],
        ['1', 'أحمد', 'مهندس'],
        ['2', 'فاطمة', 'مدير'],
      ];

      const result = arrayToCSV(data);

      expect(result).toContain('الرقم');
      expect(result).toContain('أحمد');
      expect(result).toContain('فاطمة');
      expect(result.split('\n').length).toBe(3);
    });

    it('should escape quotes in CSV', () => {
      const data = [['الاسم', 'الملاحظات'], ['أحمد', 'ملاحظة \"مهمة\"']];

      const result = arrayToCSV(data);

      expect(result).toContain('\"\"');
    });

    it('should handle commas in data', () => {
      const data = [['الاسم', 'العنوان'], ['أحمد', 'الرياض، المملكة العربية السعودية']];

      const result = arrayToCSV(data);

      expect(result).toContain('الرياض');
      expect(result).toContain('المملكة');
    });

    it('should handle empty data', () => {
      const data: string[][] = [];

      const result = arrayToCSV(data);

      expect(result).toBe('');
    });
  });
});
