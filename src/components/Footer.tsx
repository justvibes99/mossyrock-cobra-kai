import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-cobra-black border-t-4 border-cobra-red py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <Image src="/cobra-logo.png" alt="Mossyrock Cobra Kai" width={64} height={64} className="w-16 h-16 mx-auto mb-6" />

        <p className="text-cobra-yellow font-bold uppercase tracking-wider text-lg">
          Mossyrock Cobra Kai
        </p>
        <p className="font-mono text-cobra-gold text-xs uppercase tracking-wider mt-2">
          Mossyrock, WA &bull; Strike First &bull; Strike Hard &bull; No Mercy
        </p>

        <div className="mt-8 pt-6 border-t-2 border-cobra-dark">
          <p className="font-mono text-foreground/40 text-xs">
            This is a fan-made parody site. Cobra Kai is a trademark of Sony Pictures Television.
          </p>
          <p className="font-mono text-foreground/40 text-xs mt-1">
            No actual martial arts instruction occurs at this location. Probably.
          </p>
        </div>
      </div>
    </footer>
  );
}
