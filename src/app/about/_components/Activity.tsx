import React from "react";
import { Activity } from "./type";

const Activity = (props: Activity) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full flex-col-reverse items-start justify-between sm:flex-row">
        <h1 className="w-fit text-base font-semibold dark:text-white sm:text-lg lg:text-xl">
          {props.title}
        </h1>
        <span className="w-fit text-base font-light dark:text-white sm:text-lg sm:font-normal lg:text-xl">
          {props.period}
        </span>
      </div>
      <ul className="flex flex-col gap-1 text-sm sm:text-base">
        {props.contents?.map((content, index) => (
          <li key={index} className="font-light text-black dark:text-white">
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activity;
