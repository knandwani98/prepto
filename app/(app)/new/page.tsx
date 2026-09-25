import { CreateKitForm } from "@/components/CreateKitForm";

export default function NewKitPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
        New Kit
      </p>
      <h1 className="mt-2 text-[36px] leading-tight font-extrabold tracking-tight">
        Research this role
      </h1>
      <p className="mt-2 mb-8 max-w-xl text-[15px] text-muted">
        Paste the job description and company site. Prepto AI will crawl, search,
        and build your prep kit.
      </p>
      <CreateKitForm />
    </div>
  );
}
