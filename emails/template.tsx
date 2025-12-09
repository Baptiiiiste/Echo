import { ReactNode } from "react"
import {
  Body,
  Head,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"

export const EmailTemplate = ({ children }: { children: ReactNode }) => (
  <Html>
    <Head />
    <Preview>Collect feedback from your users with ease.</Preview>
    <Tailwind>
      <Body>{children}</Body>
    </Tailwind>
  </Html>
)
