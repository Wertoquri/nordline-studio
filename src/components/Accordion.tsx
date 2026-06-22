import { useState } from 'react';
import { Plus } from 'lucide-react';
export function Accordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return <div className="accordion">{items.map((item, i) => <div className="accordion-item" key={item.q}><h3><button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}><span>{item.q}</span><Plus aria-hidden="true" /></button></h3><div id={`faq-${i}`} className="accordion-panel" hidden={open !== i}><p>{item.a}</p></div></div>)}</div>;
}
