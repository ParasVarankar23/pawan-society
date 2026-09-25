"use client";

import { useParams } from "next/navigation";

import AddMemberPage from "@/app/members/add/page";

export default function EditMemberPage() {
    const { id } = useParams();

    return <AddMemberPage memberId={id} />;
}
