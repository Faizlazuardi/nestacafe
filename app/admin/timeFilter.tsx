"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TIME_RANGES } from "@/lib/utils/date"
import { ChevronDown } from "lucide-react"

export default function TimeFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentTime = searchParams.get("time") ?? TIME_RANGES[0]

    function onChange(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("time", value)

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="inline-block relative">
            <select
                value={currentTime}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2 pr-10 font-bold text-xl appearance-none cursor-pointer"
            >
                {TIME_RANGES.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={20}
                className="top-1/2 right-2 absolute text-gray-500 -translate-y-1/2 pointer-events-none"
            />
        </div>
    )
}