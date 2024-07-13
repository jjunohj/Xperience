import React from "react";
import { TechStack } from "./type";

const TechStack = ({ title, elements }: TechStack) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <h1 className="text-base sm:text-lg lg:text-xl font-semibold dark:text-white">
        {title}
      </h1>
      <div className="flex flex-wrap gap-1 sm:gap-2 text-sm sm:text-base">
        {elements.map((element, index) => (
          <React.Fragment key={index}>
            <span className="text-black font-light dark:text-white">
              {element}
            </span>
            {index < elements.length - 1 && (
              <span className="text-black dark:text-white ">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
