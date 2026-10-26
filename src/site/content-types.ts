export type PracticalSection = {
  eyebrow: string;
  heading: string;
  items: Array<{
    title: string;
    body: string;
    slug?: string;
    href?: string;
    linkLabel?: string;
  }>;
};
