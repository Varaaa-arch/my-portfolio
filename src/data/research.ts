export interface ResearchNote {
  title: string;
  summary: string;
  date: string; // ISO: YYYY-MM-DD
}

export const research: ResearchNote[] = [
  { title: 'Research note one', summary: 'Ringkasan satu kalimat tentang topiknya.', date: '2026-09-15' },
  { title: 'Research note two', summary: 'Ringkasan satu kalimat tentang topiknya.', date: '2026-08-02' },
];
