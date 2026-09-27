import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { person } from '../data/content';
import Section from './Section';

// EmailJS IDs are public by design. Restrict allowed origins in the EmailJS dashboard
// so they can't be reused from other sites.
const EMAILJS = {
  service: 'service_74o81x1',
  template: 'template_27u1v0o',
  publicKey: 'yVSScP3UIh4EX4ibz',
};
const COOLDOWN_MS = 60_000;

const field =
  'w-full rounded-[3px] border border-[var(--field)] bg-bg-primary px-3.5 py-2.5 text-[1rem] text-text-primary placeholder:text-text-muted/70 transition-colors focus:border-accent focus:outline-none';

const Contact = () => {
  const formRef = useRef(null);
  const lastSent = useRef(0);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | wait

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    // Bots fill every field; people never see this one.
    if (form.elements.company.value) return;
    if (Date.now() - lastSent.current < COOLDOWN_MS) {
      setStatus('wait');
      return;
    }
    setStatus('sending');
    try {
      await emailjs.sendForm(EMAILJS.service, EMAILJS.template, form, {
        publicKey: EMAILJS.publicKey,
        limitRate: { id: 'contact', throttle: COOLDOWN_MS },
        blockHeadless: true,
      });
      lastSent.current = Date.now();
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const message = {
    sent: 'Sent. I read everything and usually reply within a few days.',
    error: `That didn't go through. Try again, or email me at ${person.email}.`,
    wait: 'You just sent a message. Give it a minute before sending another.',
  }[status];

  return (
    <Section id="contact" title="Contact">
      <div className="grid max-w-[52rem] gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="prose-serif max-w-[34rem]">
          <p>
            I'm happy to talk about research, collaborations, internships, or anything you've read here. If you're
            working on inference, kernels, or interpretability and want another pair of hands, I'd especially like
            to hear from you.
          </p>
          <p>
            Email is the most reliable way to reach me:{' '}
            <a href={`mailto:${person.email}`} className="link">
              {person.email}
            </a>
            . The form goes to the same inbox.
          </p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4" noValidate={false}>
          <div>
            <label htmlFor="user_name" className="mb-1.5 block text-[0.875rem] text-text-secondary">Name</label>
            <input id="user_name" name="user_name" type="text" required maxLength={100} autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="user_email" className="mb-1.5 block text-[0.875rem] text-text-secondary">Email</label>
            <input id="user_email" name="user_email" type="email" required maxLength={200} autoComplete="email" className={field} />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-[0.875rem] text-text-secondary">Message</label>
            <textarea id="message" name="message" required rows={5} maxLength={5000} className={`${field} resize-y`} />
          </div>
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="cursor-pointer rounded-[3px] bg-text-primary px-4 py-2.5 text-[0.9375rem] font-medium text-bg-primary transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </div>
          <p role="status" aria-live="polite" className={`text-[0.9375rem] ${status === 'error' ? 'text-dot' : 'text-text-secondary'}`}>
            {message}
          </p>
        </form>
      </div>
    </Section>
  );
};

export default Contact;
