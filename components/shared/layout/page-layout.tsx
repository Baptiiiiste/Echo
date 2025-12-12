import type { FC, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"
import type { LucideIcon } from "lucide-react"

export type PageLayoutProps = {
  children: ReactNode
  className?: string
}

const Root: FC<PageLayoutProps> = ({ children, className }) => {
  const childrenArray = Children.toArray(children) as ReactElement[]

  const getChildByDisplayName = (name: string) =>
    childrenArray.find(
      (child) =>
        isValidElement(child) && (child.type as FC)?.displayName === name,
    )

  const icon = getChildByDisplayName("Icon")
  const actions = getChildByDisplayName("Actions")
  const title = getChildByDisplayName("Title")
  const description = getChildByDisplayName("Description")
  const content = getChildByDisplayName("Content")

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="rounded-md border bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div className="flex flex-col">
              {title}
              {description}
            </div>
          </div>
          {actions}
        </div>
      </div>
      <div className="flex-1">{content}</div>
    </div>
  )
}

const Actions: FC<PageLayoutProps> = ({ children, className }) => (
  <div className={`flex items-center gap-2 ${className || ""}`}>{children}</div>
)
Actions.displayName = "Actions"

const Icon: FC<{ icon: LucideIcon; color: string; className?: string }> = ({
  icon: IconComponent,
  color,
  className,
}) => (
  <div
    className={`flex size-12 items-center justify-center rounded-lg ${className || ""}`}
    style={{ backgroundColor: `${color}1A` }}
  >
    <IconComponent className="size-6" style={{ color }} />
  </div>
)
Icon.displayName = "Icon"

const Title: FC<PageLayoutProps> = ({ children, className }) => (
  <h1 className={`text-2xl font-semibold tracking-tight ${className || ""}`}>
    {children}
  </h1>
)
Title.displayName = "Title"

const Description: FC<PageLayoutProps> = ({ children, className }) => (
  <p className={`text-sm text-muted-foreground ${className || ""}`}>
    {children}
  </p>
)
Description.displayName = "Description"

const Content: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={`${className || ""} pt-6`}>{children}</div>
Content.displayName = "Content"

export const PageLayout = {
  Root,
  Actions,
  Title,
  Description,
  Content,
  Icon,
}
