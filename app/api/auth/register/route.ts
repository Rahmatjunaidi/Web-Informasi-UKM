import { NextResponse } from "next/server";
import { registerAction } from "@/app/register/actions";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await registerAction(formData as unknown as FormData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Terjadi kesalahan saat mendaftar." }, { status: 500 });
  }
}
