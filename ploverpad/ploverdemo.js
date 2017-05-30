// DECLARE GLOBAL VARIABLES

/** This object will store the key codes of the keys that are currently being pressed down. Used an object to store the list since we will be removing items by value frequently. */
var downKeys = {};

/** This object will store the keys that are within a single chord. Used an object to store the list since we will be removing items by value frequently. */
var chordKeys = {};

/** This array will store all the chords. Used an array to store the list since we want the items ordered. */
var chords = [];

/** This array will store all the consolidated chords (multistroke words). Used an array to store the list since we want the items ordered. */
var words = [];

/** This array will store all the vertical notes. Used an array to store the list since we want the items ordered. */
var verticalNotes = [];

/** This boolean will determine if the current chord is valid steno. If the current chord contains a non-steno key, this becomes false. Used so the user can use hotkeys to select all (ctrl-a) and copy (ctrl-c). */
var isSteno = true;

/** This string will store the final translated string. */
var translatedString = '';


// IMPORT OUTSIDE DATA

/**
 * This object will store the mapping between binary numbers and steno flags with data imported from an external json file. There is a problem where chrome won't load local json files, so the files must be hosted for the data to be imported in chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators">documentation on bitwise operators</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var binaryToSteno = {};
$.getJSON('assets/binaryToSteno.json', function (data) {
	binaryToSteno = data;
});

/**
 * This object will store the mapping between rtf/cre formatted steno words and english words with data imported from an external json file. There is a problem where chrome won't load local json files, so the files must be hosted for the data to be imported in chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var dictionary = {};
$.getJSON('assets/dict.json', function (data) {
	dictionary = data;
});

/**
 * This object will store the mapping between key codes and qwerty characters with data imported from an external json file. There is a problem where chrome won't load local json files, so the files must be hosted for the data to be imported in chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var keyCodeToQwerty = {};
$.getJSON('assets/keyCodeToQwerty.json', function (data) {
	keyCodeToQwerty = data;
});

/**
 * This object will store the mapping betweeen key codes and steno characters with data imported from an external json file. There is a problem where chrome won't load local json files, so the files must be hosted for the data to be imported in chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var keyCodeToSteno = {};
$.getJSON('assets/keyCodeToSteno.json', function (data) {
	keyCodeToSteno = data;
});

/**
 * This object will store the mapping between steno keys and steno numbers with data imported from an external json file. There is a problem where chrome won't load local json files, so the files must be hosted for the data to be imported in chrome.
 * @see jQuery's <a href="http://api.jquery.com/jQuery.getJSON/">getJSON documentaion</a>.
 * @see The <a href="http://code.google.com/p/chromium/issues/detail?id=40787">chrome bug report</a>.
 */
var stenoKeyNumbers = {};
$.getJSON('assets/stenoKeyNumbers.json', function (data) {
	stenoKeyNumbers = data;
});


// CREATE GLOBAL FUNCTIONS

/**
 * This function will take in a list of keys and color code the steno keyboard.
 * @param {Object} keys Pass in a list of Key objects.
 * @see jQuery's <a href="http://api.jquery.com/css/">css documentation</a>.
 * @see <a href="http://stenoknight.com/stengrid.png">Mirabai's color chart</a>.
 * @see Key class.
 */
