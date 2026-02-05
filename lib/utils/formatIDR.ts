export const formatIDR = (value: number) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
    });
