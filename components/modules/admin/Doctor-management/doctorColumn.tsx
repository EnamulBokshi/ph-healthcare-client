import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { Gender, IDoctor } from "@/types/doctor.types";
import { ColumnDef } from "@tanstack/react-table";

const genderLabelMap: Record<Gender, string> = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
  [Gender.OTHER]: "Other",
};

const getGenderLabel = (gender: IDoctor["gender"] | string | number | null | undefined) => {
  if (gender === null || gender === undefined) {
    return "N/A";
  }

  if (typeof gender === "number") {
    return genderLabelMap[gender as Gender] ?? "N/A";
  }

  const normalized = String(gender).trim().toUpperCase();
  if (normalized === "MALE" || normalized === "0") return "Male";
  if (normalized === "FEMALE" || normalized === "1") return "Female";
  if (normalized === "OTHER" || normalized === "2") return "Other";

  return "N/A";
};

export const doctorColumns: ColumnDef<IDoctor>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({row}) => {
        const name = row.original.name;
        const email = row.original.email;
        const profilePhoto = row.original.profilePhoto;
        return (
            <UserInfoCell name={name} email={email} profilePhoto={profilePhoto} />
        )
    }
  },
  // { accessorKey: "specialization", header: "Specialization" },
  {
    id: "experience",
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => {
      const experience = row.original.experience || 0;

      return (
        <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800">
          {experience} years
        </span>
      );
    },
  },
  {
    id: "contactNumber",
    accessorKey: "contactNumber",
    header: "Contact Number",
    cell: ({ row }) => {
      const contactNumber = row.original.contactNumber;

      return (
        <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-800">
          {contactNumber ? contactNumber : "N/A"}
        </span>
      );
    },
  },
  {
    id: "appointmentFee",
    accessorKey: "appointmentFee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.original.appointmentFee;

      return (
        <span className="px-2 py-1 rounded-md bg-green-100 text-green-800">
          ${fee.toFixed(2)}
        </span>
      );
    },
  },
  {
    id: "averageRating",
    accessorKey: "averageRating",
    header: "Average Rating",
    cell: ({ row }) => {
      const rating = row.original.averageRating;

      return (
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800">
            {rating.toFixed(1)} / 5
          </span>
        </div>
      );
    },
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;

      return (
        <span className="px-2 py-1 rounded-md bg-pink-100 text-pink-800">
          {getGenderLabel(gender)}
        </span>
      );
    },
  },
  {
    id: "specialties",
    accessorKey: "specialties",
    header: "Specialties",
    enableSorting: false,
    cell: ({ row }) => {
      const specialties = row.original.specialties;
      if (!specialties || specialties.length === 0) {
        return (
          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800">
            N/A
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1">
          {specialties.map((specialty) => (
            <Badge key={specialty.specialtyId} variant="outline">
              {specialty.specialty?.title ?? "N/A"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.user.status;
        // const statusStyles: Record<string, string> = {
        //     ACTIVE: "bg-green-100 text-green-800",
        //     INACTIVE: "bg-gray-100 text-gray-800",
        //     SUSPENDED: "bg-yellow-100 text-yellow-800",
        //     DELETED: "bg-red-100 text-red-800",
        // };

        // return (
        //     <span className={`px-2 py-1 rounded-md ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        //         {status}
        //     </span>     
        // );
        return (
            <StatusBadgeCell status={status} />
        )
    }
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <DateCell date={createdAt} formatString="MMM dd, yyyy" />
      )
    },
  },

  // { accessorKey: "rating", header: "Rating" },
];