function colorCode(keys) {
	// Make a list of steno keys from the list of Key objects.
	var stenoKeys = {};
	for (var i in keys) {
		stenoKeys[keys[i].toSteno()] = true; // use the conversion function in the Key class to get a steno representation of the Key.
	}

	// Color code the letters that use only 1 steno key.

	// #
	if ('#' in stenoKeys) {
		$('#stenoKeyNumberBar').css('background-color', '#822259');
	}

	// *
	if ('*' in stenoKeys) {
		$('#stenoKeyAsterisk1').css('background-color', '#822259');
		$('#stenoKeyAsterisk2').css('background-color', '#822259');
	}

	// Initial S
	if ('S-' in stenoKeys) {
		$('#stenoKeyS-1').css('background-color', '#00ff00');
		$('#stenoKeyS-2').css('background-color', '#00ff00');
	}

	// Final S
	if ('-S' in stenoKeys) {
		$('#stenoKey-S').css('background-color', '#00ff00');
	}

	// Initial T
	if ('T-' in stenoKeys) {
		$('#stenoKeyT-').css('background-color', '#8000ff');
	}

	// Final T
	if ('-T' in stenoKeys) {
		$('#stenoKey-T').css('background-color', '#8000ff');
	}

	// Initial P
	if ('P-' in stenoKeys) {
		$('#stenoKeyP-').css('background-color', '#0080ff');
	}

	// Final P
	if ('-P' in stenoKeys) {
		$('#stenoKey-P').css('background-color', '#0080ff');
	}

	// Initial R
	if ('R-' in stenoKeys) {
		$('#stenoKeyR-').css('background-color', '#00ff80');
	}

	// Final R
	if ('-R' in stenoKeys) {
		$('#stenoKey-R').css('background-color', '#00ff80');
	}

	// Final B
	if ('-B' in stenoKeys) {
		$('#stenoKey-B').css('background-color', '#800000');
	}

	// Final D
	if ('-D' in stenoKeys) {
		$('#stenoKey-D').css('background-color', '#808000');
	}

	// Final F
	if ('-F' in stenoKeys) {
		$('#stenoKey-F').css('background-color', '#008000');
	}

	// Final G
	if ('-G' in stenoKeys) {
		$('#stenoKey-G').css('background-color', '#008080');
	}

	// Initial K
	if ('K-' in stenoKeys) {
		$('#stenoKeyK-').css('background-color', '#800080');
	}

	// Final L
	if ('-L' in stenoKeys) {
		$('#stenoKey-L').css('background-color', '#80ffff');
	}

	// Final V
	if ('-F' in stenoKeys) {
		$('#stenoKey-F').css('background-color', '#808080');
	}

	// Final Z
	if ('-Z' in stenoKeys) {
		$('#stenoKey-Z').css('background-color', '#ff0000');
	}

	// Initial A
	if ('A-' in stenoKeys) {
		$('#stenoKeyA-').css('background-color', '#9df347');
	}

	// Final E
	if ('-E' in stenoKeys) {
		$('#stenoKey-E').css('background-color', '#f0a637');
	}

	// Initial H
	if ('H-' in stenoKeys) {
		$('#stenoKeyH-').css('background-color', '#c558d3');
	}

	// Initial O
	if ('O-' in stenoKeys) {
		$('#stenoKeyO-').css('background-color', '#485771');
	}

	// Final U
	if ('-U' in stenoKeys) {
		$('#stenoKey-U').css('background-color', '#bcf3ed');
	}

	// Initial W
	if ('W-' in stenoKeys) {
		$('#stenoKeyW-').css('background-color', '#f26abf');
	}

	// Color code the letters that use 2 Steno Keys.

	// Initial B
	if ('P-' in stenoKeys && 'W-' in stenoKeys) {
		$('#stenoKeyP-').css('background-color', '#800000');
		$('#stenoKeyW-').css('background-color', '#800000');
	}

	// Initial D
	if ('T-' in stenoKeys && 'K-' in stenoKeys) {
		$('#stenoKeyT-').css('background-color', '#808000');
		$('#stenoKeyK-').css('background-color', '#808000');
	}

	// Initial F
	if ('T-' in stenoKeys && 'P-' in stenoKeys) {
		$('#stenoKeyT-').css('background-color', '#008000');
		$('#stenoKeyP-').css('background-color', '#008000');
	}

	// Final K
	if ('-B' in stenoKeys && '-G' in stenoKeys) {
		$('#stenoKey-B').css('background-color', '#800080');
		$('#stenoKey-G').css('background-color', '#800080');
	}

	// Initial L
	if ('H-' in stenoKeys && 'R-' in stenoKeys) {
		$('#stenoKeyH-').css('background-color', '#80ffff');
		$('#stenoKeyR-').css('background-color', '#80ffff');
	}

	// Initial M
	if ('P-' in stenoKeys && 'H-' in stenoKeys) {
		$('#stenoKeyP-').css('background-color', '#804000');
		$('#stenoKeyH-').css('background-color', '#804000');
	}

	// Final M
	if ('-P' in stenoKeys && '-L' in stenoKeys) {
		$('#stenoKey-P').css('background-color', '#804000');
		$('#stenoKey-L').css('background-color', '#804000');
	}

	// Final N
	if ('-P' in stenoKeys && '-B' in stenoKeys) {
		$('#stenoKey-P').css('background-color', '#ff0080');
		$('#stenoKey-B').css('background-color', '#ff0080');
	}

	// Initial V
	if ('S-' in stenoKeys && 'R-' in stenoKeys) {
		$('#stenoKeyS-1').css('background-color', '#808080');
		$('#stenoKeyS-2').css('background-color', '#808080');
		$('#stenoKeyR-').css('background-color', '#808080');
	}

	// Initial X
	if ('K-' in stenoKeys && 'P-' in stenoKeys) {
		$('#stenoKeyK-').css('background-color', '#ffff00');
		$('#stenoKeyP-').css('background-color', '#ffff00');
	}

	// Initial C
	if ('K-' in stenoKeys && 'R-' in stenoKeys) {
		$('#stenoKeyK-').css('background-color', '#af3630');
		$('#stenoKeyR-').css('background-color', '#af3630');
	}

	// I
	if ('-E' in stenoKeys && '-U' in stenoKeys) {
		$('#stenoKey-E').css('background-color', '#575a14');
		$('#stenoKey-U').css('background-color', '#575a14');
	}

	// Initial Q
	if ('K-' in stenoKeys && 'W-' in stenoKeys) {
		$('#stenoKeyK-').css('background-color', '#511151');
		$('#stenoKeyW-').css('background-color', '#511151');
	}

	// Color code the letters that use 3 Steno Keys.

	// Initial N
	if ('T-' in stenoKeys && 'P-' in stenoKeys && 'H-' in stenoKeys) {
		$('#stenoKeyT-').css('background-color', '#ff0080');
		$('#stenoKeyP-').css('background-color', '#ff0080');
		$('#stenoKeyH-').css('background-color', '#ff0080');
	}

	// Final X
	if ('-B' in stenoKeys && '-G' in stenoKeys && '-S' in stenoKeys) {
		$('#stenoKey-B').css('background-color', '#ffff00');
		$('#stenoKey-G').css('background-color', '#ffff00');
		$('#stenoKey-S').css('background-color', '#ffff00');
	}

	// Initial Y
	if ('K-' in stenoKeys && 'W-' in stenoKeys && 'R-' in stenoKeys) {
		$('#stenoKeyK-').css('background-color', '#732cad');
		$('#stenoKeyW-').css('background-color', '#732cad');
		$('#stenoKeyR-').css('background-color', '#732cad');
	}

	// Color code the letters that contain 4 Steno Keys.

	// Initial G
	if ('T-' in stenoKeys && 'K-' in stenoKeys && 'P-' in stenoKeys && 'W-' in stenoKeys) {
		$('#stenoKeyT-').css('background-color', '#008080');
		$('#stenoKeyK-').css('background-color', '#008080');
		$('#stenoKeyP-').css('background-color', '#008080');
		$('#stenoKeyW-').css('background-color', '#008080');
	}

	// Initial J
	if ('S-' in stenoKeys && 'K-' in stenoKeys && 'W-' in stenoKeys && 'R-' in stenoKeys) {
		$('#stenoKeyS-1').css('background-color', '#000080');
		$('#stenoKeyS-2').css('background-color', '#000080');
		$('#stenoKeyK-').css('background-color', '#000080');
		$('#stenoKeyW-').css('background-color', '#000080');
		$('#stenoKeyR-').css('background-color', '#000080');
	}

	// Final J
	if ('-P' in stenoKeys && '-B' in stenoKeys && '-L' in stenoKeys && '-G' in stenoKeys) {
		$('#stenoKey-P').css('background-color', '#000080');
		$('#stenoKey-B').css('background-color', '#000080');
		$('#stenoKey-L').css('background-color', '#000080');
		$('#stenoKey-G').css('background-color', '#000080');
	}

	// Color code the letters that contain use 5 Steno Keys.

	// Final J
	if ('S-' in stenoKeys && 'T-' in stenoKeys && 'K-' in stenoKeys && 'P-' in stenoKeys && 'W-' in stenoKeys) {
		$('#stenoKeyS-1').css('background-color', '#ff0000');
		$('#stenoKeyS-2').css('background-color', '#ff0000');
		$('#stenoKeyT-').css('background-color', '#ff0000');
		$('#stenoKeyK-').css('background-color', '#ff0000');
		$('#stenoKeyP-').css('background-color', '#ff0000');
		$('#stenoKeyW-').css('background-color', '#ff0000');
	}

}

