/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: any) {
  return (
    <Provider store={store}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </Provider>
  );
}