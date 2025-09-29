"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ItemSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(1),
  category: z.string().min(1),
  unit: z.string().min(1),
  reorderLevel: z.coerce.number().min(0).default(0),
  binLocation: z.string().optional(),
  notes: z.string().optional(),
});
type ItemForm = z.infer<typeof ItemSchema>;

export default function NewItemPage(){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ItemForm>({ resolver: zodResolver(ItemSchema) });

  async function onSubmit(values: ItemForm){
    await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    window.location.href = "/items";
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="text-xl font-semibold">New Item</div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label className="text-sm">Name</label>
          <input {...register("name")} className="w-full h-9 border rounded-md px-3" />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">SKU</label>
            <input {...register("sku")} className="w-full h-9 border rounded-md px-3" />
            {errors.sku && <p className="text-xs text-red-600">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="text-sm">Category</label>
            <input {...register("category")} className="w-full h-9 border rounded-md px-3" />
            {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Unit</label>
            <input {...register("unit")} className="w-full h-9 border rounded-md px-3" />
            {errors.unit && <p className="text-xs text-red-600">{errors.unit.message}</p>}
          </div>
          <div>
            <label className="text-sm">Reorder level</label>
            <input type="number" min={0} {...register("reorderLevel", { valueAsNumber: true })} className="w-full h-9 border rounded-md px-3" />
            {errors.reorderLevel && <p className="text-xs text-red-600">{errors.reorderLevel.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm">Bin/Location</label>
          <input {...register("binLocation")} className="w-full h-9 border rounded-md px-3" />
        </div>
        <div>
          <label className="text-sm">Notes</label>
          <textarea rows={4} {...register("notes")} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={isSubmitting} className="h-9 px-4 rounded-md bg-black text-white disabled:opacity-50">{isSubmitting?"Saving...":"Create"}</button>
          <a href="/items" className="h-9 px-4 rounded-md border">Cancel</a>
        </div>
      </form>
    </div>
  );
}
