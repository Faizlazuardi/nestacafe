"use server"

import { getAllMaterials } from "@/lib/services/material";
import MaterialList from "./materialList";

export default async function Page() {
    const materials = await getAllMaterials()
    return (
        <MaterialList materials={materials}/>
    );
}
