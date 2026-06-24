type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <p className="text-sm font-semibold uppercase text-blaze">{eyebrow}</p>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-normal text-ink md:text-4xl">{title}</h1>
        <p className="page-description mt-3 text-sm font-medium leading-6 md:text-base">{description}</p>
      </div>
    </div>
  );
}
