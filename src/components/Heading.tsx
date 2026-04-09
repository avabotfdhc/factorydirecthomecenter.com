import type { ReactNode, HTMLAttributes } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

function createHeading(Tag: "h2" | "h3" | "h4" | "h5" | "h6") {
  return function Heading({ children, id, ...props }: HeadingProps) {
    const autoId = id || slugify(extractText(children));
    return (
      <Tag id={autoId} {...props}>
        {children}
      </Tag>
    );
  };
}

export const H2 = createHeading("h2");
export const H3 = createHeading("h3");
export const H4 = createHeading("h4");
export const H5 = createHeading("h5");
export const H6 = createHeading("h6");
