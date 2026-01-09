"use server"

import { getAllUsers } from "@/services/user.service";
import EmployeeList from "./EmployeeList";
import { User } from "@/types/user";

export default async function EmployeePage() {
    const users: User[] = await getAllUsers()
    return (
        <EmployeeList users={users}/>
    )
}