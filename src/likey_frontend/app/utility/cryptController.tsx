import NextCrypto from "next-crypto";

const cry = new NextCrypto('l1k3y-s7c-naop')

export const enc = async (data: string) => {
    return await cry.encrypt(data)
}

export const dec = async (data: string) => {
    return await cry.decrypt(data)
}

