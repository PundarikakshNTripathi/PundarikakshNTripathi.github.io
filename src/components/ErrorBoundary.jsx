import { Component } from 'react';

// If a lazy chunk fails to load (e.g. an old tab after a redeploy), show a way out instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <h1 className="display text-4xl">This page didn't load.</h1>
        <p className="prose-serif mt-6">
          The site may have been updated since you opened it.{' '}
          <button type="button" onClick={() => window.location.reload()} className="link cursor-pointer">
            Reload the page
          </button>
          .
        </p>
      </section>
    );
  }
}