/**
 * This function takes in a string containing meta commands and converts them.
 * @param {string} translationString Pass in a string with meta commands.
 * @return {string} The string with all the meta commands translated.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions">guide on regular expressions</a>.
 * @see Josh's <a href="http://launchpadlibrarian.net/81275523/plover_guide.pdf">plover guide</a>.
 */
function demetafy(translationString) {
	// Sentence stops
	translationString = translationString.replace(/\s*{(\.|!|\?)}\s*(\w?)/g, function (matchString, punctuationMark, nextLetter) {return punctuationMark + ' ' + nextLetter.toUpperCase();});
	
	// Sentence breaks
	translationString = translationString.replace(/\s*{(,|:|;)}\s*/g, function (matchString, punctuationMark) {return punctuationMark + ' ';});

	// Simple suffixes (pure javascript translation from the Python code base)
	translationString = translationString.replace(/(\w*)\s*{(\^ed|\^ing|\^er|\^s)}/g, simpleSuffix);
	function simpleSuffix() {
		var matchString = arguments[0];
		var prevWord = arguments[1];
		var suffix = arguments[2];
		var returnString = '';

		var CONSONANTS = {'b': true, 'c': true, 'd': true, 'f': true, 'g': true, 'h': true, 'j': true, 'k': true, 'l': true, 'm': true, 'n': true, 'p': true, 'q': true, 'r': true, 's': true, 't': true, 'v': true, 'w': true, 'x': true, 'z': true, 'B': true, 'C': true, 'D': true, 'F': true, 'G': true, 'H': true, 'J': true, 'K': true, 'L': true, 'M': true, 'N': true, 'P': true, 'Q': true, 'R': true, 'S': true, 'T': true, 'V': true, 'W': true, 'X': true, 'Z': true};
		var VOWELS = {'a': true, 'e': true, 'i': true, 'o': true, 'u': true, 'A': true, 'E': true, 'I': true, 'O': true, 'U': true};
		var W = {'w': true, 'W': true};
		var Y = {'y': true, 'Y': true};
		var PLURAL_SPECIAL = {'s': true, 'x': true, 'z': true, 'S': true, 'X': true, 'Z': true};
		prepForSimpleSuffix = function (wordParam) {
			var numChars = wordParam.length;
			if (numChars < 2) {
				return wordParam;
			}
			if (numChars >= 3) {
				thirdToLast = wordParam.slice(-3, -2);
			} else {
				thirdToLast = '';
			}
			secondToLast = wordParam.slice(-2, -1);
			last = wordParam.slice(-1);
			if (secondToLast in VOWELS || secondToLast in CONSONANTS) {
				if (last in VOWELS) {
					if (thirdToLast && (thirdToLast in VOWELS || thirdToLast in CONSONANTS)) {
						return wordParam.slice(0, -1);
					}
				} else if (last in CONSONANTS && !(last in W) && secondToLast in VOWELS && thirdToLast && !(thirdToLast in VOWELS)) {
					return wordParam + last;
				} else if (last in Y && secondToLast in CONSONANTS) {
					return wordParam.slice(0, -1) + 'i';
				}
			}
		return wordParam;
		}

		if (suffix === '^s') {
			if (prevWord.length < 2) {
				return prevWord + 's';
			}
			var a = prevWord.slice(-2, -1);
			var b = prevWord.slice(-1);

			if (b in PLURAL_SPECIAL) {
				return prevWord + 'es';
			} else if (b in Y && a in CONSONANTS) {
				return prevWord.slice(0, -1) + 'ies';
			}
			return prevWord + 's';
		}
		if (suffix === '^ed') {
			return prepForSimpleSuffix(prevWord) + 'ed';
		}
		if (suffix === '^er') {
			return prepForSimpleSuffix(prevWord) + 'er';
		}
		if (suffix === '^ing') {
			if (prevWord && prevWord.slice(-1) in Y) {
				return prevWord + 'ing';
			}
			return prepForSimpleSuffix(prevWord) + 'ing';
		}
	}

	// Capitalize
	translationString = translationString.replace(/\s*{-\|}\s*(\w?)/g, function (matchString, nextLetter) {return nextLetter.toUpperCase();});

	// Glue flag
	translationString = translationString.replace(/(\s*{&[^}]+}\s*)+/g, glue);
	function glue() {
		var testString = '';
		for (i = 0; i < arguments.length; i++) {
			testString += arguments[i] + ', ';
		}
		var matchString = arguments[0];
		matchString = matchString.replace(/\s*{&([^}]+)}\s*/g, function (a, p1) {return p1;});
		return ' ' + matchString + ' ';
	}

	// Attach flag
	translationString = translationString.replace(/\s*{\^([^}]+)\^}\s*/g, function (matchString, attachString) {return attachString;});
	translationString = translationString.replace(/\s*{\^([^}]+)}(\s*)/g, function (matchString, attachString, whitespace) {return attachString + whitespace;});
	translationString = translationString.replace(/(\s*){([^}]+)\^}\s*/g, function (matchString, whitespace, attachString) {return whitespace + attachString;});

	// Key Combinations
	translationString = translationString.replace(/\s*{#Return}\s*/g, '\n');
	translationString = translationString.replace(/\s*{#Tab}\s*/g, '\t');

	return translationString;
}

/**
 * This function resets the keys to how they were before any user interaction.
 */
function resetKeys() {
	// Clear the list of keys currently being pressed down.
	for (var key in downKeys) {
		delete downKeys[key];
	}

	// Clear the list of keys in the current chord.
	for (var key in chordKeys) {
		delete chordKeys[key];
	}

	// Assume the next stroke is valid steno.
	isSteno = true;

	// Clear keyboard colors
	$('.stdKey').css('background-color', '#000000');
	$('.stenoKey').css('background-color', '#000000');
}

/**
 * This function trims a string of leading and trailing whitespace.
 * @return {String} The string stripped of whitespace from both ends.
 * @see MDN's <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim">trim documentation</a>.
 */
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

/**
 * This function will zero-fill a number.
 * @param {integer} number The number to be zero-filled.
 * @param {integer} width The width of the zero-filled number.
 * @return {string} A string of a zero-filled number.
 * @see The <a href="http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript">question on Stack Overflow</a>.
 */
function zeroFill(number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number)?2:1)).join('0') + number;
	}
	return number;
}


