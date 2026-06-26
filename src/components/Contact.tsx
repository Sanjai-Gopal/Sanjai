import React, { useState, useRef, useEffect, useCallback, useId, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ContactBg } from './BackgroundElements';
import { MessageCircle, Mail, MapPin, Linkedin, Instagram, Send, CircleCheck as CheckCircle2, Bot, CircleAlert as AlertCircle } from 'lucide-react';

/* ─── Types ─────────────────────────────── */
interface FormFields {
  name: string; email: string; phone: string;
  business: string; budget: string; description: string; _honey: string;
}
type FormErrors   = Partial<Record<keyof FormFields, string>>;
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';
interface ChatMessage { role: 'user' | 'assistant'; content: string; }

/* ─── Constants ─────────────────────────── */
const WA_NUMBER = '919363265552';
const EMAIL     = 'sanjai.sparkmail@gmail.com';

const BUDGET_OPTIONS = [
  { value: '',                  label: 'Select a budget range (optional)' },
  { value: 'Under ₹3,000',     label: 'Under ₹3,000'     },
  { value: '₹3,000 – ₹6,000',  label: '₹3,000 – ₹6,000'  },
  { value: '₹6,000 – ₹12,000', label: '₹6,000 – ₹12,000' },
  { value: '₹12,000 – ₹25,000',label: '₹12,000 – ₹25,000'},
  { value: 'Above ₹25,000',    label: 'Above ₹25,000'    },
  { value: 'Not sure yet',     label: 'Not sure yet'      },
];

const SUGGESTIONS = [
  'What services do you offer?',
  'How much does a website cost?',
  'How long does it take?',
  'What is the process?',
];

/* ─── Shared input styles ────────────────── */
const inputBase: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 14,
  fontSize: 14, border: '1.5px solid rgba(0,0,0,0.08)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  color: '#111', outline: 'none',
  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
  boxSizing: 'border-box', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, color: '#888',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
};

/* ─── Validation ────────────────────────── */
function validate(f: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = 'Full name is required.';
  if (!f.email.trim()) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email.';
  if (!f.phone.trim()) e.phone = 'Phone number is required.';
  else if (!/^[+\d\s\-()]{7,}$/.test(f.phone)) e.phone = 'Please enter a valid phone number.';
  if (!f.description.trim()) e.description = 'Please describe your project.';
  return e;
}

function FieldError({ msg, id }: { msg?: string; id?: string }) {
  if (!msg) return null;
  return (
    <p className="field-error-msg" role="alert" id={id}>
      <AlertCircle size={10} aria-hidden="true" /> {msg}
    </p>
  );
}

