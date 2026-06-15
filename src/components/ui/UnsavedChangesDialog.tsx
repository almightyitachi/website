"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UnsavedChangesDialogProps {
  open: boolean
  onSaveDraft: () => void
  onDiscard: () => void
  onClose: () => void
}

export function UnsavedChangesDialog({
  open,
  onSaveDraft,
  onDiscard,
  onClose,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You have unsaved changes</DialogTitle>
          <DialogDescription>
            Leaving now will discard everything you&apos;ve entered on this
            step.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button variant="default" className="w-full" onClick={onSaveDraft}>
            Save as Draft
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={onDiscard}
          >
            Discard and leave
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Stay here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface UseUnsavedChangesReturn {
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  /** Wrap any navigation callback — shows the dialog first when isDirty. */
  guardNavigation: (navigate: () => void) => void
  dialogProps: Pick<
    UnsavedChangesDialogProps,
    "open" | "onDiscard" | "onClose"
  >
}

export function useUnsavedChanges(
  onSaveDraftCallback?: () => void
): UseUnsavedChangesReturn & { onSaveDraft: () => void } {
  const [isDirty, setIsDirty] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const pendingNav = React.useRef<(() => void) | null>(null)

  React.useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  React.useEffect(() => {
    if (!isDirty) return

    let intentionalPop = false
    window.history.pushState(null, "")

    const onPop = () => {
      if (intentionalPop) {
        intentionalPop = false
        return
      }
      window.history.pushState(null, "")
      pendingNav.current = () => {
        intentionalPop = true
        window.history.go(-2)
      }
      setIsOpen(true)
    }

    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [isDirty])

  const guardNavigation = React.useCallback(
    (navigate: () => void) => {
      if (!isDirty) {
        navigate()
        return
      }
      pendingNav.current = navigate
      setIsOpen(true)
    },
    [isDirty]
  )

  const handleDiscard = React.useCallback(() => {
    setIsDirty(false)
    setIsOpen(false)
    pendingNav.current?.()
    pendingNav.current = null
  }, [])

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    pendingNav.current = null
  }, [])

  const handleSaveDraft = React.useCallback(() => {
    onSaveDraftCallback?.()
    setIsOpen(false)
    pendingNav.current = null
  }, [onSaveDraftCallback])

  return {
    isDirty,
    setIsDirty,
    guardNavigation,
    onSaveDraft: handleSaveDraft,
    dialogProps: {
      open: isOpen,
      onDiscard: handleDiscard,
      onClose: handleClose,
    },
  }
}
