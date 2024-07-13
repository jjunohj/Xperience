import React from "react";
import { Project } from "./type";

const Project = (props: Project) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold dark:text-white">
          {props.title}
        </h1>
        <span className="text-base sm:text-lg lg:text-xl w-fit font-light sm:font-semibold dark:text-white">
          {props.period}
        </span>
      </div>
      <span className="text-black text-sm sm:text-base dark:text-white">
        {props.description}
      </span>
      <span className="text-black text-sm sm:text-base dark:text-white">
        {props.role}
      </span>
      <div className="flex w-4/5 flex-wrap gap-x-1 gap-y-0.5 my-1 text-sm sm:text-base text-gray-500 dark:text-white font-light">
        {props.stacks.map((stack, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <span>|</span>}
            <span>{stack}</span>
          </React.Fragment>
        ))}
      </div>
      <ul className="flex text-sm sm:text-base flex-col gap-0.5">
        {props.info?.map((info, index) => (
          <li
            className="text-black font-extralight dark:text-white"
            key={index}
          >
            · {info}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Project;
