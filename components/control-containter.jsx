"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { unlockDoor, lockDoor } from "@/lib/actions"

export default function ControlContainer({ id }) {
  const [loading, setLoading] = useState(null);

  async function handleLockClick()
  {
    setLoading(true);
    const result = await lockDoor(id);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleUnlockClick()
  {
    setLoading(true);
    const result = await unlockDoor(id);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
        <AlertDialog >
        <AlertDialogTrigger asChild>
        <Button disabled={loading} className="w-48 h-12">Lock</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lock the Door</AlertDialogTitle>
            <AlertDialogDescription>
              Please ensure the handle is fully lifted and press continue to lock the door
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleLockClick()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button disabled={loading} variant="destructive" className="w-48 h-12">Unlock</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock the Door ?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlock the front Door ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUnlockClick()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
    )
  }