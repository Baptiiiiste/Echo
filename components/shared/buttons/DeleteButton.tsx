import { Plus, Trash } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

export function DeleteButton({...rest} : ButtonProps) {
  return (
    <Button variant="destructive">
      <Trash className="mr-2 size-4" />
      Delete
    </Button>
  )
}