// CREATE 'CLASSES'

/**
 * Creates a new Key.
 * @class Represents a key.
 * @param {number} keyCodeParam The key code of the key.
 */
function Key(keyCodeParam) {
	/** @private */
	var keyCode = keyCodeParam;

	/**
	 * Custom toString function to create unique identifier.
	 * @return {string}
	 */
	this.toString = function () {
		return keyCode;
	};

	/**
	 * Accessor that gets the key code.
	 * @return {integer} The key code.
	 */
	this.getKeyCode = function () {
		return keyCode;
	};

	/**
	 * Mutator that sets the key code.
	 * @param {integer} newKeyCode A new key code.
	 */
	this.setKeyCode = function (newKeyCode) {
		keyCode = newKeyCode;
	};

	/**
	 * Converts the key code to the qwerty character.
	 * @return {string} The qwerty character.
	 */
	this.toQwerty = function () {
		return keyCodeToQwerty[keyCode];
	};

	/**
	 * Converts the key code from a new qwerty character.
	 * @return {string} A new qwerty character.
	 */
	this.fromQwerty = function (newQwerty) {
		for (i in keyCodeToQwerty) { // go through each key code in the imported key code to qwerty mapping
			if (keyCodeToQwerty[i] === newQwerty) { // if the qwerty mapping associated with the current key code is strictly equal to the new qwerty mapping
				keyCode = i; // set the private keyCode property to the current key code
				break; // and stop looping
			}
		}
	};

	/**
	 * Converts the key code to the steno character.
	 * @return {string} The steno character.
	 */
	this.toSteno = function () {
		return keyCodeToSteno[keyCode];
	};

	/**
	 * Converts the key code from a new steno character.
	 * @return {string} A new steno character.
	 */
	this.fromSteno = function (newSteno) {
		for (i in keyCodeToSteno) { // go through each key code in the imported key code to steno mapping
			if (keyCodeToSteno[i] === newSteno) { // if the steno mapping associated with the current key code is strictly equal to the new steno mapping
				keyCode = i; // set the private keyCode property to the current key code
				break; // and stop looping
			}
		}
	};
}

