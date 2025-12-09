import { getCurrentUser } from "@/lib/actions/user/get-current-user";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/pages/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { EditButton } from "@/components/shared/buttons/EditButton"
import { DeleteButton } from "@/components/shared/buttons/DeleteButton"
import { SaveButton } from "@/components/shared/buttons/SaveButton"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { AddButton } from "@/components/shared/buttons/AddButton"

export const metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.role} — Change your role in settings.`}
      />
      <div className="flex flex-col gap-4">
        <Button>Add Content</Button>
        <Button variant="default">Add Content</Button>
        <Button variant="link">Add Content</Button>
        <Button variant="disable">Add Content</Button>
        <Button variant="outline">Add Content</Button>
        <Button variant="ghost">Add Content</Button>
        <Button variant="destructive">Add Content</Button>
        <Button variant="secondary">Add Content</Button>
        <EditButton />
        <AddButton />
        <DeleteButton />
        <SaveButton />
        <SaveButton isSaving={true}/>
        <SubmitButton/>
        <SubmitButton isSubmitting={true}/>
      </div>
    </>
  );
}
