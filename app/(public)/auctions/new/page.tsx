import { NewAuctionForm } from './_components/NewAuctionForm';

export default async function NewListingPage() {
  return (
    <div className='flex flex-col p-8 mx-auto items-center max-w-3xl'>
      <h1 className='text-primary text-2xl sm:text-4xl font-bold tracking-tight'>
        Create a new listing
      </h1>
      <NewAuctionForm></NewAuctionForm>
    </div>
  );
}