/**
 * Creates a new Chord.
 * @class Represents a steno chord.
 * @param {Object} A list of Keys.
 */
function Chord(keysParam) {
	/** @private */
	var keys = keysParam;

	/**
	 * Custom toString function to create unique identifier.
	 * @return {string}
	 */
	this.toString = function () {
		var returnString = 'A Stroke with the keys ';
		for (var i = 0; i <= keysParam.length; i++) {
			returnString += keysParam[i].toSteno() + ', '
		}
		returnString = returnString.slice(0, -2) + '.';
		return returnString;
	};

	/**
	 * Accessor that gets the list of Keys.
	 * @return The list of Keys.
	 */
	this.getKeys = function () {
		return keys;
	};

	/**
	 * Mutator that sets the list of Keys.
	 * @param newKeys A new list of Keys.
	 */
	this.setKeys = function (newKeys) {
		keys = newKeys;
	};

	/**
	 * This is a function that will take in a string and see if that string is in the key code, qwerty characters, or steno characters.
	 * @param {string} keyParam
	 */
	this.contains = function (keyParam) {
		for (var key in keys) {
			if (keys[key].getKeyCode() === keyParam || keys[key].toQwerty() === keyParam || keys[key].toSteno() === keyParam) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Converts the list of Keys to binary.
	 * @return {number} The binary representation of the stroke.
	 */
	this.toBinary = function () {
		var flags = parseInt('00000000000000000000000000000000', 2);
		for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('10000000000000000000000', 2); i <<= 1) {
			if (this.contains(binaryToSteno[i])) {
				flags |= i;
			}
		}
		return flags;
	}

	/**
	 * Converts the list of Keys to RTF/CRE format.
	 * @return {string} The RTF/CRE representation of the stroke.
	 */
	this.toRTFCRE = function () {
		var rtfcre = '';
		for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('10000000000000000000000', 2); i <<= 1) {
			if (this.contains(binaryToSteno[i]) && binaryToSteno[i] != '#') {
				if (this.contains('#') && stenoKeyNumbers[binaryToSteno[i]]) {
					rtfcre += stenoKeyNumbers[binaryToSteno[i]];
				} else {
					rtfcre += binaryToSteno[i];
				}
			}
		}
		if (this.contains('A-') || this.contains('O-') || this.contains('-E') || this.contains('-U') || this.contains('*')) {
			return rtfcre.replace(/-/g, '');
		}
		if (rtfcre[0] === '-') {
			return '-' + rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
		} else {
			return rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
		}
	}

	/**
	 * Converts the list of Keys to a list of key codes.
	 * @return The list of key codes.
	 */
	this.toKeyCodes = function () {
		var keyCodes = {};
		for (var i in keys)	{
			keyCodes[keys[i].getKeyCode()] = true;
		}
		return keyCodes;
	}

	/**
	 * Converts the list of Keys to a list of qwerty characters.
	 * @return The list of qwerty characters.
	 */
	this.toQwertyKeys = function () {
		var qwertyKeys = {};
		for (var i in keys)	{
			qwertyKeys[keys[i].toQwerty()] = true;
		}
		return qwertyKeys;
	}

	/**
	 * Converts the list of Keys to a list of steno characters.
	 * @return The list of steno characters.
	 */
	this.toStenoKeys = function () {
		var stenoKeys = {};
		for (var i in keys)	{
			stenoKeys[keys[i].toSteno()] = true;
		}
		return stenoKeys;
	}

	/**
	 * Adds a key to the stroke.
	 */
	this.addKey = function (key) {
		keys[key] = key;
	}

	/**
	 * Removes a key from the stroke.
	 */
	this.removeKey = function (key) {
		if (key in keys) {
			delete keys[key];
		}
	}
}

