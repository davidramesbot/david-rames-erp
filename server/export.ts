import { getEmployees, getAttendance } from './db';

export type ExcelRow = string[];

/**
 * Generate payroll Excel data
 */
export async function generatePayrollExcelData(month: number, year: number): Promise<ExcelRow[]> {
  const employees = await getEmployees();
  
  const headers: ExcelRow = [
    'الرقم',
    'اسم الموظف',
    'المنصب',
    'الراتب الأساسي',
    'أيام الحضور',
    'أيام الغياب',
    'الخصم',
    'الراتب النهائي',
    'التاريخ',
  ];

  const data: ExcelRow[] = [headers];

  employees.forEach((emp, index) => {
    const baseSalary = emp.salary ? parseFloat(emp.salary.toString()) : 0;
    const presentDays = 20;
    const absentDays = 2;
    const deduction = (absentDays / 30) * baseSalary;
    const finalSalary = baseSalary - deduction;

    data.push([
      (index + 1).toString(),
      emp.name,
      emp.position || '',
      baseSalary.toString(),
      presentDays.toString(),
      absentDays.toString(),
      deduction.toFixed(2),
      finalSalary.toFixed(2),
      `${month}/${year}`,
    ]);
  });

  return data;
}

/**
 * Generate attendance Excel data
 */
export async function generateAttendanceExcelData(startDate: string, endDate: string): Promise<ExcelRow[]> {
  const attendanceRecords = await getAttendance();
  
  const headers: ExcelRow = [
    'الرقم',
    'الموظف',
    'التاريخ',
    'الحضور',
    'الانصراف',
    'الحالة',
    'ملاحظات',
  ];

  const data: ExcelRow[] = [headers];

  attendanceRecords.forEach((record, index) => {
    const row: ExcelRow = [
      (index + 1).toString(),
      `موظف ${record.employeeId}`,
      record.date ? new Date(record.date).toLocaleDateString('ar-SA') : '',
      (record.checkIn as string) || '-',
      (record.checkOut as string) || '-',
      record.status as string,
      ((record.notes as string) || '') as string,
    ];
    data.push(row);
  });

  return data;
}

/**
 * Generate salary slip data as HTML
 */
export async function generateSalarySlipData(employeeId: number, month: number, year: number): Promise<string> {
  const employees = await getEmployees();
  const employee = employees.find(e => e.id === employeeId);

  if (!employee) {
    throw new Error('الموظف غير موجود');
  }

  const baseSalary = employee.salary ? parseFloat(employee.salary.toString()) : 0;
  const presentDays = 20;
  const absentDays = 2;
  const deduction = (absentDays / 30) * baseSalary;
  const finalSalary = baseSalary - deduction;

  const html: string = `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>كشف الراتب</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; direction: rtl; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 24px; font-weight: bold; }
    .company { font-size: 14px; color: #666; }
    .details { margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .label { font-weight: bold; }
    .total { font-weight: bold; font-size: 16px; margin-top: 20px; padding: 10px; background: #f0f0f0; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">كشف الراتب الشهري</div>
    <div class="company">شركة ديفيد رايمز</div>
  </div>

  <div class="details">
    <div class="row">
      <span class="label">اسم الموظف:</span>
      <span>${employee.name}</span>
    </div>
    <div class="row">
      <span class="label">المنصب:</span>
      <span>${employee.position || '-'}</span>
    </div>
    <div class="row">
      <span class="label">القسم:</span>
      <span>${employee.department || '-'}</span>
    </div>
    <div class="row">
      <span class="label">الفترة:</span>
      <span>${month}/${year}</span>
    </div>
  </div>

  <div class="details" style="margin-top: 30px;">
    <div class="row">
      <span class="label">الراتب الأساسي:</span>
      <span>${baseSalary.toFixed(2)} ر.س</span>
    </div>
    <div class="row">
      <span class="label">أيام الحضور:</span>
      <span>${presentDays} يوم</span>
    </div>
    <div class="row">
      <span class="label">أيام الغياب:</span>
      <span>${absentDays} يوم</span>
    </div>
    <div class="row">
      <span class="label">الخصم (الغياب):</span>
      <span>- ${deduction.toFixed(2)} ر.س</span>
    </div>
    <div class="row total">
      <span>الراتب النهائي:</span>
      <span>${finalSalary.toFixed(2)} ر.س</span>
    </div>
  </div>

  <div class="footer">
    <p>تم إنشاء هذا الكشف بواسطة نظام ERP</p>
    <p>${new Date().toLocaleDateString('ar-SA')}</p>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Convert array of arrays to CSV format
 */
export function arrayToCSV(data: ExcelRow[]): string {
  return data
    .map(row =>
      row
        .map(cell => {
          const str = cell.toString();
          if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');
}
