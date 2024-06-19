type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

const InfoSection = ({ title, children }: InfoSectionProps) => {
  return (
    <section className="w-full flex h-fit mt-8 border-t-[1px] mx-8 pt-8">
      <h1 className="w-1/4 text-2xl font-semibold text-orange-400 dark:text-white pl-8">
        {title}
      </h1>
      <div className="w-full flex flex-col gap-6">{children}</div>
    </section>
  );
};

export default InfoSection;
