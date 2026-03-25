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
  onClick?: (e: React.MouseEvent) => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

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
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
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
    <motion.div
      className={cn(
        "h-full px-3 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-900 w-[280px] shrink-0 border-r border-neutral-200 dark:border-neutral-800 z-50",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "68px") : "280px",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-900 w-full border-b border-neutral-200 dark:border-neutral-800"
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <button
          aria-label="Open Menu"
          onClick={() => setOpen(!open)}
          className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <IconMenu2 className="text-neutral-800 dark:text-neutral-200" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-950 p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <button
              aria-label="Close Menu"
              className="absolute right-6 top-6 z-50 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { open, animate } = useSidebar();

  return (
    <a
      href={link.href}
      onClick={onClick || link.onClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2.5 px-3 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        link.active
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          : "text-neutral-600 hover:bg-blue-50 hover:text-blue-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        className,
        link.className
      )}
      {...props}
    >
      <div
        className={cn(
          "shrink-0 transition-colors duration-200",
          link.active
            ? "text-white"
            : "text-neutral-500 group-hover/sidebar:text-blue-700 dark:text-neutral-400 dark:group-hover/sidebar:text-neutral-100"
        )}
      >
        {link.icon}
      </div>

      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden"
      >
        <span
          className={cn(
            "text-sm group-hover/sidebar:translate-x-0.5 transition-transform duration-200",
            link.active
              ? "font-semibold tracking-wide text-white"
              : "font-medium text-inherit"
          )}
        >
          {link.label}
        </span>

        {link.rightElement && (
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-200",
              link.active
                ? "bg-white/20 text-white"
                : "bg-neutral-200 text-neutral-600 group-hover/sidebar:bg-blue-100 group-hover/sidebar:text-blue-700 dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover/sidebar:bg-neutral-700"
            )}
          >
            {link.rightElement}
          </span>
        )}
      </motion.div>
    </a>
  );
};

export const SidebarGroup = ({
  label,
  children,
  className,
  action,
  id,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  id?: string;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <div id={id} className={cn("flex flex-col gap-1 mt-6", className)}>
      <motion.div
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "block" : "none") : "block",
        }}
        className="flex items-center justify-between px-3 mb-2"
      >
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
          {label}
        </h3>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </motion.div>
      {children}
    </div>
  );
};