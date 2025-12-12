import { getCurrentUser } from "@/lib/actions/user/get-current-user";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/pages/dashboard/header";
import { EditButton } from "@/components/shared/buttons/EditButton"
import { DeleteButton } from "@/components/shared/buttons/DeleteButton"
import { SaveButton } from "@/components/shared/buttons/SaveButton"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { AddButton } from "@/components/shared/buttons/AddButton"
import { PageLayout } from "@/components/shared/layout/page-layout"
import { LayoutDashboardIcon } from "lucide-react"

export const metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageLayout.Root>
        <PageLayout.Title>Dashboard</PageLayout.Title>
        <PageLayout.Icon icon={LayoutDashboardIcon} color={"#2563EB"} />
        <PageLayout.Description>Manage everything from here</PageLayout.Description>
        <PageLayout.Content>
          <div className="flex flex-col gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="disable">Disabled Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <EditButton />
            <AddButton />
            <DeleteButton />
            <SaveButton />
            <SaveButton isSaving={true}/>
            <SubmitButton/>
            <SubmitButton isSubmitting={true}/>
          </div>
        </PageLayout.Content>
      </PageLayout.Root>
    </>
  );
}
