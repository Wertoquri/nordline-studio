import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Project, SiteConfig } from '../siteConfig';
import { ResponsiveImage } from './ResponsiveImage';

export function ProjectModal({ project, config, onClose }: { project: Project | null; config: SiteConfig; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!project) return; const previous = document.activeElement as HTMLElement; closeRef.current?.focus(); document.body.classList.add('modal-open'); const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', key); return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', key); previous?.focus(); }; }, [project, onClose]);
  if (!project) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button ref={closeRef} className="icon-button" onClick={onClose} aria-label={config.a11y.close}><X /></button>
    <ResponsiveImage src={project.image} alt={project.alt} sizes="(max-width: 768px) 100vw, 55vw" />
    <div className="modal-copy"><p className="eyebrow">{project.type} · {project.area}</p><h2 id="modal-title">{project.title}</h2><p>{project.summary}</p><dl><div><dt>{config.projectModal.location}</dt><dd>{project.city}</dd></div><div><dt>{config.projectModal.scope}</dt><dd>{project.scope}</dd></div></dl><a href="#consultation" className="text-link" onClick={onClose}>{config.cta.similar} <span aria-hidden="true">↗</span></a></div>
  </section></div>;
}
