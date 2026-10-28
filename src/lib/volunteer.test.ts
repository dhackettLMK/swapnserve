import { describe, expect, it } from 'vitest';
import { roleNames, volunteerSchema } from './volunteer';
const application = { full_name: 'Test Volunteer', email: 'volunteer@example.org', phone: '+353 87 123 4567', age_group: '18+', roles: ['Tech & Web'], availability: ['Weekends'], skills: '', garda_vetting: 'Yes', referral: 'College', consent: true };
describe('volunteer application rules', () => {
  it('lists all 14 roles', () => { expect(roleNames).toHaveLength(14); expect(new Set(roleNames).size).toBe(14); });
  it('requires full name', () => { expect(volunteerSchema.safeParse({ ...application, full_name: '' }).success).toBe(false); });
  it('validates required email', () => { expect(volunteerSchema.safeParse({ ...application, email: 'invalid' }).success).toBe(false); expect(volunteerSchema.safeParse(application).success).toBe(true); });
  it('validates required phone', () => { for (const phone of ['', '123', 'call me', '+353 87 123 4567 ext']) expect(volunteerSchema.safeParse({ ...application, phone }).success).toBe(false); });
  it('requires explicit storage consent', () => { expect(volunteerSchema.safeParse({ ...application, consent: false }).success).toBe(false); });
  it('accepts under 18 applicants', () => { expect(volunteerSchema.safeParse({ ...application, age_group: 'Under 18' }).success).toBe(true); });
  it('accepts multiple of the listed roles', () => { expect(volunteerSchema.safeParse({ ...application, roles: ['Tech & Web', 'Food Team'] }).success).toBe(true); expect(volunteerSchema.safeParse({ ...application, roles: ['Not a role'] }).success).toBe(false); });
  it('accepts the four availability choices', () => { expect(volunteerSchema.safeParse({ ...application, availability: ['Weekdays', 'Evenings', 'Weekends', 'Event days only'] }).success).toBe(true); });
  it('makes skills optional', () => { expect(volunteerSchema.safeParse(application).success).toBe(true); });
  it('accepts No for Garda vetting', () => { expect(volunteerSchema.safeParse({ ...application, garda_vetting: 'No' }).success).toBe(true); });
});
