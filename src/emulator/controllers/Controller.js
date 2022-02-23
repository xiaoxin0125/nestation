import jsnes from "jsnes";

const BITS = [
	0b00000001,
	0b00000010,
	0b00000100,
	0b00001000,
	0b00010000,
	0b00100000,
	0b01000000,
	0b10000000
];

export default class Controller {
	constructor(player = 1, getNes, onSwap) {
		this.player = player;
		this.getNes = getNes;
		this.onSwap = onSwap;

		this.buttons = {
			BUTTON_A: false,
			BUTTON_B: false,
			BUTTON_SELECT: false,
			BUTTON_START: false,
			BUTTON_UP: false,
			BUTTON_DOWN: false,
			BUTTON_LEFT: false,
			BUTTON_RIGHT: false,
			SWAP: false
		};
	}

	syncAll(byte, swapButton) {
		this.sync("BUTTON_A", !!(byte & BITS[0]));
		this.sync("BUTTON_B", !!(byte & BITS[1]));
		this.sync("BUTTON_SELECT", !!(byte & BITS[2]));
		this.sync("BUTTON_START", !!(byte & BITS[3]));
		this.sync("BUTTON_UP", !!(byte & BITS[4]));
		this.sync("BUTTON_DOWN", !!(byte & BITS[5]));
		this.sync("BUTTON_LEFT", !!(byte & BITS[6]));
		this.sync("BUTTON_RIGHT", !!(byte & BITS[7]));
		this.sync("SWAP", !!swapButton);
	}

	sync(button, isPressed) {
		const nes = this.getNes();

		if (!this.buttons[button] && isPressed) {
			this.buttons[button] = true;
			nes.buttonDown(this.player, jsnes.Controller[button]);
			if (button === "SWAP") this.onSwap();
		} else if (this.buttons[button] && !isPressed) {
			this.buttons[button] = false;
			nes.buttonUp(this.player, jsnes.Controller[button]);
		}
	}

	toByte(source = this.buttons) {
		return (
			(source.BUTTON_A && BITS[0]) |
			(source.BUTTON_B && BITS[1]) |
			(source.BUTTON_SELECT && BITS[2]) |
			(source.BUTTON_START && BITS[3]) |
			(source.BUTTON_UP && BITS[4]) |
			(source.BUTTON_DOWN && BITS[5]) |
			(source.BUTTON_LEFT && BITS[6]) |
			(source.BUTTON_RIGHT && BITS[7])
		);
	}

	toSwapByte(source = this.buttons) {
		return +source.SWAP;
	}
}
