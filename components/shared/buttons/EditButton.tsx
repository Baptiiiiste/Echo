import { Pencil } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

export function EditButton({...rest} : ButtonProps) {
  return (
    <Button variant="secondary">
      <Pencil className="mr-2 size-4" />
      Edit
    </Button>
  )
}