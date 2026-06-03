"use client";
import AlertConfirmation from "@/components/alert-confirmation";
import { Button } from "@/components/ui/button";
import { authenticatedApi } from "@/lib/api-handler";
import { toast } from "sonner";

type Props = {
  id: number;
};

const DeleteCompany = ({ id }: Props) => {
  const handleDelete = async () => {
    try {
      await authenticatedApi.delete(`/companies/${id}`);

      toast.success("Company Deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete company");
    }
  };
  return (
    <AlertConfirmation
      title="Are you absolutely sure?"
      description="  This action cannot be undone. This will permanently delete your
            account from our servers."
      handleConfirmation={handleDelete}
    >
      <Button variant="outline">Delete Company</Button>
    </AlertConfirmation>
  );
};

export default DeleteCompany;
