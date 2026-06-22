import { useState } from 'react';
import type { SiteConfig } from '../siteConfig';

export function BeforeAfter({ content }: { content: SiteConfig['comparison'] }) {
  const [position, setPosition] = useState(52);
  const setFromPointer = (clientX: number, element: HTMLElement) => { const r = element.getBoundingClientRect(); setPosition(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100))); };
  return <div className="compare" style={{ '--position': `${position}%` } as React.CSSProperties} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setFromPointer(e.clientX, e.currentTarget); }} onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromPointer(e.clientX, e.currentTarget); }}>
    <img src={`${content.afterImage}?auto=format&fit=crop&w=1400&q=80`} width="1400" height="900" loading="lazy" alt={content.afterAlt} />
    <div className="compare-before"><img src={`${content.beforeImage}?auto=format&fit=crop&w=1400&q=80`} width="1400" height="900" loading="lazy" alt={content.beforeAlt} /></div>
    <span className="compare-label before">{content.before}</span><span className="compare-label after">{content.after}</span>
    <input aria-label={content.label} type="range" min="0" max="100" value={Math.round(position)} onChange={(e) => setPosition(Number(e.target.value))} />
  </div>;
}
