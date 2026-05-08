import { useEffect } from 'react';
import { PortfolioData } from '../types';

export const useSEO = (data: PortfolioData | null) => {
  useEffect(() => {
    if (!data) return;

    const { personalInfo, about, navigation } = data;
    const siteTitle = `${personalInfo.name} | ${personalInfo.title}`;
    const siteDescription = about.description;
    const siteAuthor = personalInfo.name;
    const siteUrl = window.location.origin;
    const keywords = data.skills.hardSkills.items.join(', ');

    // Update standard tags
    document.title = siteTitle;
    updateMetaTag('description', siteDescription);
    updateMetaTag('author', siteAuthor);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', siteTitle, 'property');
    updateMetaTag('og:description', siteDescription, 'property');
    updateMetaTag('og:url', siteUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');
    // Assuming a default OG image if not provided in data
    updateMetaTag('og:image', `${siteUrl}/og-image.png`, 'property');

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', siteTitle, 'name');
    updateMetaTag('twitter:description', siteDescription, 'name');
    updateMetaTag('twitter:image', `${siteUrl}/og-image.png`, 'name');
    
    const twitterLink = navigation.socialLinks.find(link => link.name.toLowerCase() === 'x' || link.name.toLowerCase() === 'twitter');
    if (twitterLink) {
        const username = twitterLink.url.split('/').pop();
        if (username) updateMetaTag('twitter:site', `@${username}`, 'name');
    }

  }, [data]);
};

const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};
