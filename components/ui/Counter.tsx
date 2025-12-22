"use client";

import React, { useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "next-themes";

const Counter: React.FC = () => {
  const [counter, setCounter] = useState<number>(1);
  const { theme } = useTheme();

  const handleIncrement = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  const handleDecrement = () => {
    setCounter((prevCounter) => prevCounter - 1);
  };

  const displayCounter = counter > 0;

  return (
    //MuiButtonGroup-root .MuiButtonGroup-grouped:not(:last-of-type)
    //color=white dark:color=black

    //MuiButtonGroup-root .MuiButtonGroup-grouped
    //color=white dark:color=black

    <ButtonGroup
      className="bg-light-blue text-white dark:bg-white dark:text-black"
      size="small"
      aria-label="small outlined button group"
      sx={{
        backgroundColor: theme === "dark" ? "#0067b0" : "#ffffff",
        "& .MuiButtonGroup-root .MuiButtonGroup-grouped:not(:last-of-type)": {
          color: theme === "dark" ? "#000000" : "#ffffff",
        },
        "& .MuiButtonGroup-root .MuiButtonGroup-grouped": {
          color: theme === "dark" ? "#000000" : "#ffffff",
        },
      }}
    >
      <Button onClick={handleIncrement}>+</Button>
      {displayCounter && (
        <Button className="text-black dark:text-white" disabled>
          {counter}
        </Button>
      )}
      {displayCounter && <Button onClick={handleDecrement}>-</Button>}
    </ButtonGroup>
  );
};

export default Counter;
