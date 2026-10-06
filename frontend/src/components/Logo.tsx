import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { About } from "./About";

interface LogoProps {
  isCollapsed: boolean;
}

const Logo = React.forwardRef<HTMLButtonElement, LogoProps>(
  ({ isCollapsed }, ref) => {
    return (
      <Dialog aria-describedby={undefined}>
        {isCollapsed ? (
          <DialogTrigger asChild>
            <button
              ref={ref}
              type="button"
              className="flex items-center justify-center w-9 h-9 mx-auto mb-3 cursor-pointer bg-zinc-900 text-white rounded-xl shadow-sm hover:opacity-90 transition-all font-bold text-sm tracking-tight"
              aria-label="About Voxa"
            >
              V
            </button>
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <button
              ref={ref}
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 mb-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 hover:bg-zinc-100/80 transition-all text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              aria-label="About Voxa"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                V
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 tracking-tight leading-none group-hover:text-zinc-950">
                  Voxa
                </span>
                <span className="text-[10px] text-zinc-500 font-medium leading-none mt-1">
                  Meeting Intelligence
                </span>
              </div>
            </button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-md">
          <VisuallyHidden>
            <DialogTitle>About Voxa</DialogTitle>
          </VisuallyHidden>
          <About />
        </DialogContent>
      </Dialog>
    );
  },
);

Logo.displayName = "Logo";

export default Logo;
