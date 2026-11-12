export default function Loading() {
  return (
    <div className="container-page space-y-6 py-14" aria-busy="true" aria-label="Yuklanmoqda">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-12 w-2/3 max-w-xl" />
      <div className="skeleton h-5 w-1/2 max-w-md" />
      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-72" />
        ))}
      </div>
    </div>
  );
}
