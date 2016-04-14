import {randomByte, pseudoRandomBytes} from "crypto";

var unmisatakableChars = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",
	base64Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";

export function uniqueId (charsCount = 17) {
	return randomString(charsCount, unmisatakableChars);
}

export function secret (charsCount = 43) {
	return randomString(charsCount, base64Chars);
}

export function fraction () {
	var numerator = parseInt(hexString(8), 16);
	return numerator * 2.3283064365386963e-10;
}

export function choice (arrayOrString) {
	var index = Math.floor(fraction() * arrayOrString.length);
	if (typeof arrayOrString === "string")
		return arrayOrString.substr(index, 1);
	else
		return arrayOrString[index];
}

export function hexString (digits) {
	var bytes, numBytes = Math.ceil(digits / 2);

	// Try to get cryptographically strong randomness. Fall back to
	// non-cryptographically strong if not available.
	try {
		bytes = randomBytes(numBytes);
	} catch (e) {
		// XXX should re-throw any error except insufficient entropy
		bytes = pseudoRandomBytes(numBytes);
	}

	var result = bytes.toString("hex");
	// If the number of digits is odd, we'll have generated an extra 4 bits
	// of randomness, so we need to trim the last digit.
	return result.substring(0, digits);
}

export function randomString (charsCount, alphabet) {
	var digits = [];
	for (var i = 0; i < charsCount; i++) {
		digits[i] = choice(alphabet);
	}

	return digits.join("");
}