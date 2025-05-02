import React from 'react';
import { ChevronDown } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { Activity, BellRing, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col dark">
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="animated-gradient absolute inset-0 z-0"></div>
          <div className="container relative z-10 flex max-w-[64rem] flex-col items-center gap-8 text-center">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-3xl font-bold text-white leading-tight mb-4 sm:text-5xl md:text-6xl lg:text-7xl">
                Detectează frauda bancară în timp real
              </h1>

              <p className="mx-auto max-w-[42rem] leading-normal text-gray-300 sm:text-xl sm:leading-8">
                Un sistem inteligent pentru monitorizarea și analiza automată a tranzacțiilor suspecte, protejând clienții și băncile împotriva fraudei.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <button onClick={() => navigate("/transactions")} className="btn btn-blue gap-2 bg-blue-900 hover:bg-primary/90">
                Începe acum
              </button>
            </div>
            <div className="mt-8 animate-slide-up">
              <ChevronDown className="h-8 w-8 animate-bounce text-white opacity-70" />
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container space-y-12">
            <div className="text-center">
              <h2 className="text-3xl light font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Funcționalități cheie pentru detecția de fraudă
              </h2>
              <p className="mx-auto mt-4 max-w-[42rem] text-muted-foreground md:text-lg">
                Soluția noastră te ajută să identifici rapid tranzacțiile suspecte și să previi pierderile financiare.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold light">Monitorizare în timp real</h3>
                <p className="text-muted-foreground text-sm">
                  Sistemul analizează în mod continuu toate tranzacțiile pentru a detecta rapid comportamente neobișnuite sau potențial frauduloase.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <BellRing className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold light">Alerte automate</h3>
                <p className="text-muted-foreground text-sm">
                  Sistemul trimite automat alerte angajaților băncii atunci când este detectată o tranzacție suspectă, permițând intervenția rapidă.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold light">Panou de control pentru analiză</h3>
                <p className="text-muted-foreground text-sm">
                  Vizualizează toate alertele și tranzacțiile într-o interfață intuitivă, cu filtre și statistici pentru investigații rapide.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Aplicatie Detectie Frauda - MUNTEANU ALEXANDRA-DANIELA. Toate drepturile rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
}
