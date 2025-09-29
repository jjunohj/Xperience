import { FC } from "react";
import React from "react";

export function Button({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#333",
        color: "#fff",
        display: "inline-block",
        borderRadius: 4,
      }}
      onClick={() => alert("Hi")}
    >
      {title}
    </div>
  );
}
