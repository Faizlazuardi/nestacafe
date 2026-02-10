"use server"

import { getAllUsers } from "@/lib/services/user.service";
import EmployeeList from "./EmployeeList";
import { User } from "@/lib/types/user";

export default async function Page() {
    const users: User[] = await getAllUsers()
    return (
        <EmployeeList users={users}/>
    )
}