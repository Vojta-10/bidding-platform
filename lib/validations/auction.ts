import { z } from 'zod';

export const newAuctionSchema = z.object({
  title: z
    .string()
    .max(20, "Title can't be longer than 20 characters!")
    .nonempty('Title cannot be empty!'),
  description: z
    .string()
    .max(200, 'Description is way too long!')
    .min(10, 'Description must be atleast 10 characters long!'),
  startingPrice: z.number("Must provide a valid number!").min(1, 'Starting price must be atleast 1$'),
  deadline: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'The date must be in the future!',
  }),
});

export type newAuctionValues = z.infer<typeof newAuctionSchema>;
