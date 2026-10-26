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

export type WalkthroughStep = {
  label: string;
  title: string;
  body: string;
  fields?: string[];
};

export type ProductWalkthrough = {
  heading: string;
  name: string;
  position: 'left' | 'center' | 'right' | 'full';
  steps: WalkthroughStep[];
};
