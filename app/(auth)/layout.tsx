import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { dark } from "@clerk/themes";

import "@/app/globals.css"; // c:/Users/celso/Documents/ZeroToFullStack/threadsclone/app/globals.css";

export const metadata = {
	title: "Blackfyre Legion",
	description: "Threads Clone",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.className}dark:bg-black`}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
