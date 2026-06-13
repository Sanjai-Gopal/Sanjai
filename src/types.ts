export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  accent: string;
  popular: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  result: string;
  accent: string;
  liveUrl?: string;
}

export interface Testimonial {
  name: string;
  business: string;
  location: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
}
