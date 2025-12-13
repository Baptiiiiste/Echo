import { RefreshCw, Save } from "lucide-react";



import type { ButtonProps } from '@/components/ui/button';
import { Button } from "@/components/ui/button"



import { Icons } from '@/components/shared/icons';


export interface SaveButtonProps extends ButtonProps {
  isSaving?: boolean
}

export function SaveButton({
                             isSaving = false,
                               ...rest
                             }: SaveButtonProps) {
  return (
    <Button type="submit" disabled={isSaving} {...rest}>
      {isSaving ? <Icons.spinner className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
      {isSaving ? "Saving" : "Save"}
    </Button>
  )
}