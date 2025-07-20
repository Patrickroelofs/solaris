import BigNumber from "bignumber.js";

function formatBigNumber(value: BigNumber) {
	const formattedValue = BigNumber(value);
	const absNum = formattedValue.abs();

	// TODO: Extend with further suffixes
	const suffixes = [
		{ suffix: "T", value: new BigNumber(1e12) },
		{ suffix: "B", value: new BigNumber(1e9) },
		{ suffix: "M", value: new BigNumber(1e6) },
		{ suffix: "K", value: new BigNumber(1e3) },
	];

	for (const { suffix, value } of suffixes) {
		if (absNum.gte(value)) {
			return value.div(value).decimalPlaces(1).toString() + suffix;
		}
	}

	return formattedValue.toString();
}

export { formatBigNumber };
