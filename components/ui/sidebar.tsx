"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

export interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  rightElement?: React.ReactNode; 
  active?: boolean;               
  className?: string;             
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-3 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[280px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "60px") : "280px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-3 rounded-lg transition-all duration-200",
        // EXACT LINK STYLING: Active is Dark Blue bg & White text. Inactive is Black text. Hover turns Dark Blue.
        link.active 
          ? "bg-blue-900 text-white shadow-sm" 
          : "text-black hover:bg-blue-900 hover:text-white dark:text-neutral-200 dark:hover:bg-blue-900",
        className,
        link.className
      )}
      {...props}
    >
      <div className={cn(
        "shrink-0 transition-colors duration-200",
        link.active ? "text-white" : "text-black group-hover/sidebar:text-white dark:text-neutral-200"
      )}>
        {link.icon}
      </div>

      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden"
      >
        <span
          className={cn(
            "text-[14px] group-hover/sidebar:translate-x-0.5 transition duration-150 !p-0 !m-0",
            link.active ? "font-semibold tracking-wide text-white" : "font-medium tracking-wide text-black group-hover/sidebar:text-white dark:text-neutral-200"
          )}
        >
          {link.label}
        </span>
        
        {link.rightElement && (
          <span 
            className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors duration-200",
              link.active 
                ? "bg-white/20 text-white" 
                : "bg-neutral-200 text-black group-hover/sidebar:bg-white/20 group-hover/sidebar:text-white dark:bg-neutral-700 dark:text-neutral-300"
            )}
          >
            {link.rightElement}
          </span>
        )}
      </motion.div>
    </a>
  );
};