import { Plus } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

export function AddButton({...rest} : ButtonProps) {
  return (
    <Button variant="default" {...rest}>
      <Plus className="mr-2 size-4" />
      Add
    </Button>
  )
}


