export default function Footer() {
  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4">© {new Date().getFullYear()} UKM Portal — Built with ♥</div>
    </footer>
  );
}