/**
 * Creates a new Word.
 * @class Represents a word.
 * @param {Object} strokesParam A list of strokes.
 */
function Word(strokesParam) {
	/** @private */
	var strokes = strokesParam;

	var string = '';
	if (strokes.length > 0) {
		for (var i = 0; i < strokes.length; i++) {
			string += strokes[i].toRTFCRE() + '/';
		}
		string = string.slice(0, -1);
	}
	
	/**
	 * Custom toString function to create unique identifier.
	 * @return {string}
	 */
	this.toString = function () {
		return string;
	}

	/**
	 * Accessor that gets the list of strokes.
	 * @return The list of strokes.
	 */
	this.getStrokes = function () {
		return strokes;
	}

	/**
	 * Mutator that sets the list of strokes.
	 * @param {Object} newStrokes A list of strokes.
	 * @return The list of strokes.
	 */
	this.setStrokes = function (newStrokes) {
		strokes = newStrokes;
	}

	/**
	 * Adds a stroke to the word.
	 * @param {Object} strokeParam A stroke object.
	 */
	this.addStroke = function (strokeParam) {
		strokes.push(strokeParam);
		string += '/' + strokeParam.toRTFCRE();
	}

	/**
	 * Removes a stroke from the word.
	 */
	this.removeStroke = function () {
		console.log(strokes.length);
		strokes.pop();
		console.log(strokes.length);
		var stringArray = string.split('/');
		string = '';
		if (strokes.length > 0) {
			for (var i = 0; i < stringArray.length - 1; i++) {
				string += stringArray[i] + '/';
			}
			string = string.slice(0, -1);
		}
	}

	/**
	 * Converts the strokes to English.
	 * @return {string} The English translation.
	 */
	this.toEnglish = function () {
		if (dictionary[string]) { // if there exists a translation
			return dictionary[string];
		} else { // else, return the RTF/CRE formatted strokes.
			return string;
		}
	}
}

