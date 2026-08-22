// src/layouts/user/UserLayout.tsx
import { Outlet } from "react-router";
import { Header } from "./Header";
import { FooterSection } from "./FooterSection";
import { TopBar } from "./TopBar";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-base text-text-primary overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
      <TopBar />
      <Header />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}