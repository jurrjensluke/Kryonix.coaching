import {sanityClient} from "@/sanity/client";
import {PRODUCT_PAGE_QUERY} from "@/sanity/queries";

export default async function Home() {
  const page = await sanityClient.fetch(PRODUCT_PAGE_QUERY, {slug: "home"});
  const features = page?.features?.length
    ? page.features
    : [
        {
          _key: "roster",
          title: "Roster with signal, not noise",
          summary:
            "Coach cards show readiness trend, compliance, missed sessions, and clients needing attention.",
          status: "planned",
        },
        {
          _key: "programmes",
          title: "Programmes that reach the client app",
          summary:
            "Build training blocks on the web and deliver them into the Kryonix app without a second format.",
          status: "planned",
        },
        {
          _key: "check-ins",
          title: "Check-ins and message context",
          summary:
            "Weekly forms, notes, and coach replies sit beside the client's training history and signals.",
          status: "planned",
        },
      ];
  const faqs = page?.faqs ?? [];

  return (
    <main className="min-h-screen bg-[#101315] text-[#f5f7f8]">
      <section className="mx-auto flex min-h-[82vh] w-full max-w-6xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#80e0b2]">
            Kryonix Coaching
          </p>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal text-white md:text-7xl">
            {page?.heroTitle ?? "Coach platform content connected to Sanity."}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#aab4b9]">
            {page?.heroText ??
              "Sanity now owns the editable product content. Firebase still owns coaches, clients, programmes, check-ins, billing entitlements, and messages."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {page?.primaryCallToAction ? (
              <a
                href={page.primaryCallToAction.href ?? "#"}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#80e0b2] px-5 text-sm font-bold text-[#101315] transition hover:bg-[#9aebc3]"
              >
                {page.primaryCallToAction.label}
              </a>
            ) : null}
            {page?.secondaryCallToAction ? (
              <a
                href={page.secondaryCallToAction.href ?? "#"}
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#344047] px-5 text-sm font-bold text-[#f5f7f8] transition hover:border-[#80e0b2]"
              >
                {page.secondaryCallToAction.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>
      <section className="border-t border-[#263036] px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature._key} className="rounded-md border border-[#263036] bg-[#171b1e] p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#80e0b2]">
                {feature.status}
              </p>
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#aab4b9]">{feature.summary}</p>
            </article>
          ))}
        </div>
      </section>
      {faqs.length ? (
        <section className="border-t border-[#263036] px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-white">Questions</h2>
            <div className="mt-8 divide-y divide-[#263036]">
              {faqs.map((faq) => (
                <article key={faq._key} className="py-6">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-[#aab4b9]">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
