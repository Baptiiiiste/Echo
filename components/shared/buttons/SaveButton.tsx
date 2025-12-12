import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { RefreshCw, Save } from "lucide-react"

export interface SaveButtonProps extends ButtonProps {
  isSaving?: boolean
}

export function SaveButton({
                             isSaving = false,
                               ...rest
                             }: SaveButtonProps) {
  return (
    <Button type="submit" disabled={isSaving} {...rest}>
      {isSaving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
      {isSaving ? "Saving" : "Save"}
    </Button>
  )
}