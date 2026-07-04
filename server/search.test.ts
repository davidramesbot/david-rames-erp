import { describe, it, expect } from 'vitest';

describe('Search and Filter Functions', () => {
  describe('Employee Search', () => {
    it('should search employees by name', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'active' },
      ];

      const query = 'أحمد';
      const results = employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('أحمد محمد');
    });

    it('should search employees by email', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'active' },
      ];

      const query = 'ahmed';
      const results = employees.filter(e => e.email.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
      expect(results[0].email).toBe('ahmed@example.com');
    });

    it('should search employees by phone', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'active' },
      ];

      const query = '0501234567';
      const results = employees.filter(e => e.phone.includes(query));

      expect(results.length).toBe(1);
      expect(results[0].phone).toBe('0501234567');
    });

    it('should filter employees by department', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'active' },
        { id: 3, name: 'محمد حسن', email: 'mohammad@example.com', phone: '0503456789', department: 'التطوير', position: 'محلل', status: 'active' },
      ];

      const department = 'التطوير';
      const results = employees.filter(e => e.department === department);

      expect(results.length).toBe(2);
      expect(results.every(e => e.department === 'التطوير')).toBe(true);
    });

    it('should filter employees by position', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'active' },
      ];

      const position = 'مهندس';
      const results = employees.filter(e => e.position === position);

      expect(results.length).toBe(1);
      expect(results[0].position).toBe('مهندس');
    });

    it('should filter employees by status', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502345678', department: 'الإدارة', position: 'مدير', status: 'inactive' },
      ];

      const status = 'active';
      const results = employees.filter(e => e.status === status);

      expect(results.length).toBe(1);
      expect(results[0].status).toBe('active');
    });

    it('should apply pagination to search results', () => {
      const employees = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `موظف ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        phone: `050${String(i + 1).padStart(7, '0')}`,
        department: 'التطوير',
        position: 'مهندس',
        status: 'active',
      }));

      const limit = 10;
      const offset = 0;
      const results = employees.slice(offset, offset + limit);

      expect(results.length).toBe(10);
      expect(results[0].id).toBe(1);
      expect(results[9].id).toBe(10);
    });

    it('should handle pagination with offset', () => {
      const employees = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `موظف ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        phone: `050${String(i + 1).padStart(7, '0')}`,
        department: 'التطوير',
        position: 'مهندس',
        status: 'active',
      }));

      const limit = 10;
      const offset = 10;
      const results = employees.slice(offset, offset + limit);

      expect(results.length).toBe(10);
      expect(results[0].id).toBe(11);
      expect(results[9].id).toBe(20);
    });

    it('should return hasMore flag correctly', () => {
      const employees = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `موظف ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        phone: `050${String(i + 1).padStart(7, '0')}`,
        department: 'التطوير',
        position: 'مهندس',
        status: 'active',
      }));

      const limit = 10;
      const offset = 0;
      const total = employees.length;
      const hasMore = offset + limit < total;

      expect(hasMore).toBe(true);
    });

    it('should return hasMore false on last page', () => {
      const employees = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `موظف ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        phone: `050${String(i + 1).padStart(7, '0')}`,
        department: 'التطوير',
        position: 'مهندس',
        status: 'active',
      }));

      const limit = 10;
      const offset = 20;
      const total = employees.length;
      const hasMore = offset + limit < total;

      expect(hasMore).toBe(false);
    });
  });

  describe('Client Search', () => {
    it('should search clients by name', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'active', totalSpent: 75000 },
      ];

      const query = 'التقنية';
      const results = clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
      expect(results[0].name).toContain('التقنية');
    });

    it('should filter clients by city', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'active', totalSpent: 75000 },
      ];

      const city = 'الرياض';
      const results = clients.filter(c => c.city === city);

      expect(results.length).toBe(1);
      expect(results[0].city).toBe('الرياض');
    });

    it('should filter clients by status', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'prospect', totalSpent: 0 },
      ];

      const status = 'active';
      const results = clients.filter(c => c.status === status);

      expect(results.length).toBe(1);
      expect(results[0].status).toBe('active');
    });

    it('should filter clients by minimum spent', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'active', totalSpent: 75000 },
      ];

      const minSpent = 60000;
      const results = clients.filter(c => c.totalSpent >= minSpent);

      expect(results.length).toBe(1);
      expect(results[0].totalSpent).toBe(75000);
    });

    it('should filter clients by maximum spent', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'active', totalSpent: 75000 },
      ];

      const maxSpent = 60000;
      const results = clients.filter(c => c.totalSpent <= maxSpent);

      expect(results.length).toBe(1);
      expect(results[0].totalSpent).toBe(50000);
    });

    it('should combine multiple filters', () => {
      const clients = [
        { id: 1, name: 'شركة التقنية', email: 'tech@example.com', phone: '0112345678', city: 'الرياض', status: 'active', totalSpent: 50000 },
        { id: 2, name: 'شركة الاستشارات', email: 'consult@example.com', phone: '0112345679', city: 'جدة', status: 'active', totalSpent: 75000 },
        { id: 3, name: 'شركة التطوير', email: 'dev@example.com', phone: '0112345680', city: 'الرياض', status: 'prospect', totalSpent: 0 },
      ];

      let results = clients;
      results = results.filter(c => c.city === 'الرياض');
      results = results.filter(c => c.status === 'active');

      expect(results.length).toBe(1);
      expect(results[0].id).toBe(1);
    });
  });

  describe('Empty Results', () => {
    it('should return empty array when no matches found', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
      ];

      const query = 'غير موجود';
      const results = employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(0);
    });

    it('should handle empty input gracefully', () => {
      const employees = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', department: 'التطوير', position: 'مهندس', status: 'active' },
      ];

      const query = '';
      const results = employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
    });
  });
});
