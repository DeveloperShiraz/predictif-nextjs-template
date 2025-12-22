import "@aws-amplify/ui-react-storage/styles.css";
import "@/styles/global.css";
import { inter } from "@/components/ui/fonts";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import { CloudscapeThemeProvider } from "@/components/CloudscapeThemeProvider";
import { Toaster } from "@/components/ui/Toaster";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased transition-colors",
          "bg-[hsl(var(--theme-background))]",
          inter.className
        )}
      >
        <Providers>
          <CloudscapeThemeProvider>
            {children}
            <Toaster />
          </CloudscapeThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
