export function LoadingState({ error }: { error?: string | null }) {
  return (
    <p
      className={`py-20 text-center ${error ? "text-accent-coral" : "animate-pulse text-ink/60"}`}
    >
      {error ? `No se pudo cargar el torneo: ${error}` : "Cargando torneo…"}
    </p>
  );
}
