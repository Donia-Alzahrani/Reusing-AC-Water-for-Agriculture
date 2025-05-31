"use client";

import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Navigation} from "@/components/Navigation";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-[#80cbc4]">
      <Navigation/>
      {/* Hero Section */}
      <section className="hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary-foreground">
            ClearDrops: Real-time Water Quality Monitoring
          </h1>
          <p className="text-lg mb-8 text-primary-foreground">
            Ensuring clean and safe water for a sustainable future.
          </p>
          <Button asChild>
            <Link href="/monitor">Monitor Water Quality</Link>
          </Button>
        </div>
      </section>

      
    </div>
  );
}
