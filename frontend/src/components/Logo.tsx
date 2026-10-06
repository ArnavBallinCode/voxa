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
              className="flex items-center justify-center w-10 h-10 mx-auto mb-3 cursor-pointer bg-white rounded-lg border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all p-1"
              aria-label="About Voxa"
            >
              <img
                src="/logo-collapsed.png"
                alt="VoxBento Logo"
                className="w-7 h-7 object-contain"
              />
            </button>
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <button
              ref={ref}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 mb-3 rounded-lg border-2 border-[#0d0f10] bg-white shadow-[3px_3px_0px_#0d0f10] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#0d0f10] transition-all text-left cursor-pointer group focus-visible:outline-none"
              aria-label="About Voxa"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-white border border-[#0d0f10] flex items-center justify-center p-1 shadow-sm">
                  <img
                    src="/logo-collapsed.png"
                    alt="VoxBento Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#0d0f10] uppercase tracking-wider leading-none">
                    VOXBENTO
                  </span>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">
                    BROADCAST // CONSOLE
                  </span>
                </div>
              </div>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
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
