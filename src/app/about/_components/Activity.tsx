import React from "react";
import { Activity } from "./type";

const Activity = (props: Activity) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex justify-between pr-8">
        <h1 className="text-xl font-semibold dark:text-white">{props.title}</h1>
        <span className="text-xl font-semibold dark:text-white">
          {props.period}
        </span>
      </div>
      <ul className="flex flex-wrap gap-1 w-4/5">
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
