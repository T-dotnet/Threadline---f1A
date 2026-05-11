/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, User as UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Typography, Input, Button } from "../ui";

interface NavbarProps {
  onClientsClick?: () => void;
  onPatientsClick?: () => void;
  onSessionsClick?: () => void;
  onAssessmentsClick?: () => void;
  onDocumentsClick?: () => void;
  onResourcesClick?: () => void;
  onUsersClick?: () => void;
  onConditionsClick?: () => void;
  onAvatarClick?: () => void;
  activeItem?: string;
  isAdminView?: boolean;
}

export function Navbar({ 
  onClientsClick, 
  onPatientsClick, 
  onSessionsClick, 
  onAssessmentsClick,
  onDocumentsClick,
  onResourcesClick, 
  onUsersClick, 
  onConditionsClick, 
  onAvatarClick, 
  activeItem = "Conditions", 
  isAdminView = false 
}: NavbarProps) {
  const navItems = ["Sessions", "Assessments", "Documents"];
  if (isAdminView) {
    navItems.push("Conditions", "Users");
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-divider h-16 px-6 md:px-[60px] flex items-center justify-between shadow-sm backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onClientsClick}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            T
          </div>
          <Typography variant="h3" className="font-logo font-black tracking-tighter text-2xl m-0 text-primary">
            Threadline
          </Typography>
        </div>

        <div className="hidden lg:block w-px h-6 bg-divider" />
        
        {/* Primary Action */}
        <Button 
          variant={activeItem === "Clients" ? "brand" : "ghost"} 
          size="sm"
          onClick={onClientsClick}
          className="hidden md:flex font-bold tracking-tight rounded-full px-5"
        >
          Client Workspace
        </Button>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden xl:block w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Search clients, notes..."
            className="pl-9 h-9 bg-gray-50/50 border-divider focus:bg-white text-xs"
          />
        </div>

        <div className="hidden lg:block w-px h-6 bg-divider" />

        {/* Dynamic Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <button 
              key={item} 
              onClick={() => {
                if (item === "Patients" && onPatientsClick) onPatientsClick();
                if (item === "Sessions" && onSessionsClick) onSessionsClick();
                if (item === "Assessments" && onAssessmentsClick) onAssessmentsClick();
                if (item === "Documents" && onDocumentsClick) onDocumentsClick();
                if (item === "Resources" && onResourcesClick) onResourcesClick();
                if (item === "Users" && onUsersClick) onUsersClick();
                if (item === "Conditions" && onConditionsClick) onConditionsClick();
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                item === activeItem 
                  ? "bg-primary-light text-primary" 
                  : "text-text-secondary hover:text-primary hover:bg-gray-50"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        
        {/* User Profile */}
        <button 
          onClick={onAvatarClick}
          className="flex items-center gap-3 pl-6 border-l border-divider transition-opacity hover:opacity-80"
        >
          <div className="hidden sm:block text-right">
            <Typography variant="label-micro" className="font-black text-primary">Dr. O. P.</Typography>
            <Typography variant="code" className="text-[9px] text-text-secondary">Clinician</Typography>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#e4e0dc] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden ring-1 ring-divider">
            <Typography variant="label-micro" className="text-primary font-black">OP</Typography>
          </div>
        </button>
      </div>
    </nav>
  );
}
