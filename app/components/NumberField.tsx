'use client';

import { useState } from 'react';

interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onCommit: (next: number) => void;
  /** Value committed when the field is left empty. Defaults to 0. */
  emptyValue?: number;
}

/**
 * A numeric input you can actually clear.
 *
 * The usual `parseInt(e.target.value) || 0` pattern turns an empty field into
 * NaN and then into 0, so the input immediately refills with "0" and the next
 * keystroke lands after it — clear the box, type 1, and you get "01".
 *
 * While the field is being edited this keeps the raw string in local state, so
 * an empty box stays empty and a leading zero can be deleted. The number is
 * committed on every valid keystroke, and on blur the draft is dropped so the
 * canonical value (no leading zeros) is what shows.
 */
export default function NumberField({ value, onCommit, emptyValue = 0, ...rest }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      {...rest}
      type="number"
      value={draft ?? String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-') {
          setDraft(raw);
          return;
        }
        const parsed = parseInt(raw, 10);
        if (Number.isNaN(parsed)) {
          setDraft(raw);
          return;
        }
        // Show the normalised number, not the raw keystrokes. Typing 45 into a
        // field showing 0 puts the caret after the zero and yields "045";
        // echoing String(parsed) collapses that to "45" as you type.
        setDraft(String(parsed));
        onCommit(parsed);
      }}
      onBlur={(e) => {
        if (draft === '' || draft === '-') onCommit(emptyValue);
        setDraft(null);
        rest.onBlur?.(e);
      }}
    />
  );
}
