import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Building2, CircleDollarSign, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle, Calendar, Video,
  Wallet, Shield, Briefcase, FolderLock,
} from 'lucide-react';

const SidebarItem = ({ to, icon, text, dataTour }) => (
  <NavLink
    to={to}
    data-tour={dataTour}
    className={({ isActive }) =>
      `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

const SectionLabel = ({ label }) => (
  <h3 className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
    {label}
  </h3>
);

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard', tour: 'dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
  ];

  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard', tour: 'dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <Briefcase size={20} />, text: 'Deals' },
  ];

  // New feature nav items — same for both roles
  const featureItems = [
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Calendar', tour: 'calendar' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Calls', tour: 'videocall' },
    { to: '/document-chamber', icon: <FolderLock size={20} />, text: 'Doc Chamber', tour: 'documents' },
    { to: '/payments', icon: <Wallet size={20} />, text: 'Payments', tour: 'payments' },
    { to: '/security', icon: <Shield size={20} />, text: 'Security', tour: 'security' },
  ];

  const bottomItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  const coreItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:flex flex-col">
      <div className="flex-1 py-3 overflow-y-auto">
        {/* Core navigation */}
        <div className="px-3 space-y-0.5">
          <SectionLabel label="Main" />
          {coreItems.map((item, i) => (
            <SidebarItem
              key={i}
              to={item.to}
              icon={item.icon}
              text={item.text}
              dataTour={item.tour}
            />
          ))}
        </div>

        {/* New features */}
        <div className="px-3 space-y-0.5 mt-2">
          <SectionLabel label="Features" />
          {featureItems.map((item, i) => (
            <SidebarItem
              key={i}
              to={item.to}
              icon={item.icon}
              text={item.text}
              dataTour={item.tour}
            />
          ))}
        </div>

        {/* General */}
        <div className="px-3 space-y-0.5 mt-2">
          <SectionLabel label="General" />
          {bottomItems.map((item, i) => (
            <SidebarItem key={i} to={item.to} icon={item.icon} text={item.text} />
          ))}
        </div>
      </div>

      {/* Bottom user card */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500">Need assistance?</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5">Contact Support</p>
          <a
            href="mailto:support@businessnexus.com"
            className="mt-1 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
          >
            support@businessnexus.com
          </a>
        </div>
      </div>
    </div>
  );
};
