type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blaze">{eyebrow}</p>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted md:text-base">{description}</p>
      </div>
    </div>
  );
}
