import React from "react";

type Direction = "left" | "right" | "up" | "down";

type ArrowIconProps = {
  direction: Direction;
} & React.ComponentProps<"svg">;

export default function ArrowIcon({ direction, ...props }: ArrowIconProps) {
  const getRotation = () => {
    switch (direction) {
      case "right":
        return "rotate(180deg)";
      case "up":
        return "rotate(90deg)";
      case "down":
        return "rotate(270deg)";
      default:
        return "rotate(0deg)";
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      style={{ transform: getRotation() }}
      {...props}
    >
      <path
        d="M9.08626 12.1045L15.3323 18.3507C15.4259 18.4442 15.4759 18.559 15.4823 18.695C15.4888 18.8308 15.4388 18.9519 15.3323 19.0582C15.2259 19.1647 15.108 19.218 14.9785 19.218C14.849 19.218 14.7311 19.1647 14.6248 19.0582L8.23626 12.67C8.1491 12.5827 8.08785 12.4935 8.05251 12.4025C8.01735 12.3115 7.99976 12.2122 7.99976 12.1045C7.99976 11.9968 8.01735 11.8975 8.05251 11.8065C8.08785 11.7155 8.1491 11.6263 8.23626 11.539L14.6248 5.15074C14.7183 5.05708 14.833 5.00708 14.969 5.00074C15.1048 4.99424 15.2259 5.04424 15.3323 5.15074C15.4388 5.25708 15.492 5.37499 15.492 5.50449C15.492 5.63399 15.4388 5.75191 15.3323 5.85825L9.08626 12.1045Z"
        fill="currentColor"
      />
    </svg>
  );
}
