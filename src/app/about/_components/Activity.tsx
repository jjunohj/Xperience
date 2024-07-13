import React from "react";
import { Activity } from "./type";

const Activity = (props: Activity) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start">
        <h1 className="text-base w-fit sm:text-lg lg:text-xl font-semibold dark:text-white">
          {props.title}
        </h1>
        <span className="text-base sm:text-lg lg:text-xl w-fit font-light sm:font-semibold dark:text-white">
          {props.period}
        </span>
      </div>
      <ul className="flex flex-col text-sm sm:text-base gap-1">
        {props.contents?.map((content, index) => (
          <li key={index} className="text-black font-light dark:text-white">
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activity;
