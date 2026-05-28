import React from "react";
import { TechStack } from "./type";

export default function TechStack({ title, elements }: TechStack) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-base font-semibold dark:text-white sm:text-lg lg:text-xl">{title}</h1>
      <div className="flex flex-wrap gap-1 text-sm sm:gap-2 sm:text-base">
        {elements.map((element, index) => (
          <React.Fragment key={index}>
            <span className="font-light text-black dark:text-white">{element}</span>
            {index < elements.length - 1 && <span className="text-black dark:text-white ">|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
