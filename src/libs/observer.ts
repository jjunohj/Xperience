import { Dispatch, SetStateAction } from "react";

const observerOption = {
  threshold: 0.4,
  rootMargin: "0px 100px 0px 0px",
};

export const getIntersectionObserver = (
  setState: Dispatch<SetStateAction<string>>,
) => {
  let currentIntersecting: Element[] = [];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentIntersecting.push(entry.target);
      } else {
        currentIntersecting = currentIntersecting.filter(
          (el) => el !== entry.target,
        );
      }
    });

    if (currentIntersecting.length > 0) {
      const sortedElements = currentIntersecting.sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
      );

      setState(sortedElements[0].id);
    }
  }, observerOption);

  return observer;
};
