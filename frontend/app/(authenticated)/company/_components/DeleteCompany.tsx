"use client";
import AlertConfirmation from "@/components/alert-confirmation";
import { Button } from "@/components/ui/button";
import { authenticatedApi } from "@/lib/api-handler";
import { useCompanyStore } from "@/stores/company-store";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  id: number;
};

const DeleteCompany = ({ id }: Props) => {
  const { permissions } = useCompanyStore();
  const t = useTranslations("Company");
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
      description="This action cannot be undone. This will permanently delete your company from our servers."
      handleConfirmation={handleDelete}
    >
      <Button
        variant="destructive"
        disabled={!permissions?.delete}
        size="sm"
        className="gap-2"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {t("delete")}
      </Button>
    </AlertConfirmation>
  );
};

export default DeleteCompany;
