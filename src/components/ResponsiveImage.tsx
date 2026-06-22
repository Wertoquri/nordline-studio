type Props = { src: string; alt: string; className?: string; priority?: boolean; sizes?: string };
export function ResponsiveImage({ src, alt, className, priority = false, sizes = '(max-width: 768px) 100vw, 50vw' }: Props) {
  const widths = [480, 768, 1200, 1600];
  return <img className={className} src={`${src}?auto=format&fit=crop&w=1200&q=82`} srcSet={widths.map((w) => `${src}?auto=format&fit=crop&w=${w}&q=82 ${w}w`).join(', ')} sizes={sizes} width="1200" height="1500" alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />;
}
