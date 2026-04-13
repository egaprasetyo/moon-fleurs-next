import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Container>
        <div className="flex flex-col items-center gap-4">
          <span className="text-5xl animate-bounce">🌸</span>
          <p className="text-sm text-muted-foreground animate-pulse">
            Memuat...
          </p>
        </div>
      </Container>
    </div>
  );
}
