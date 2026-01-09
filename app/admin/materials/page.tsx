"use server"

import { getAllMaterials } from "@/services/material.service";
import MaterialList from "./materialList";

export default async function MaterialPage() {
    const materials = await getAllMaterials()
    return (
        <MaterialList materials={materials}/>
    );
}
