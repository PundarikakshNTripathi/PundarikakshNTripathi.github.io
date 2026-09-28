import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mode } from './store';
import './writer.css';

// On the live site the writer sits behind sign-in, two-factor (TOTP or phone/SMS, either satisfies
// aal2), and blog_admins membership. In local dev (no Supabase) it renders straight away. The database
// enforces the membership and aal2 rules independently (supabase/schema.sql); this screen is about
// getting a real admin to 'ready', not about protecting anything by itself.
export default function WriterGate({ children }) {
  const [state, setState] = useState(mode === 'cloud' ? null : { step: 'ready' });
  const [admin, setAdmin] = useState(mode === 'cloud' ? null : true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [enroll, setEnroll] = useState(null);
  const [factorType, setFactorType] = useState(null); // choice offered at the 'enroll' step

  const refresh = async () => {
    const { authState, isBlogAdmin } = await import('./cloud');
    const next = await authState();
    setState(next);
    setAdmin(next.step === 'ready' ? await isBlogAdmin() : null);
  };

  useEffect(() => {
    if (mode !== 'cloud') return undefined;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    import('./cloud')
      .then(async (c) => {
        const next = await c.authState();
        setState(next);
        setAdmin(next.step === 'ready' ? await c.isBlogAdmin() : null);
      })
      .catch((e) => setError(e.message));
    return () => meta.remove();
  }, []);

  // TOTP enrollment starts as soon as it's chosen; phone enrollment waits for a number.
  useEffect(() => {
    if (state?.step !== 'enroll' || factorType !== 'totp' || enroll) return;
    import('./cloud')
      .then((c) => c.startEnrollment('totp'))
      .then(setEnroll)
      .catch((e) => setError(e.message));
  }, [state, factorType, enroll]);

  // A returning phone factor needs its SMS challenge sent before the code field is useful.
  useEffect(() => {
    if (state?.step !== 'verify' || state.factorType !== 'phone' || enroll) return;
    import('./cloud')
      .then((c) => c.requestPhoneCode(state.factorId))
      .then((challengeId) => setEnroll({ challengeId }))
      .catch((e) => setError(e.message));
  }, [state, enroll]);

  const run = (fn) => async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await fn(new FormData(e.currentTarget));
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (state?.step === 'ready') {
    if (admin === null) return null; // still checking
    if (admin) return children;
    return (
      <div className="writer-gate">
        <div className="writer-gate-card">
          <p className="meta">Writer</p>
          <h1>Signed in</h1>
          <p className="writer-dialog-text">
            You're signed in and two-factor is set up, but this account isn't listed as a writer. There's
            nothing more to do here yet.
          </p>
          <button
            type="button"
            className="writer-primary mt-4"
            onClick={async () => {
              await (await import('./cloud')).signOut();
              await refresh();
            }}
          >
            Sign out
          </button>
          <Link to="/" className="link meta mt-6 inline-block">
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="writer-gate">
      <div className="writer-gate-card">
        <p className="meta">Sign in</p>
        {!state && !error && <p className="writer-dialog-text">Checking your session…</p>}

        {state?.step === 'signed-out' && (
          <form onSubmit={run(async (f) => (await import('./cloud')).signIn(f.get('email'), f.get('password')))}>
            <h1>Sign in</h1>
            <label className="writer-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="username" required autoFocus />
            </label>
            <label className="writer-field">
              <span>Password</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit" className="writer-primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        )}

        {state?.step === 'enroll' && !factorType && (
          <>
            <h1>Set up two-factor</h1>
            <p className="writer-dialog-text">Choose how you'd like to verify sign-ins from now on.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button type="button" className="writer-primary" onClick={() => setFactorType('totp')}>
                Authenticator app (recommended)
              </button>
              <button type="button" className="writer-primary" onClick={() => setFactorType('phone')}>
                Text message
              </button>
            </div>
          </>
        )}

        {state?.step === 'enroll' && factorType === 'totp' && (
          <form onSubmit={run(async (f) => (await import('./cloud')).verifyCode(enroll.factorId, f.get('code')))}>
            <h1>Scan this code</h1>
            <p className="writer-dialog-text">
              Scan this with an authenticator app (1Password, Google Authenticator, Aegis, Authy), then enter the
              six-digit code it shows. You'll need a code each time you sign in.
            </p>
            {enroll ? (
              <>
                <img src={enroll.qr} alt="QR code for your authenticator app" className="writer-qr" />
                <p className="meta">
                  Can't scan? Enter this key instead: <code className="font-mono break-all">{enroll.secret}</code>
                </p>
              </>
            ) : (
              <p className="writer-dialog-text">Preparing a code…</p>
            )}
            <label className="writer-field">
              <span>Six-digit code</span>
              <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus />
            </label>
            <button type="submit" className="writer-primary" disabled={busy || !enroll}>
              {busy ? 'Checking…' : 'Turn on two-factor'}
            </button>
            <button type="button" className="link meta mt-3 block" onClick={() => setFactorType(null)}>
              Use a different method
            </button>
          </form>
        )}

        {state?.step === 'enroll' && factorType === 'phone' && !enroll && (
          <form
            onSubmit={run(async (f) => {
              const { startEnrollment } = await import('./cloud');
              setEnroll(await startEnrollment('phone', f.get('phone')));
            })}
          >
            <h1>Text message</h1>
            <p className="writer-dialog-text">Enter your phone number. We'll text you a code to confirm it.</p>
            <label className="writer-field">
              <span>Phone number</span>
              <input name="phone" type="tel" placeholder="+14155551234" autoComplete="tel" required autoFocus />
            </label>
            <button type="submit" className="writer-primary" disabled={busy}>
              {busy ? 'Sending…' : 'Send code'}
            </button>
            <button type="button" className="link meta mt-3 block" onClick={() => setFactorType(null)}>
              Use a different method
            </button>
          </form>
        )}

        {state?.step === 'enroll' && factorType === 'phone' && enroll && (
          <form
            onSubmit={run(async (f) =>
              (await import('./cloud')).verifyCode(enroll.factorId, f.get('code'), enroll.challengeId)
            )}
          >
            <h1>Enter the code</h1>
            <p className="writer-dialog-text">We texted a six-digit code to your phone. Codes are valid for 5 minutes.</p>
            <label className="writer-field">
              <span>Six-digit code</span>
              <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus />
            </label>
            <button type="submit" className="writer-primary" disabled={busy}>
              {busy ? 'Checking…' : 'Turn on two-factor'}
            </button>
          </form>
        )}

        {state?.step === 'verify' && state.factorType === 'totp' && (
          <form onSubmit={run(async (f) => (await import('./cloud')).verifyCode(state.factorId, f.get('code')))}>
            <h1>Two-factor code</h1>
            <p className="writer-dialog-text">Enter the six-digit code from your authenticator app.</p>
            <label className="writer-field">
              <span>Code</span>
              <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus />
            </label>
            <button type="submit" className="writer-primary" disabled={busy}>
              {busy ? 'Checking…' : 'Verify'}
            </button>
          </form>
        )}

        {state?.step === 'verify' && state.factorType === 'phone' && (
          <form
            onSubmit={run(async (f) =>
              (await import('./cloud')).verifyCode(state.factorId, f.get('code'), enroll?.challengeId)
            )}
          >
            <h1>Two-factor code</h1>
            <p className="writer-dialog-text">
              {enroll ? 'Enter the six-digit code we just texted you.' : 'Sending a code to your phone…'}
            </p>
            <label className="writer-field">
              <span>Code</span>
              <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus />
            </label>
            <button type="submit" className="writer-primary" disabled={busy || !enroll}>
              {busy ? 'Checking…' : 'Verify'}
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="writer-error mt-4">
            {error}
          </p>
        )}
        <Link to="/" className="link meta mt-6 inline-block">
          Back to the site
        </Link>
      </div>
    </div>
  );
}
