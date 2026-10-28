import { z } from 'zod';

export const roleGroups = [
  { title: 'Leadership & Governance', roles: [
    ['Advisory Council', 'Experienced people who bring funding, major connections, or specialist knowledge to steer Swap \'N\' Serve\'s direction. Meets quarterly.', 'Flexible / Quarterly', ['Share specialist advice and connections.', 'Help steer our direction at quarterly meetings.']],
    ['Team Leads', 'Run one of our teams day-to-day, coordinate volunteers and report progress.', '3–5 hrs/week', ['Coordinate your team and its volunteers.', 'Report progress and plan next steps.']],
    ['Volunteer Coordinator', 'Recruit, onboard and look after our volunteers, and match people to the right roles.', '3–5 hrs/week', ['Welcome and onboard volunteers.', 'Match people to roles and check in regularly.']],
    ['Secretary & Minutes Keeper', 'Take minutes at meetings, track decisions and keep our records organised.', '2 hrs/month', ['Record meeting minutes and decisions.', 'Keep shared records organised.']],
    ['Treasurer & Finance', 'Manage budgets, track income and spending, and prepare financial reports.', '2–4 hrs/month', ['Track income, spending and budgets.', 'Prepare clear financial reports.']],
  ] },
  { title: 'Growth', roles: [
    ['Fundraising & Partnerships', 'Secure sponsors, grants and donations, and manage relationships with businesses, colleges and community groups.', 'Flexible', ['Help secure sponsorship, grants and donations.', 'Build relationships with local partners.']],
    ['Marketing & Media', 'Promote our events, write press releases and build relationships with local radio, newspapers and TV.', 'Flexible', ['Promote events and write press releases.', 'Connect with local media.']],
    ['Social Media & Content', 'Run our socials, and create photos, videos and graphics for events and campaigns.', '2–4 hrs/week', ['Create event and campaign content.', 'Keep our social channels active.']],
  ] },
  { title: 'Events & Operations', roles: [
    ['Events & Logistics', 'Set up and pack down events, collect, sort and transport clothing donations, and manage stock. Drivers especially welcome.', 'Event days', ['Collect, sort and transport donations.', 'Help set up, run and pack down events.']],
    ['Food Team', 'Cooks, chefs and bakers who prepare food for our events and community days.', 'Event days', ['Prepare food for community days.', 'Work with the team on event catering.']],
  ] },
  { title: 'Youth & Community', roles: [
    ['Youth Workers & Mentors', 'Support and mentor young people through our events and the Swap \'N\' Serve Scholarships. Garda vetting required.', 'Flexible', ['Support and mentor young people.', 'Complete Garda vetting before this work.']],
    ['General Volunteers', 'Help on the day by welcoming attendees, running stalls and keeping things moving. No experience needed.', 'Event days', ['Welcome attendees and help on stalls.', 'Keep events running smoothly.']],
  ] },
  { title: 'Specialist Support', roles: [
    ['Legal & Compliance', 'Advise on governance, GDPR, insurance and charity regulations.', 'As needed', ['Advise on governance and data protection.', 'Help review insurance and charity requirements.']],
    ['Tech & Web', 'Help maintain our website, forms and digital tools.', 'As needed', ['Maintain our website and forms.', 'Improve our digital tools.']],
  ] },
] as const;
export const roleNames = roleGroups.flatMap(group => group.roles.map(role => role[0]));
export const availabilityOptions = ['Weekdays', 'Evenings', 'Weekends', 'Event days only'] as const;
export const referralOptions = ['Social media', 'Friend', 'Event', 'College', 'Other'] as const;
export const volunteerSchema = z.object({
  full_name: z.string().trim().min(1, 'Enter your full name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(255),
  phone: z.string().trim().max(30).regex(/^\+?[0-9 ()-]+$/, 'Enter a valid phone number.').refine(value => { const digits = value.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; }, 'Use a phone number with 7–15 digits.'),
  age_group: z.enum(['18+', 'Under 18'], { errorMap: () => ({ message: 'Select your age group.' }) }),
  roles: z.array(z.string().refine(value => roleNames.some(role => role === value))).min(1, 'Choose at least one role.').max(14),
  availability: z.array(z.enum(availabilityOptions)).min(1, 'Choose your availability.').max(4),
  skills: z.string().trim().max(2000),
  garda_vetting: z.enum(['Yes', 'No'], { errorMap: () => ({ message: 'Choose Yes or No for Garda vetting.' }) }),
  referral: z.enum(referralOptions, { errorMap: () => ({ message: 'Choose how you heard about us.' }) }),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to being contacted about volunteering.' }) }),
});
export const proposalSchema = z.object({
  full_name: z.string().trim().min(1, 'Enter your full name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(255),
  phone: z.string().trim().max(30).regex(/^\+?[0-9 ()-]+$/, 'Enter a valid phone number.').refine(value => { const digits = value.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; }, 'Use a phone number with 7–15 digits.'),
  age_group: z.enum(['18+', 'Under 18'], { errorMap: () => ({ message: 'Select your age group.' }) }),
  skills: z.string().trim().max(2000),
  proposal: z.string().trim().min(1, 'Tell us your idea.').max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to being contacted about your idea.' }) }),
});