/* ─── AI Assistant ──────────────────────── */
function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm Sanjai's assistant. Ask me anything about services, pricing, timelines, or how to get started." },
  ]);
  const [input, setInput]    = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput(''); setApiError(null);
    const userMsg: ChatMessage = { role: 'user', content: q };
    const updated = [...messages, userMsg];
    setMessages(updated); setLoading(true);
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15000);
      let res: Response;
      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ message: q, history: updated.slice(1, -1) }),
        });
      } catch (err: unknown) {
        clearTimeout(tid);
        if (err instanceof Error && err.name === 'AbortError') {
          setMessages(p => [...p, { role: 'assistant', content: 'The request timed out. Please try again.' }]);
          return;
        }
        throw err;
      }
      clearTimeout(tid);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setMessages(p => [...p, { role: 'assistant', content: "You're sending messages too quickly. Please wait a moment." }]);
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setMessages(p => [...p, { role: 'assistant', content: data.reply }]);
    } catch {
      setApiError('Unable to connect. Please try again.');
      setMessages(p => [...p, { role: 'assistant', content: 'Sorry, having trouble connecting. Please WhatsApp me at +91 93632 65552.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const showSuggestions = messages.length === 1;
  const inputId = 'ai-chat-input';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 420 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 16, paddingBottom: 16,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <motion.div
          style={{
            width: 44, height: 44, borderRadius: 13,
            background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          aria-hidden="true"
        >
          <Bot size={18} color="#fff" aria-hidden="true" />
        </motion.div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }} id="ai-assistant-title">Sanjai's Assistant</div>
          <div style={{ fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, fontWeight: 600 }}>
            <motion.span
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <span>Online · Ask me anything</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="ai-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages with Sanjai's AI assistant"
        aria-relevant="additions"
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12, minHeight: 0, maxHeight: 260 }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '9px 13px',
              borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: m.role === 'user' ? '#111' : '#f5f5f0',
              color: m.role === 'user' ? '#fff' : '#333',
              fontSize: 13, lineHeight: 1.6,
              wordBreak: 'break-word',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '9px 14px', borderRadius: '14px 14px 14px 4px', background: '#f5f5f0', display: 'flex', gap: 4, alignItems: 'center' }} aria-label="Assistant is typing">
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#bbb', display: 'inline-block', animation: `aiDot 1.2s ${i*0.2}s infinite ease-in-out` }} aria-hidden="true" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {apiError && (
        <div role="alert" style={{ fontSize: 11, color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '7px 10px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <AlertCircle size={10} aria-hidden="true" /> {apiError}
        </div>
      )}

      {showSuggestions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }} role="group" aria-label="Suggested questions">
          {SUGGESTIONS.map(s => (
            <button key={s} type="button" onClick={() => send(s)}
              style={{ fontSize: 11, padding: '5px 11px', borderRadius: 99, border: '1px solid #e5e5e0', background: '#fff', color: '#555', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#15803d'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e0'; e.currentTarget.style.color = '#555'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }} role="group" aria-label="Send a message">
        <label htmlFor={inputId} className="sr-only">Ask a question</label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about services, pricing…"
          disabled={loading}
          aria-label="Type your question"
          maxLength={500}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 14,
            border: '1.5px solid rgba(0,0,0,0.08)',
            fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#111',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', minWidth: 0,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; e.currentTarget.style.background = '#fff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'; }}
        />
        <motion.button
          type="button" onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message"
          style={{
            width: 44, height: 44, borderRadius: 14,
            background: input.trim() ? 'linear-gradient(135deg, #111 0%, #222 100%)' : 'linear-gradient(135deg, #ebebeb 0%, #e0e0e0 100%)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0,
            boxShadow: input.trim() ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          }}
          whileHover={input.trim() ? { scale: 1.05 } : {}}
          whileTap={input.trim() ? { scale: 0.95 } : {}}
          transition={{ duration: 0.2 }}
        >
          <Send size={15} color={input.trim() ? '#fff' : '#bbb'} aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Contact Form ──────────────────────── */
function ContactForm() {
  const uid = useId();
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', phone: '', business: '', budget: '', description: '', _honey: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const change = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormFields]) setErrors(p => ({ ...p, [name]: undefined }));
  }, [errors]);

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#22c55e';
    e.currentTarget.style.background = '#fff';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12), 0 2px 8px rgba(0,0,0,0.04)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fe = validate(fields);
    const fieldName = e.target.name as keyof FormFields;
    if (fe[fieldName]) {
      setErrors(p => ({ ...p, [fieldName]: fe[fieldName] }));
      e.currentTarget.style.borderColor = '#ef4444';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
    } else {
      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
      e.currentTarget.style.boxShadow = 'none';
    }
    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fields._honey) return;
    const fe = validate(fields);
    if (Object.keys(fe).length > 0) { setErrors(fe); return; }
    setStatus('sending');
    try {
      const payload = {
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        business: fields.business || 'Not specified',
        budget: fields.budget || 'Not specified',
        message: fields.description,
        _subject: `New website enquiry from ${fields.name}`,
        _captcha: 'false',
        _template: 'table',
      };
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === 'true' || data.success === true)) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <CheckCircle2 size={52} color="#22c55e" style={{ margin: '0 auto 18px', display: 'block' }} aria-hidden="true" />
        <h3 className="display" style={{ fontWeight: 800, fontSize: 22, color: '#111', marginBottom: 10 }}>Message Received!</h3>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, marginBottom: 28 }}>
          Thank you, {fields.name.split(' ')[0]}. I'll review your enquiry and get back to you within a few hours.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=Hi Sanjai, I just submitted the contact form!`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark"
          style={{ justifyContent: 'center', fontSize: 14, display: 'inline-flex' }}
        >
          <MessageCircle size={15} aria-hidden="true" /> Follow up on WhatsApp
        </a>
      </div>
    );
  }

  const errId = (field: string) => `${uid}-${field}-err`;

  return (
    <form onSubmit={submit} noValidate aria-label="Project enquiry form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden', opacity: 0 }} aria-hidden="true">
        <input type="text" name="_honey" value={fields._honey} onChange={change} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div>
          <label htmlFor={`${uid}-name`} style={labelStyle}>Full Name <span aria-label="required">*</span></label>
          <input
            id={`${uid}-name`} type="text" name="name" required
            value={fields.name} onChange={change} onFocus={focusStyle} onBlur={blurStyle}
            placeholder="Your full name"
            style={{ ...inputBase, borderColor: errors.name ? '#ef4444' : '#e5e5e0' }}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? errId('name') : undefined}
          />
          <FieldError msg={errors.name} id={errId('name')} />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} style={labelStyle}>Email Address <span aria-label="required">*</span></label>
          <input
            id={`${uid}-email`} type="email" name="email" required
            value={fields.email} onChange={change} onFocus={focusStyle} onBlur={blurStyle}
            placeholder="you@example.com"
            style={{ ...inputBase, borderColor: errors.email ? '#ef4444' : '#e5e5e0' }}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? errId('email') : undefined}
          />
          <FieldError msg={errors.email} id={errId('email')} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor={`${uid}-phone`} style={labelStyle}>Phone / WhatsApp <span aria-label="required">*</span></label>
          <input
            id={`${uid}-phone`} type="tel" name="phone" required
            value={fields.phone} onChange={change} onFocus={focusStyle} onBlur={blurStyle}
            placeholder="+91 98765 43210"
            style={{ ...inputBase, borderColor: errors.phone ? '#ef4444' : '#e5e5e0' }}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? errId('phone') : undefined}
          />
          <FieldError msg={errors.phone} id={errId('phone')} />
        </div>
        <div>
          <label htmlFor={`${uid}-business`} style={labelStyle}>Business Type</label>
          <input
            id={`${uid}-business`} type="text" name="business"
            value={fields.business} onChange={change}
            onFocus={focusStyle}
            onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e0'; e.currentTarget.style.background = '#fafafa'; }}
            placeholder="Restaurant, Salon…"
            style={inputBase}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-budget`} style={labelStyle}>
          Budget <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <select
          id={`${uid}-budget`} name="budget" value={fields.budget} onChange={change}
          className="form-select"
          style={{ ...inputBase, color: fields.budget ? '#111' : '#aaa' }}
          onFocus={focusStyle}
          onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e0'; e.currentTarget.style.background = '#fafafa'; }}
        >
          {BUDGET_OPTIONS.map(o => (
            <option key={o.value} value={o.value} disabled={o.value === ''} style={{ color: '#111' }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${uid}-description`} style={labelStyle}>Project Description <span aria-label="required">*</span></label>
        <textarea
          id={`${uid}-description`} name="description" required rows={4}
          value={fields.description} onChange={change} onFocus={focusStyle} onBlur={blurStyle}
          placeholder="Tell me about your business and what kind of website you need. The more detail, the better."
          style={{ ...inputBase, resize: 'vertical', minHeight: 100, borderColor: errors.description ? '#ef4444' : '#e5e5e0' }}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? errId('description') : undefined}
        />
        <FieldError msg={errors.description} id={errId('description')} />
      </div>

      {status === 'error' && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#dc2626' }}>
          <AlertCircle size={14} aria-hidden="true" />
          Something went wrong. Please{' '}
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 700, marginLeft: 3 }}>
            WhatsApp me directly
          </a>.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn btn-dark"
        style={{ justifyContent: 'center', width: '100%', opacity: status === 'sending' ? 0.65 : 1, marginTop: 4, borderRadius: 14, fontSize: 15, padding: '16px' }}
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? (
          <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} aria-hidden="true" /> Sending…</>
        ) : (
          <><Send size={15} aria-hidden="true" /> Send Enquiry</>
        )}
      </button>

      <p style={{ fontSize: 12, color: '#888', margin: '2px 0', textAlign: 'center', lineHeight: 1.6 }}>
        Need to provide more details?{' '}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfBG5V0Z_Vj5QJZ2VZMu1EfBg2y0wieplMBOmBeNnH6r-L3Zw/viewform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(34,197,94,0.35)', transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#22c55e'; (e.currentTarget as HTMLAnchorElement).style.color = '#16a34a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(34,197,94,0.35)'; (e.currentTarget as HTMLAnchorElement).style.color = '#22c55e'; }}
        >
          Fill out the complete enquiry form
        </a>.
      </p>
      <p style={{ fontSize: 11, color: '#bbb', margin: 0, textAlign: 'center' }}>I reply to all enquiries within 24 hours.</p>
    </form>
  );
}

