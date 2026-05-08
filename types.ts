// FIX: Removed 'imagesloaded' module declaration that was causing a compilation error
// because the module could not be found, and it is not used in the project.

export interface Link {
  name: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface SkillsSection {
  title: string;
  items: string[];
}

export interface Quote {
  className: string;
  filterType: 'blur' | 'distortion';
  filterId: string;
  pathId: string;
  pathDefinition: string;
  text: string;
  viewBox: string;
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  navigation: {
    headerLinks: Link[];
    socialLinks: Link[];
  };
  about: {
    title: string;
    description: string;
  };
  projects: {
    title: string;
    items: Project[];
  };
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  skills: {
    title: string;
    hardSkills: SkillsSection;
    softSkills: SkillsSection;
  };
  quotes: Quote[];
  footer: {
    title: string;
    links: Link[];
  };
}
