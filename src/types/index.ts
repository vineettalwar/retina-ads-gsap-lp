export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  video: string;
  poster: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface TestimonialCard {
  stars: string;
  rating: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}
