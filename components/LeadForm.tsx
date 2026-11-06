"use client";

// Formulário de lead — componente IDÊNTICO nas 3 LPs. Campos vêm de
// lib/steps.ts; validação, eventos, webhooks e redirecionamento vêm de
// lib/funnel.ts (específico de cada LP).
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLeadSession,
  startLeadSession,
  submitLead,
  toPhoneDisplay,
  toPhoneValue,
  validateStep,
  verifyBeforeSubmit,
  type FieldErrors,
} from "@/lib/funnel";
import { FORM } from "@/lib/landing";
import { EMPTY_ANSWERS, STEPS, type Answers } from "@/lib/steps";

export function LeadForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const sessionRef = useRef(createLeadSession());

  useEffect(() => {
    startLeadSession(sessionRef.current);
  }, []);

  function updateAnswer(id: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    for (const step of STEPS) {
      const err = validateStep(step.id, answers);
      if (err) nextErrors[step.id] = err;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    if (verifyBeforeSubmit) {
      setVerifying(true);
      const verifyErrors = await verifyBeforeSubmit(answers);
      setVerifying(false);
      if (verifyErrors) {
        setErrors((prev) => ({ ...prev, ...verifyErrors }));
        setSubmitting(false);
        return;
      }
    }

    router.push(submitLead(answers, sessionRef.current));
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-head">
        <p className="form-eyebrow">{FORM.eyebrow}</p>
        <h2 className="form-title">{FORM.title}</h2>
      </div>

      {STEPS.map((step) => {
        const error = errors[step.id];
        const errorId = `${step.id}-error`;
        return (
          <div className="field-group" key={step.id}>
            <label className="field-label" htmlFor={step.id}>
              {step.question}
            </label>

            {step.type === "select" ? (
              <select
                id={step.id}
                value={answers[step.id]}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(e) => updateAnswer(step.id, e.target.value)}
              >
                <option value="" disabled>
                  {step.placeholder}
                </option>
                {step.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : step.type === "tel" ? (
              <div className="phone-control">
                <span className="phone-prefix">+55</span>
                <input
                  id={step.id}
                  type="tel"
                  inputMode="numeric"
                  placeholder={step.placeholder}
                  autoComplete={step.autoComplete}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  value={toPhoneDisplay(answers[step.id])}
                  onChange={(e) => updateAnswer(step.id, toPhoneValue(e.target.value))}
                />
              </div>
            ) : (
              <input
                id={step.id}
                type={step.type}
                placeholder={step.placeholder}
                autoComplete={step.autoComplete}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                value={answers[step.id]}
                onChange={(e) => updateAnswer(step.id, e.target.value)}
              />
            )}

            {step.type !== "select" && step.helperText ? (
              <p className="helper-text">{step.helperText}</p>
            ) : null}
            {error ? (
              <p className="error-message" id={errorId} role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <button className="submit-button" type="submit" disabled={submitting}>
        {verifying ? FORM.verifying : FORM.submit}
        <span aria-hidden="true">→</span>
      </button>
      <p className="form-consent">{FORM.consent}</p>
    </form>
  );
}