/* ─── Social + contact card data ────────── */
const SOCIAL_LINKS = [
  { Icon: Linkedin,  href: 'https://linkedin.com/in/sanjai2306', label: 'LinkedIn profile' },
  { Icon: Instagram, href: 'https://instagram.com/hey.sanjai_', label: 'Instagram profile' },
] as const;

const CONTACT_CARDS: ReadonlyArray<{
  Icon: React.ComponentType<{ size?: number; color?: string; 'aria-hidden'?: boolean }>;
  title: string; sub: string; subColor: string; iconBg: string; iconColor: string; border: string; href: string;
}> = [
  { Icon: MessageCircle, title: 'WhatsApp', sub: 'Fastest response', subColor: '#22c55e', iconBg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', iconColor: '#16a34a', border: '#bbf7d0', href: `https://wa.me/${WA_NUMBER}?text=Hi Sanjai, I need a website!` },
  { Icon: Mail,          title: 'Email',    sub: EMAIL,              subColor: '#888',    iconBg: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)', iconColor: '#555',    border: '#e8e8e3', href: `mailto:${EMAIL}` },
] as const;

/* ─── Main Contact section ──────────────── */
export default memo(function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section" style={{ background: '#f2f2ee', position: 'relative', overflow: 'hidden' }}>
      <ContactBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(36px, 5vw, 52px)' }}
        >
          <div className="label" aria-hidden="true">Contact</div>
          <h2 id="contact-heading" className="display" style={{
            fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111', marginBottom: 12,
          }}>
            Let's Work Together
          </h2>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.75, maxWidth: 460 }}>
            Tell me about your business and I'll get back to you within a few hours.
          </p>
        </motion.div>

        {/* 3-col layout */}
        <motion.div
          className="contact-layout"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Col 1 — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTACT_CARDS.map(({ Icon, title, sub, subColor, iconBg, iconColor, border, href }) => (
              <motion.a
                key={title} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={`Contact via ${title}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${border}`,
                  borderRadius: 18, padding: '16px 18px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  position: 'relative', overflow: 'hidden',
                }}
                whileHover={{ y: -3, scale: 1.01, boxShadow: '0 8px 28px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  style={{
                    width: 44, height: 44, borderRadius: 13, background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ duration: 0.25 }}
                >
                  <Icon size={18} color={iconColor} aria-hidden="true" />
                </motion.div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{title}</div>
                  <div style={{ fontSize: 12, color: subColor, marginTop: 2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
                </div>
              </motion.a>
            ))}

            <motion.div
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid #e8e8e3',
                borderRadius: 18, padding: '16px 18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} color="#555" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Location</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Salem, TN · Remote OK</div>
              </div>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              style={{
                background: 'linear-gradient(135deg, rgba(240,253,244,0.98) 0%, rgba(220,252,231,0.9) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid #bbf7d0',
                borderRadius: 18, padding: '18px 20px',
                boxShadow: '0 2px 12px rgba(34,197,94,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {['7-day delivery guaranteed', '100% satisfaction rate', '1 month free support', 'No payment upfront'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: i < 3 ? 10 : 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} aria-hidden="true" />
                  {t}
                </div>
              ))}
            </motion.div>

            <nav aria-label="Social media links" style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid #e8e8e3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                  whileHover={{
                    background: 'linear-gradient(135deg, #111 0%, #222 100%)',
                    borderColor: '#111', color: '#fff',
                    y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  }}
                  transition={{ duration: 0.22 }}
                >
                  <Icon size={16} aria-hidden="true" />
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Col 2 — Contact form */}
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 'clamp(24px, 3vw, 32px)',
              border: '1px solid rgba(255,255,255,0.6)',
              position: 'relative',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            {/* Inner highlight */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                borderRadius: '24px 24px 0 0',
                pointerEvents: 'none',
              }}
            />
            <h3 className="display" style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 22, position: 'relative' }}>
              Send an Enquiry
            </h3>
            <ContactForm />
          </motion.div>

          {/* Col 3 — AI */}
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 'clamp(24px, 3vw, 28px)',
              border: '1px solid rgba(255,255,255,0.6)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8)',
              position: 'relative',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            {/* Inner highlight */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                borderRadius: '24px 24px 0 0',
                pointerEvents: 'none',
              }}
            />
            <h3 className="display" style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 16, position: 'relative' }}>
              Ask Me Anything
            </h3>
            <AIAssistant />
          </motion.div>
        </motion.div>

        {/* Footer strip */}
        <motion.footer
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
            marginTop: 'clamp(48px, 7vw, 72px)', paddingTop: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="display"
            style={{ fontWeight: 800, fontSize: 20, color: '#111', letterSpacing: '-0.03em' }}
            whileHover={{ scale: 1.02 }}
          >
            sanjai
          </motion.div>
          <div style={{ fontSize: 12, color: '#aaa' }}>© 2026 Sanjai G · Web Designer &amp; Developer · Salem, TN</div>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 20 }}>
            {(['services', 'projects', 'contact'] as const).map(id => (
              <motion.button
                key={id} type="button"
                onClick={() => {
                  const el = document.getElementById(id);
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
                }}
                style={{ background: 'none', border: 'none', fontSize: 13, color: '#aaa', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit', padding: '4px 0' }}
                whileHover={{ color: '#111' }}
                transition={{ duration: 0.2 }}
              >
                {id}
              </motion.button>
            ))}
          </nav>
        </motion.footer>
      </div>
    </section>
  );
});
