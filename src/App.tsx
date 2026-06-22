import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { siteConfigs, localizedPath, type Locale, type Project, type SiteConfig } from './siteConfig';
import { Header } from './components/Header';
import { ResponsiveImage } from './components/ResponsiveImage';
import { ProjectModal } from './components/ProjectModal';
import { BeforeAfter } from './components/BeforeAfter';
import { Accordion } from './components/Accordion';
import { LeadForm } from './components/LeadForm';
import { analytics } from './lib/analytics';

const canonicalOrigin = 'https://nordline-studio-kyiv.vercel.app';
function pageHref(locale: Locale, hash: string) { return `${locale === 'en' ? '/en' : ''}${hash}`; }
function setMeta(config: SiteConfig, path: string) {
  document.documentElement.lang = config.locale;
  document.title = config.seo.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', config.seo.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', config.seo.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', config.seo.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${canonicalOrigin}${path}`);
}
function SectionHead({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) { return <div className="section-head reveal"><span>{number}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>; }

function Home({ locale }: { locale: Locale }) {
  const config = siteConfigs[locale];
  const [project, setProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setProject(null), []);
  useEffect(() => {
    setMeta(config, locale === 'en' ? '/en' : '/');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [config, locale]);
  const openProject = (item: Project) => { analytics.track('project_open', { project: item.id, locale }); setProject(item); };
  return <><a className="skip-link" href="#main">{config.a11y.skip}</a><Header config={config} locale={locale} /><main id="main">
    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy reveal"><p className="eyebrow">{config.hero.eyebrow}</p><h1 id="hero-title">{config.hero.title}</h1><div className="hero-details"><p>{config.hero.text}</p><p className="proof">{config.hero.proof}</p><div className="hero-actions"><a className="button" href={pageHref(locale, '#consultation')} onClick={() => analytics.track('cta_click', { placement: 'hero', locale })}>{config.cta.discuss}</a><a className="text-link" href={pageHref(locale, '#projects')}>{config.cta.works} <ArrowDown /></a></div></div></div><figure className="hero-image reveal"><ResponsiveImage src={config.hero.image} alt={config.hero.alt} priority sizes="(max-width: 768px) 100vw, 55vw" /><figcaption>{config.hero.caption}</figcaption></figure></section>
    <section className="trust" aria-label={locale === 'uk' ? 'Ключові факти' : 'Key facts'}>{config.facts.map((fact) => <div key={fact.value}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</section>
    <section className="section services" id="services"><SectionHead number="01" eyebrow={config.sections.services} title={config.sections.servicesTitle} /><div className="service-list">{config.services.map((service) => <article key={service.n} className="service reveal"><span>{service.n}</span><h3>{service.title}</h3><p>{service.text}</p><strong>{service.price}</strong></article>)}</div></section>
    <section className="section projects" id="projects"><SectionHead number="02" eyebrow={config.sections.projects} title={config.sections.projectsTitle} /><div className="project-grid">{config.projects.map((item, i) => <button className={`project-card project-${i + 1} reveal`} key={item.id} onClick={() => openProject(item)}><span className="project-image"><ResponsiveImage src={item.image} alt={item.alt} sizes={i === 0 ? '(max-width: 768px) 100vw, 62vw' : '(max-width: 768px) 100vw, 38vw'} /></span><span className="project-meta"><span><b>{item.title}</b><small>{item.type} · {item.area}</small></span><ArrowUpRight /></span></button>)}</div></section>
    <section className="section process" id="process"><SectionHead number="03" eyebrow={config.sections.process} title={config.sections.processTitle} /><ol className="timeline">{config.process.map((step) => <li key={step.n} className="reveal"><span>{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
    <section className="section comparison"><div className="comparison-copy reveal"><p className="eyebrow">{config.comparison.eyebrow}</p><h2>{config.comparison.title}</h2><p>{config.comparison.text}</p></div><BeforeAfter content={config.comparison} /></section>
    <section className="section philosophy"><div className="philosophy-visual reveal"><ResponsiveImage src={config.philosophy.image} alt={config.philosophy.alt} sizes="(max-width: 768px) 100vw, 42vw" /></div><div className="philosophy-copy reveal"><p className="eyebrow">{config.philosophy.eyebrow}</p><h2>{config.philosophy.title}</h2><p>{config.philosophy.text}</p><ul>{config.philosophy.notes.map((note) => <li key={note}><ChevronRight />{note}</li>)}</ul></div></section>
    <section className="section testimonials"><div className="testimonial-intro"><p className="eyebrow">{config.clientPriorities.eyebrow}</p><h2>{config.clientPriorities.title}</h2><p>{config.clientPriorities.text}</p></div><div>{config.clientPriorities.items.map((item) => <article className="reveal" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="section faq"><SectionHead number="04" eyebrow={config.sections.faq} title={config.sections.faqTitle} /><Accordion items={config.faqs} /></section>
    <section className="consultation" id="consultation"><div className="consultation-copy"><p className="eyebrow">{config.consultation.eyebrow}</p><h2>{config.consultation.title}</h2><p>{config.consultation.text}</p></div><LeadForm config={config} locale={locale} /></section>
    <section className="contact" id="contact"><div><p className="eyebrow">{config.contactBlock.eyebrow}</p><h2>{config.contactBlock.title}</h2><a className="contact-phone" href={`tel:${config.phoneHref}`} onClick={() => analytics.track('phone_click', { placement: 'contact', locale })}>{config.phone}</a><a href={`mailto:${config.email}`}>{config.email}</a></div><dl><div><dt>{config.contactBlock.work}</dt><dd>{config.contactBlock.area}<br />{config.contactBlock.hours}</dd></div><div><dt>{config.contactBlock.meetings}</dt><dd>{config.contactBlock.address}</dd></div><div><dt>{config.contactBlock.social}</dt><dd>{config.socials.map(x => <a key={x.label} href={x.href} target="_blank" rel="noreferrer">{x.label} ↗</a>)}</dd></div></dl><div className="map-placeholder" role="img" aria-label={config.contactBlock.map}><span>50.4501° N<br />30.5234° E</span><b>{config.contactBlock.city}</b></div></section>
  </main><Footer config={config} locale={locale} /><ProjectModal project={project} config={config} onClose={closeModal} /></>;
}

function LegalPage({ locale, thanks = false }: { locale: Locale; thanks?: boolean }) {
  const config = siteConfigs[locale];
  useEffect(() => { window.scrollTo(0, 0); setMeta(config, localizedPath(locale, thanks ? '/thank-you' : '/privacy')); }, [config, locale, thanks]);
  return <><a className="skip-link" href="#main">{config.a11y.skip}</a><Header config={config} locale={locale} /><main id="main" className="legal-page"><p className="eyebrow">Nordline Studio · Kyiv</p><h1>{thanks ? config.legal.thanksTitle : config.legal.privacyTitle}</h1>{thanks ? <><p>{config.legal.thanksText}</p><Link className="button" to={localizedPath(locale)}>{config.legal.back}</Link></> : <div className="legal-copy"><p>{config.legal.privacyIntro}</p><h2>{config.legal.dataTitle}</h2><p>{config.legal.dataText}</p><h2>{config.legal.purposeTitle}</h2><p>{config.legal.purposeText}</p><h2>{config.legal.storageTitle}</h2><p>{config.legal.storageText}</p><Link className="text-link" to={localizedPath(locale)}>{config.legal.home}</Link></div>}</main><Footer config={config} locale={locale} /></>;
}

function Footer({ config, locale }: { config: SiteConfig; locale: Locale }) { return <footer className="footer"><Link className="wordmark" to={localizedPath(locale)}>NORDLINE<span>STUDIO</span></Link><p>© {new Date().getFullYear()} Nordline Studio</p><Link to={localizedPath(locale, '/privacy')}>{config.footer.privacy}</Link><p className="footer-note">{config.footer.descriptor}</p></footer>; }

export default function App() { return <Routes>
  <Route path="/" element={<Home locale="uk" />} /><Route path="/en" element={<Home locale="en" />} />
  <Route path="/privacy" element={<LegalPage locale="uk" />} /><Route path="/en/privacy" element={<LegalPage locale="en" />} />
  <Route path="/thank-you" element={<LegalPage locale="uk" thanks />} /><Route path="/en/thank-you" element={<LegalPage locale="en" thanks />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>; }
