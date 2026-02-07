"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSlot } from "@/lib/actions/scrim";
import { siteConfig } from "@/config/site";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotNumber: number;
  sessionId: number;
  onSuccess?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending} className="w-full">
      {pending ? siteConfig.ui.forms.submitting : siteConfig.ui.forms.submit}
    </Button>
  );
}

export function RegisterModal({
  isOpen,
  onClose,
  slotNumber,
  sessionId,
  onSuccess,
}: RegisterModalProps) {
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const formAction = async (formData: FormData) => {
    formData.append("slotNumber", slotNumber.toString());
    const response = await registerSlot(sessionId, null, formData);
    setResult(response);

    if (response.success) {
      toast.success(response.message);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setResult(null);
      }, 2000);
    } else {
      toast.error(response.message);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <AnimatePresence mode="wait">
        {result?.success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-4 rounded-full bg-green-500/20 p-4"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-green-400">
              {siteConfig.ui.forms.success}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {siteConfig.ui.forms.successMessage.replace("#{slot}", `#${slotNumber}`)}
            </p>
            <motion.div
              className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-green-500/20"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalHeader>
              <ModalTitle>
                <span className="text-primary">{siteConfig.ui.forms.registerTitle}</span> Slot #{slotNumber}
              </ModalTitle>
              <ModalDescription>
                {siteConfig.ui.forms.registerDescription}
              </ModalDescription>
            </ModalHeader>

            <form action={formAction}>
              <ModalBody className="space-y-4">
                <div>
                  <label
                    htmlFor="teamName"
                    className="mb-2 block text-sm font-medium"
                  >
                    {siteConfig.ui.forms.teamName}
                  </label>
                  <Input
                    id="teamName"
                    name="teamName"
                    placeholder={siteConfig.ui.forms.teamNamePlaceholder}
                    icon={<Users className="h-4 w-4" />}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    siteConfig.ui.forms.player1,
                    siteConfig.ui.forms.player2,
                    siteConfig.ui.forms.player3,
                    siteConfig.ui.forms.player4,
                  ].map((label, index) => (
                    <div key={label}>
                      <label className="mb-2 block text-sm font-medium">
                        {label}
                      </label>
                      <Input
                        name={`playerName${index + 1}`}
                        placeholder={siteConfig.ui.forms.playerPlaceholder}
                        icon={<Users className="h-4 w-4" />}
                        required
                        maxLength={50}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="instagram"
                    className="mb-2 block text-sm font-medium"
                  >
                    {siteConfig.ui.forms.instagram}
                  </label>
                  <Input
                    id="instagram"
                    name="instagram"
                    placeholder={siteConfig.ui.forms.instagramPlaceholder}
                    icon={<Instagram className="h-4 w-4" />}
                    required
                    maxLength={100}
                  />
                </div>

                {result && !result.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {result.message}
                  </motion.div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  {siteConfig.ui.forms.cancel}
                </Button>
                <SubmitButton />
              </ModalFooter>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
