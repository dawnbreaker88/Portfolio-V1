import { HighlightText } from "@/components/highlight/highlight-text";

const HighlightTextView = () => (
  <p className="max-w-md text-muted-foreground leading-relaxed">
    Every component ships as source you copy into your project, so{" "}
    <HighlightText
      className="text-foreground"
      text="you can change anything, from the markup to the motion,"
      trigger="view"
    />{" "}
    without waiting on a release.
  </p>
);