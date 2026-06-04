import { TEmployee } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

type Props = {
  employee: TEmployee;
};

const EmployeeCard = ({ employee }: Props) => {
  // TODO: at translation to roles in en.yml and send translated values
  //   TODO: Display if user confirmed invitation

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {employee.name} {employee.surname}
        </CardTitle>
        <CardDescription>{employee.surname}</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon">
            <EditIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-x-1">
          <span className="font-semibold">Added to system at:</span>
          <span>{employee.created_at}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">Role:</span>
          <span>{employee.role}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