/**
 * Creates a new VerticalNote.
 * @class Represents a vertical note.
 * @param {Object} timestampParam A Date object.
 * @param {Object} strokeParam A Chord object.
 */
function VerticalNote(timestampParam, strokeParam) {
	/** @private */
	var timestamp = timestampParam;

	/** @private */
	var stroke = strokeParam;

	var string = zeroFill(timestamp.getHours(), 2) + ':' + zeroFill(timestamp.getMinutes(), 2) + ':' + zeroFill(timestamp.getSeconds(), 2) + '.' + zeroFill(timestamp.getMilliseconds(), 3) + ' ';
	for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('10000000000000000000000', 2); i <<= 1) {
		if (stroke.toBinary() & i) {
			string += binaryToSteno[i].replace(/-/g, '');
		} else {
			string += ' ';
		}
	}
	string = string.trim();
	string += '\n';

	/**
	 * Custom toString function to create unique identifier.
	 * @return {string}
	 */
	this.toString = function () {
		return string;
	}

	/**
	 * Accessor that gets the timestamp.
	 * @return The timestamp.
	 */
	this.getTimestamp = function () {
		return timestamp;
	}

	/**
	 * Accessor that gets the chord.
	 * @return The chord.
	 */
	this.getStroke = function () {
		return stroke;
	}

	/**
	 * Mutator that sets the timestamp.
	 * @param {Object} newTimestamp A new Date object.
	 */
	this.setTimestamp = function (newTimestamp) {
		timestamp = newTimestamp;
	}

	/**
	 * Mutator that sets the chord.
	 * @param {Object} newStroke A new Chord object.
	 */
	this.setStroke = function (newStroke) {
		stroke = newStroke;
	}
}


// EVENT HANDLERS

