const NOTATION: string[] = [
	"",
	"K",
	"M",
	"B",
	"T",
	"Qa",
	"Qi",
	"Sx",
	"Sp",
	"Oc",
];

function arrayNum(num: string): number[] {
	const arr: number[] = [];
	while (num !== "") {
		if (num.length < 3) {
			arr.push(parseInt(num));
			break;
		}
		arr.push(parseInt(num.slice(-3)));
		num = num.slice(0, -3);
	}
	return arr;
}

function add(num: number[], currentValue: number[]): number[] {
	const result: number[] = [];
	let carry = 0;

	const totalCopy = [...currentValue];

	while (num.length > 0 || totalCopy.length > 0) {
		let sum = 0;
		if (num.length > 0) sum += num.shift()!;
		if (totalCopy.length > 0) sum += totalCopy.shift()!;
		sum += carry;
		carry = 0;

		const parts = arrayNum(sum.toString());
		result.push(parts[0]);
		if (parts.length > 1) carry = parts[1];
	}

	if (carry !== 0) result.push(carry);

	return result;
}

function subtract(num: number[], currentValue: number[]): number[] {
	const result: number[] = [];
	let borrow = 0;

	const totalCopy = [...currentValue];

	while (num.length > 0 || totalCopy.length > 0) {
		let diff = 0;
		const totalVal = totalCopy.length > 0 ? totalCopy.shift() : 0;
		const numVal = num.length > 0 ? num.shift() : 0;
		diff += totalVal ?? 0;
		diff -= numVal ?? 0;
		diff -= borrow;

		if (diff < 0) {
			diff += 1000;
			borrow = 1;
		} else {
			borrow = 0;
		}

		const arrNum = arrayNum(diff.toString());
		result.push(Number.isNaN(arrNum[0]) ? 0 : arrNum[0]);
	}

	while (result.length > 1 && result[result.length - 1] === 0) {
		result.pop();
	}

	return result;
}

function renderTotal(total: number[]): {
	full: string;
	short: string;
} {
	const temp = [...total].reverse(); // reverse for correct order
	const fullString = temp
		.map((val, i) =>
			i === 0 ? val.toString() : val.toString().padStart(3, "0"),
		)
		.join("");

	const cleaned = fullString.replace(/^0+/, "") || "0";

	const shortValue = total[total.length - 1] || 0;
	const suffix = NOTATION[total.length - 1] || "";

	return {
		full: Number(cleaned).toLocaleString(),
		short: `${shortValue}${suffix}`,
	};
}

export { arrayNum, add, subtract, renderTotal };
