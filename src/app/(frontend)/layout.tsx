import type React from "react";

import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource/ibm-plex-mono";

import "./globals.css";

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
		<html lang="en">
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
