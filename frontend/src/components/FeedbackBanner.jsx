function FeedbackBanner({ result }) {
  if (!result) {
    return null;
  }

  const className = result.kind === 'error' ? 'error-banner' : result.kind === 'success' ? 'success-banner' : 'info-banner';

  return (
    <div className={`feedback-banner ${className}`}>
      <strong>{result.title}</strong>
      <p>{result.message}</p>
    </div>
  );
}

export default FeedbackBanner;
