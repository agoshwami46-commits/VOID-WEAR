import { LeaderProfile } from '../types';

export const INITIAL_LEADERS: LeaderProfile[] = [
  {
    id: 'akash-goshwami',
    name: 'Akash Goshwami',
    designation: 'Founder & Creative Director',
    roleTag: 'FOUNDER & CREATIVE DIRECTOR',
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_8.20.07_PM_c34f4f08.jpeg',
    location: 'PANDEYPUR, VARANASI, UP, INDIA',
    bioQuote: '“VOID WEAR began with a simple, stubborn observation: genuine Indian youth culture was ready for luxury streetwear that didn’t cut corners on fabric weight, hardware durability, or boxy silhouette design. I built VOID WEAR from Varanasi to prove that world-class, uncompromising dark aesthetic fashion can be conceived, engineered, and delivered right here.”',
    phone: '8114150537',
    phoneDisplay: '+91 8114150537',
    whatsappMessage: "Hi Akash, I'd like to connect regarding VOID WEAR and your streetwear drops."
  },
  {
    id: 'shivam-giri',
    name: 'Shivam Giri',
    designation: 'Co-Founder & Managing Director',
    roleTag: 'CO-FOUNDER & MANAGING DIRECTOR',
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_8.42.41_PM_d7910b78.jpeg',
    location: 'PANDEYPUR, VARANASI, UP, INDIA',
    phone: '7985986280',
    phoneDisplay: '+91 7985986280',
    whatsappMessage: "Hi Shivam, I'd like to connect regarding VOID WEAR operations and management."
  }
];

const STORAGE_KEY = 'void_wear_leadership_profiles_v2';

export function getStoredLeadershipProfiles(): LeaderProfile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read stored leadership profiles', e);
  }
  return INITIAL_LEADERS;
}

export function saveStoredLeadershipProfiles(profiles: LeaderProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Could not save leadership profiles to localStorage', e);
  }
}
