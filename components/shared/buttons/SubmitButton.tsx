import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { RefreshCw, Send } from "lucide-react"

export interface SubmitButtonProps extends ButtonProps {
  isSubmitting ?: boolean
}

export function SubmitButton({
                             isSubmitting  = false,
                               ...rest
                             }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isSubmitting } {...rest}>
      {isSubmitting ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" /> }
      {isSubmitting ? "Submitting" : "Submit"}
    </Button>
  )
}