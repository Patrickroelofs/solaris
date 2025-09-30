import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import Providers from "../providers";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource/ibm-plex-mono";

import "./globals.css";

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
		<html lang="en">
			<body>
				<Providers>
					<main>{children}</main>
					<ReactQueryDevtools initialIsOpen={false} />
				</Providers>
			</body>
		</html>
	);
}
