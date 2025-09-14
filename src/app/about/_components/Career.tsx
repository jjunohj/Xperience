import React from "react";
import { Career } from "./type";
import Image from "next/image";

export default function Career(props: Career) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src={props.logo}
            alt={props.company}
            width={24}
            height={24}
            className="rounded-md"
          />
          <h1 className="text-base font-semibold dark:text-white sm:text-lg lg:text-xl">
            {props.company}
          </h1>
        </div>
        <span className="w-fit text-base font-light dark:text-white sm:text-lg sm:font-normal lg:text-xl">
          {props.period}
        </span>
      </div>
      <span className="text-sm text-black dark:text-white sm:text-base">
        {props.team}
      </span>
      <span className="text-sm text-black dark:text-white sm:text-base">
        {props.role}
      </span>
      <div className="my-1 flex w-4/5 flex-wrap gap-x-1 gap-y-0.5 text-sm font-light text-neutral-500 dark:text-white sm:text-base">
        {props.stacks.map((stack, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <span>|</span>}
            <span>{stack}</span>
          </React.Fragment>
        ))}
      </div>
      <ul className="flex flex-col gap-0.5 text-sm sm:text-base">
        {props.info?.map((info, index) => (
          <li
            className="font-extralight text-black dark:text-white"
            key={index}
          >
            · {info}
          </li>
        ))}
      </ul>
    </div>
  );
}
