"use client";

import React from "react";
import Link from "next/link";
import { CategoryFormModal } from "./category-form-modal";
import { Button } from "@/components/ui/button";
import DeleteCategoryDialog from "./delete-category-dialog";

export default function CategoryTable({ items = [], ukms = [] }: any) {
  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-2">UKM</th>
            <th className="p-2">Nama</th>
            <th className="p-2">Tipe</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} className="p-6 text-center">Belum ada kategori</td></tr>
          )}

          {items.map((c:any) => (
            <tr key={c.id.toString()} className="hover:bg-slate-50">
              <td className="p-2">{c.ukm?.name ?? "-"}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <CategoryFormModal mode="edit" category={c} ukms={ukms} trigger={<Button variant="ghost">Edit</Button>} />
                  <DeleteCategoryDialog id={String(c.id)} name={c.name} trigger={<Button variant="destructive">Hapus</Button>} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
