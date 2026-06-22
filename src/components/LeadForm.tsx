import { useRef, useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leadSchema, type LeadInput } from '../lib/leadSchema';
import { analytics } from '../lib/analytics';
import type { Locale, SiteConfig } from '../siteConfig';
import { localizedPath } from '../siteConfig';

type Status = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
type Errors = Partial<Record<keyof LeadInput, string>>;

export function LeadForm({ config, locale }: { config: SiteConfig; locale: Locale }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const started = useRef(false);
  const copy = config.form;
  const formStart = () => { if (!started.current) { started.current = true; analytics.track('form_start'); } };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('validating'); setErrors({}); setFormError('');
    const raw = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = leadSchema.safeParse(raw);
    if (!result.success) {
      const next: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof LeadInput;
        if (next[key]) return;
        if (key === 'name') next[key] = copy.errors.name;
        if (key === 'contact') next[key] = String(raw.contact || '').trim() ? copy.errors.contactInvalid : copy.errors.contact;
        if (key === 'projectType') next[key] = copy.errors.projectType;
        if (key === 'area') next[key] = String(raw.area || '').trim() ? copy.errors.areaInvalid : copy.errors.area;
        if (key === 'message') next[key] = copy.errors.message;
      });
      setErrors(next); setStatus('error'); return;
    }
    setStatus('submitting');
    try {
      const response = await fetch(import.meta.env.VITE_API_URL || '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...result.data, locale }) });
      if (!response.ok) throw new Error('submit failed');
      analytics.track('lead_submit', { project_type: result.data.projectType, locale }); setStatus('success');
    } catch { setStatus('error'); setFormError(copy.serverError); }
  }

  if (status === 'success') return <div className="form-success" role="status"><Check /><p className="eyebrow">{copy.successEyebrow}</p><h3>{copy.successTitle}</h3><Link className="text-link" to={localizedPath(locale, '/thank-you')}>{copy.next}</Link></div>;
  const fieldError = (name: keyof LeadInput) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;

  return <form className="lead-form" onSubmit={submit} onFocus={formStart} noValidate aria-busy={status === 'submitting'}>
    <div className="field"><label htmlFor="name">{copy.name}</label><input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{fieldError('name')}</div>
    <div className="field"><label htmlFor="contact">{copy.contact}</label><input id="contact" name="contact" autoComplete="tel" placeholder={copy.contactPlaceholder} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'contact-error' : undefined} />{fieldError('contact')}</div>
    <div className="field"><label htmlFor="projectType">{copy.projectType}</label><select id="projectType" name="projectType" defaultValue="" aria-invalid={!!errors.projectType}><option value="" disabled>{copy.choose}</option>{copy.options.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>{fieldError('projectType')}</div>
    <div className="field"><label htmlFor="area">{copy.area}</label><input id="area" name="area" inputMode="decimal" placeholder={copy.areaPlaceholder} aria-invalid={!!errors.area} />{fieldError('area')}</div>
    <div className="field field-wide"><label htmlFor="message">{copy.message} <span>{copy.optional}</span></label><textarea id="message" name="message" rows={3} maxLength={1000} />{fieldError('message')}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-footer"><p>{copy.consent} <Link to={localizedPath(locale, '/privacy')}>{copy.privacy}</Link>.</p><button className="button button-light" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? <><LoaderCircle className="spin" /> {copy.submitting}</> : copy.submit}</button></div>
    <div className="status-message" role="alert" aria-live="polite">{formError}</div>
  </form>;
}
