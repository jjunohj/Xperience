import { Children, isValidElement, type ReactNode } from "react";
import { NOTION_CALLOUT_MARKER } from "@/src/data/constants/notion";

interface NotionBlockquoteProps {
  children: ReactNode;
}

interface ElementWithChildren {
  children?: ReactNode;
}

const CALLOUT_MARKER_PATTERN = new RegExp(`^\\[!${NOTION_CALLOUT_MARKER}(?::(.+))?\\]$`);

function getTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<ElementWithChildren>(child)) {
        return getTextContent(child.props.children);
      }

      return "";
    })
    .join("");
}

function isEmptyTextNode(child: ReactNode): boolean {
  return typeof child === "string" && child.trim() === "";
}

function getCalloutMarkerMatch(child: ReactNode): RegExpMatchArray | null {
  if (isEmptyTextNode(child)) {
    return null;
  }

  if (typeof child === "string" || typeof child === "number") {
    return String(child).trim().match(CALLOUT_MARKER_PATTERN);
  }

  if (isValidElement<ElementWithChildren>(child)) {
    return getTextContent(child.props.children).trim().match(CALLOUT_MARKER_PATTERN);
  }

  return null;
}

export default function NotionBlockquote({ children, ...props }: NotionBlockquoteProps) {
  const childArray = Children.toArray(children);
  const markerIndex = childArray.findIndex((child) => getCalloutMarkerMatch(child));

  if (markerIndex >= 0) {
    const markerMatch = getCalloutMarkerMatch(childArray[markerIndex]);

    return (
      <aside className="notion-callout" {...props}>
        <span className="notion-callout__icon" aria-hidden="true">
          {markerMatch?.[1] || "💡"}
        </span>
        <div className="notion-callout__content">
          {childArray.filter((child, index) => index !== markerIndex && !isEmptyTextNode(child))}
        </div>
      </aside>
    );
  }

  return <blockquote {...props}>{children}</blockquote>;
}
