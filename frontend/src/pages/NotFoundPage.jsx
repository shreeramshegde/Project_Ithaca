import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="page-shell">
      <div className="page-content">
        <section className="surface-panel not-found-card">
          <p className="eyebrow">Lost at Sea</p>
          <h1 className="display-title">No Route Marked Here</h1>
          <p>The requested page does not exist in this voyage map.</p>
          <Link className="action-button" to="/">
            Return Home
          </Link>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
