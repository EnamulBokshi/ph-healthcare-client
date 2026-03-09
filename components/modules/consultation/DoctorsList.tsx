'use client'

import { getDoctors } from "@/app/(commonLayout)/consultation/_action"
import { useQuery } from "@tanstack/react-query"

export default function DoctorsList() {
    const {data} = useQuery({
        queryKey: ['doctors'],
        queryFn: getDoctors,
    })

    console.log(data);
  return (
    <div>DoctorsList</div>
  )
}
