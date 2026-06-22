import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Locale, SiteConfig } from '../siteConfig';
import { localizedPath } from '../siteConfig';
import { analytics } from '../lib/analytics';

export function Header({ config, locale }: { config: SiteConfig; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const base = locale === 'en' ? '/en' : '/';
  return <header className="site-header">
    <Link className="wordmark" to={base} aria-label={config.a11y.home}>NORDLINE<span>STUDIO</span></Link>
    <nav className={open ? 'nav open' : 'nav'} aria-label={config.a11y.nav}>
      {config.nav.map((item) => <a key={item.href} href={`${base === '/' ? '' : base}${item.href}`} onClick={() => setOpen(false)}>{item.label}</a>)}
      <a className="nav-phone" href={`tel:${config.phoneHref}`} onClick={() => analytics.track('phone_click', { placement: 'header' })}>{config.phone}</a>
      <span className="language" aria-label={config.a11y.language}>
        <Link className={locale === 'uk' ? 'active' : ''} aria-current={locale === 'uk' ? 'page' : undefined} to={localizedPath('uk', location.pathname)}>UA</Link>
        <span aria-hidden="true">/</span>
        <Link className={locale === 'en' ? 'active' : ''} aria-current={locale === 'en' ? 'page' : undefined} to={localizedPath('en', location.pathname)}>EN</Link>
      </span>
      <a className="button button-small" href={`${base === '/' ? '' : base}#consultation`} onClick={() => { analytics.track('cta_click', { placement: 'header' }); setOpen(false); }}>{config.cta.consultation}</a>
    </nav>
    <button className="menu-button" type="button" aria-label={open ? config.a11y.closeMenu : config.a11y.openMenu} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
}
