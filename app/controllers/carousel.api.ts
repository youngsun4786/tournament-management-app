import { createServerFn } from "@tanstack/react-start";
import { z } from "vinxi";
import { carouselService } from "~/app/container";

export const getCarouselImages = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const images = await carouselService.getImages();
    return images;
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    throw new Error("Failed to fetch carousel images");
  }
});

export const addCarouselImage = createServerFn({
  method: "POST",
}).validator(
  z.object({
    imageUrl: z.string().url(),
    displayOrder: z.number().int().min(0).optional(),
    description: z.string().optional(),
    storage_path: z.string().optional(),
  })
).handler(async ({ data }) => {
  try {
    const newImage = await carouselService.addImage(data);
    return newImage;
  } catch (error) {
    console.error("Error adding carousel image:", error);
    throw new Error("Failed to add carousel image");
  }
});

export const deleteCarouselImage = createServerFn({
}).validator(
  z.object({
    id: z.string().uuid(),
  })
).handler(async ({ data }) => {
  try {
    await carouselService.deleteImage(data.id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    throw new Error("Failed to delete carousel image");
  }
});

export const updateCarouselImageOrder = createServerFn({
}).validator(
  z.object({
    images: z.array(z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    })),
  })
).handler(async ({ data }) => {
  try {
    await carouselService.updateImageOrder(data.images);
    return { success: true };
  } catch (error) {
    console.error("Error updating carousel image order:", error);
    throw new Error("Failed to update carousel image order");
  }
}); 