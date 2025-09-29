import { cn } from "../libs/core";

interface DescriptionProps extends React.ComponentProps<"div"> {
  description: string;
}

const Description = ({
  description,
  className,
  ...props
}: DescriptionProps) => {
  return (
    <div
      className={cn(
        "prose prose-neutral relative w-full px-4 text-center font-spoqa text-xl font-light tracking-tight md:text-2xl",
        className,
      )}
      {...props}
    >
      {description}
    </div>
  );
};

export default Description;
