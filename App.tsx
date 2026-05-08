import React, { useState, useEffect, useRef } from 'react';
import AnimatedSvgText from './components/AnimatedSvgText';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Link, Project, ExperienceItem, Quote } from './types';

// Loader component shown during preloading
const Loader: React.FC = () => (
    <>
        <div className="fixed top-0 left-0 w-full h-full bg-[#0a0104] z-50"></div>
        <div className="fixed top-1/2 left-1/2 w-[60px] h-[60px] -mt-[30px] -ml-[30px] rounded-full bg-[#5c5c5c] opacity-40 loader-anim z-50"></div>
    </>
);

// Project item component for the professional list view
interface ProjectItemProps {
    number: string;
    title: string;
    description: string;
    link?: string;
}
const ProjectItem: React.FC<ProjectItemProps> = ({ number, title, description, link }) => (
    <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="project-item">
        <div className="project-item-content">
            <span className="project-item-number">{number}</span>
            <div>
                <h3 className="project-item-title">{title}</h3>
                <p className="project-item-description">{description}</p>
            </div>
        </div>
        <span className="project-item-link-text">View Project →</span>
    </a>
);


// Animated Section Wrapper
interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
}
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <section ref={ref} className={`${className || ''} animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
            {children}
        </section>
    );
};


const App: React.FC = () => {
    const { data, loading, error } = usePortfolioData();

    if (loading) {
        return <Loader />;
    }
    
    if (error) {
        return <div className="text-white text-center p-8">Failed to load portfolio data. Please try again later.</div>
    }

    if (!data) {
        return null;
    }

    const { personalInfo, navigation, header, about, projects, experience, skills, quotes, footer } = data;

    return (
        <div className="font-poynter">
            <svg className="absolute pointer-events-none w-0 h-0 overflow-hidden">
                <defs>
                    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="0" result="blur" data-min-deviation="0" data-max-deviation="10"/>
                    </filter>
                    <filter id="blur2" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="0" result="glow" data-min-deviation="0" data-max-deviation="30"/>
                        <feColorMatrix result="bluralpha" type="matrix" values="0 -1 0 0 0 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1.8 0 "/>
                        <feOffset in="bluralpha" dx="0" dy="0" result="offsetBlur"/>
                        <feMerge>
                            <feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <filter id="distortionFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" data-min-scale="0" data-max-scale="100" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse"/>
                    </filter>
                </defs>
            </svg>

            <main className="w-full overflow-hidden relative">
                <div className="p-12 lg:px-10 lg:py-9 text-center uppercase relative z-40 lg:absolute lg:text-left lg:top-0 lg:left-0 lg:grid lg:grid-cols-[auto_1fr_auto] lg:grid-rows-[auto_1fr_auto] lg:w-full lg:max-w-none lg:h-screen lg:pointer-events-none lg:content-between">
                    <h2 className="my-4 text-base font-normal lg:m-0 lg:col-start-1 lg:row-start-1">{personalInfo.name}'s Portfolio</h2>
                    <div className="lg:col-start-1 lg:col-span-2 lg:row-start-3 flex flex-col lg:flex-row">
                        <h1 className="text-base my-0 mb-4 font-normal lg:m-0 lg:mr-16">{personalInfo.title}</h1>
                        <div className="inline">
                            {navigation.socialLinks.map((link: Link) => (
                                <a key={link.name} href={link.url} className="pointer-events-auto text-[#5c5c5c] hover:text-white mr-4">{link.name}</a>
                            ))}
                            <a href={`mailto:${personalInfo.email}`} className="pointer-events-auto text-[#5c5c5c] hover:text-white">Contact</a>
                        </div>
                    </div>
                    <nav className="hidden lg:block lg:col-start-3 lg:row-start-1 lg:p-0 lg:justify-self-end">
                        {navigation.headerLinks.map((link: Link) => (
                           <a key={link.name} href={link.url} className="pointer-events-auto text-[#5c5c5c] hover:text-white mr-4">{link.name}</a>
                        ))}
                    </nav>
                </div>

                <header className="pointer-events-none flex items-center justify-center flex-col min-h-screen">
                    <h1 className="text-[19vw] m-0 font-normal leading-none">{header.title}</h1>
                    <p className="relative uppercase mt-[8vh] mb-0 after:content-[''] after:absolute after:w-[1px] after:h-8 after:top-[calc(100%+2rem)] after:left-1/2 after:bg-current">{header.subtitle}</p>
                </header>
                
                <AnimatedSection className="my-60 mx-auto max-w-4xl px-6 text-center">
                     <h2 className="text-5xl lg:text-7xl mb-6">{about.title}</h2>
                     <p className="font-news-gothic text-lg leading-relaxed text-[#a0a0a0]">
                        {about.description}
                     </p>
                </AnimatedSection>

                <AnimatedSection className="my-60">
                    <h2 className="text-center text-5xl lg:text-7xl mb-24">{projects.title}</h2>
                    <div className="max-w-5xl mx-auto px-6">
                       {projects.items.map((project: Project) => (
                           <ProjectItem key={project.id} number={project.id} title={project.title} description={project.description} link={project.link} />
                       ))}
                    </div>
                </AnimatedSection>
                
                <AnimatedSection className="my-60 mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-5xl lg:text-7xl mb-12">{experience.title}</h2>
                    {experience.items.map((item: ExperienceItem, index: number) => (
                        <div key={index} className="border border-[#504f4f] p-8 text-left">
                            <h3 className="text-2xl uppercase text-[#8569c2] mb-2">{item.title}</h3>
                            <p className="font-news-gothic text-lg text-[#a0a0a0] mb-4">{item.company} | {item.duration}</p>
                            <p className="font-news-gothic leading-relaxed text-[#a0a0a0]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </AnimatedSection>

                <AnimatedSection className="my-60 mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-5xl lg:text-7xl mb-12">{skills.title}</h2>
                    <div className="font-news-gothic text-lg">
                        <div className="mb-8">
                            <h3 className="text-2xl uppercase text-[#8569c2] mb-4">{skills.hardSkills.title}</h3>
                            <div className="flex flex-wrap justify-center">
                                {skills.hardSkills.items.map((skill: string) => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl uppercase text-[#8569c2] mb-4">{skills.softSkills.title}</h3>
                            <div className="flex flex-wrap justify-center">
                                {skills.softSkills.items.map((skill: string) => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                
                <div className="my-60">
                    {quotes.map((quote: Quote, index: number) => (
                         <AnimatedSvgText key={index} {...quote} />
                    ))}
                </div>
                
                <footer className="p-12 text-center uppercase relative z-40">
                    <div className="border-t border-[#5c5c5c] max-w-5xl mx-auto pt-8">
                        <h3 className="text-2xl mb-6">{footer.title}</h3>
                        <div className="inline">
                            {footer.links.map((link: Link) => (
                                <a key={link.name} href={link.url} className="pointer-events-auto text-[#5c5c5c] hover:text-white mr-4">{link.name}</a>
                            ))}
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
};

export default App;
