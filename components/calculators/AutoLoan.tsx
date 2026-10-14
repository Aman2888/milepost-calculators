"use client";

import { autoLoan } from "@/lib/calc";
import { fixed, money } from "@/lib/format";
import { CalcLayout, Chips, Field, FieldRow, Sign, StackBar, useNum } from "@/components/ui";

export default function AutoLoan() {
  const price = useNum("32000");
  const down = useNum("4000");
  const trade = useNum("0");
  const tax = useNum("0");
  const apr = useNum("6.5");
  const term = useNum("60");

  const blankZero = (f: { s: string; n: number }) => (f.s.trim() === "" ? 0 : f.n);

  const r = autoLoan({
    price: price.n,
    down: blankZero(down),
    trade: blankZero(trade),
    taxPct: blankZero(tax),
    apr: apr.n,
    months: term.n,
  });

  return (
    <CalcLayout
      sign={
        <Sign
          label="Your monthly payment"
          value={r ? money(r.monthly) : null}
          unit="a month"
          empty="Enter a price above zero, an APR (0 is fine) and a term of at least one month."
          rows={
            r
              ? [
                  { label: "Amount financed", value: money(r.financed, 0) },
                  { label: "Total interest", value: money(r.interest, 0) },
                  { label: "Total of all payments", value: money(r.totalPaid, 0) },
                  { label: "Loan length", value: `${r.months} months` },
                ]
              : []
          }
          extra={
            r && r.financed > 0 ? (
              <StackBar
                parts={[
                  { label: "Principal", value: r.financed, display: money(r.financed, 0) },
                  {
                    label: "Interest",
                    value: Math.max(0, r.interest),
                    display: `${money(r.interest, 0)} (${fixed((r.interest / r.totalPaid) * 100, 0)}% of payments)`,
                  },
                ]}
              />
            ) : null
          }
        />
      }
    >
      <Field label="Vehicle price" value={price.s} onChange={price.setS} prefix="$" />
      <FieldRow>
        <Field label="Down payment" value={down.s} onChange={down.setS} prefix="$" />
        <Field
          label="Trade-in value"
          value={trade.s}
          onChange={trade.setS}
          prefix="$"
          hint="Leave at 0 if none"
        />
      </FieldRow>
      <FieldRow>
        <Field label="Interest rate (APR)" value={apr.s} onChange={apr.setS} unit="%" />
        <Field
          label="Sales tax"
          value={tax.s}
          onChange={tax.setS}
          unit="%"
          hint="Optional. Added to the price."
        />
      </FieldRow>
      <Field label="Loan term" value={term.s} onChange={term.setS} unit="months" />
      <Chips
        label="Common terms"
        onPick={term.setS}
        options={["36", "48", "60", "72", "84"].map((m) => ({
          label: `${m} months`,
          value: m,
        }))}
      />
    </CalcLayout>
  );
}
