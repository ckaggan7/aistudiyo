import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">{eyebrow}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}