type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

const InfoSection = ({ title, children }: InfoSectionProps) => {
  return (
    <section className="w-full flex h-fit mt-8 border-t-[1px] pt-8">
      <h1 className="w-1/3 sm:w-1/4 lg:w-1/4 text-lg sm:text-xl lg:text-2xl font-semibold text-point pl-4 sm:pl-6 lg:pl-8">
        {title}
      </h1>
      <div className="w-full flex flex-col gap-6">{children}</div>
    </section>
  );
};

export default InfoSection;
