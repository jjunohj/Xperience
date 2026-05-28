type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="mt-8 flex h-fit w-full gap-2 border-t-[1px] px-4 pt-6 sm:px-8 sm:pt-8">
      <h1 className="w-1/3 text-lg font-semibold text-point sm:w-1/4 sm:text-xl lg:w-1/4 lg:text-2xl">{title}</h1>
      <div className="flex w-full flex-col gap-6">{children}</div>
    </section>
  );
}
