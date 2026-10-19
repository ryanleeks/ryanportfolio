export const site = {
  name: 'Calic Design',
  legalName: 'Calic Design',
  registration: '002596590-V',
  founded: 1998,
  url: 'https://calic.neutronast.com',
  description:
    'Calic Design is a Malaysian interior design and build studio, crafting timeless residential interiors across the Klang Valley since 1998.',
  serviceAreas: ['Ampang', 'Kajang', 'Klang', 'Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Subang Jaya'],
} as const;

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
] as const;

export const yearsActive = new Date().getFullYear() - site.founded;
