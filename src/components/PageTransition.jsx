export function PageTransition({ transition }) {
  if (!transition) return null;
  return <div className={`page-transition is-${transition.phase}`} role="status" aria-label={transition.to}>
    <div className="page-transition__black" aria-hidden="true" />
    <div className="hero-title page-transition__title" aria-hidden="true">
      <span className="page-transition__from">{transition.from}</span>
      <span className="page-transition__to">{transition.to}</span>
    </div>
  </div>;
}
