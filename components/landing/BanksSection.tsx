const BANKS = ["Chase", "Wells Fargo", "Citi", "Bank of America", "Capital One", "GTBank", "Access Bank", "UBA"];

export default function BanksSection() {
  return (
    <section className="border-y border-rayo-beige-dark bg-white/60 backdrop-blur-sm py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold tracking-widest text-rayo-green/50 uppercase mb-6">
          Works with your favourite banks
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {BANKS.map((bank) => (
            <span
              key={bank}
              className="text-sm font-semibold text-rayo-green/40 hover:text-rayo-green transition-colors cursor-default"
            >
              {bank}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
