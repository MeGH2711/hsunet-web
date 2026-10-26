import React, { createContext, useContext } from "react";

export const PresentationContext = createContext(null);

export function usePresentation() {
  return useContext(PresentationContext);
}
