import { BoxProps } from "@mui/material";
import { styled } from "@mui/system";

interface FlexBetweenProps extends BoxProps {}

const FlexBetween = styled("div")<FlexBetweenProps>({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;

FlexBetween.displayName = "FlexBetween";