/**
 * This will handle the key down event.
 * @event
 * @see keydown method: http://api.jquery.com/keydown/
 * @see event.preventDefault method: http://api.jquery.com/event.preventDefault/
 * @see event.stopPropagation method: http://api.jquery.com/event.stopPropagation/
 * @see jQuery.isEmptyObjecy method: http://api.jquery.com/jQuery.isEmptyObject/
 */
$(document).keydown(function (event) {
	// Check to see if this is the start of a new stroke.
	if ($.isEmptyObject(downKeys)) { // if no keys were being pressed down before, this is the start of a new stroke.
		resetKeys(); // so clear the keys before processing the event.
	}

	// Create a new Key Object based on the event.
	var key = new Key(event.which);

	// Update the appropriate lists
	downKeys[key] = key; // add key to the list of keys currently being pressed down
	chordKeys[key] = key; // add key to the list of keys in this stroke

	// Update the display
	$('.code' + key.getKeyCode()).css('background-color', '#ff0000'); // color the qwerty keyboard
	colorCode(chordKeys); // color the steno keyboard

	// See if this key is a valid steno key
	if (!keyCodeToSteno[key.getKeyCode()]) { // if the key code does not have a steno tranlation
		isSteno = false;
		console.debug("Steno false on keydown");
	}

	
	// Handle potential conflicts
	// removed check for isSteno here to prevent "stop working after error" bug --Erika
	event.preventDefault(); // will prevent potential conflicts with browser hotkeys like firefox's hotkey for quicklinks (')

});

/**
 * This will handle the key up event.
 * @event
 * @see keydown method: http://api.jquery.com/keyup/
 * @see event.preventDefault method: http://api.jquery.com/event.preventDefault/
 * @see event.stopPropagation method: http://api.jquery.com/event.stopPropagation/
 * @see jQuery.isEmptyObjecy method: http://api.jquery.com/jQuery.isEmptyObject/
 */
$(document).keyup(function (event) {
	// Create a new Key Object based on the event.
	var key = new Key(event.which);

	// Update the appropriate lists
	delete downKeys[key]; // remove key from the list of keys currently being pressed down

	// Update the display
	$('.stdKey.code' + event.which).css('background-color', '#000000'); // color the qwerty keyboard

	if (isSteno) {
		// Check to see if this is the end of the stroke.
		if ($.isEmptyObject(downKeys)) { // if no more keys are being pressed down, this is the end of the stroke.
			var timestamp = new Date();
			var chord = new Chord(chordKeys);
			var verticalNote = new VerticalNote(timestamp, chord);
			var word = new Word([chord]);

			chords.push(chord);
			verticalNotes.push(verticalNote);

			$('#verticalNotes').append(verticalNote.toString());
			document.getElementById('verticalNotes').scrollTop = document.getElementById('verticalNotes').scrollHeight; // scroll the textarea to the bottom

			if (words.length > 0 && chord.toRTFCRE() !== '*' && dictionary[words[words.length - 1].toString() + '/' + chord.toRTFCRE()]) {
				words[words.length - 1].addStroke(chord);
			} else if (words.length > 0 && chord.toRTFCRE() === '*') {
				words[words.length - 1].removeStroke();
				if (words[words.length - 1].toString() === '') {
					words.pop();
				}
			} else {
				words.push(word);
			}
			
			translatedString = '';
			for (i = 0; i < words.length; i++) {
				translatedString += words[i].toEnglish() + ' ';
			}
			$('#output').html(demetafy(translatedString));
			document.getElementById('output').scrollTop = document.getElementById('output').scrollHeight; //scroll the textarea to the bottom
		}

	
		// Handle potential conflicts
		event.preventDefault();	// will prevent potential conflicts with browser hotkeys like firefox's hotkey for quicklinks (')
		//event.stopPropagation();
	}
});

/**
 * This will handle the event when the window loses focus.
 * @event
 * @see jQuery's <a href="http://api.jquery.com/blur/">blur method</a>
 */
$(window).blur(function () {
	resetKeys();
});

/**
 * This will handle the event when the window gains focus.
 * @event
 * @see jQuery's <a href="http://api.jquery.com/focus/">focus method</a>
 */
$(window).focus(function () {
	resetKeys();
});