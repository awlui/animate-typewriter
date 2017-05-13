import './reqAnimShim';
export default class Typewriter {
	constructor(elId, settings={}) {
		if (!elId || typeof elId !== 'string') {
			console.error('Need ID for typewriter insert');
			return;
		}
		if (!settings || typeof settings !== 'object') {
			console.error('Need an object with settings');
			return;
		}
		this.el = document.getElementById(elId);
		//default settings;
		this._settings = {
			fontSize: '100px',
			cursor: {
				currentOpacity: 1,
				opacityIncreasing: false,
				paused: false,
				text: '|',
				className: 'typewriter-Cursor',
				flashSpeed: 100

			},
			characters: {

			}

		}
		this._playCursorAnimation();
	}
	_playCursorAnimation() {
		const cursor = document.createElement('span');
		cursor.innerHTML = this._settings.cursor.text;
		cursor.className = this._settings.cursor.className;
		cursor.style.fontSize = this._settings.fontSize;
		this.el.appendChild(cursor);

		if (!this._settings.cursor.paused) {
			this._cursorAnimation = window.requestAnimationFrame(() => this._cursorAnimationFrame());
		}

	}
	_cursorAnimationFrame() {
		if (!this._settings.cursor.paused) {
			const flash_speed = this._settings.cursor.flashSpeed;
			const increment_opacity = (1/1000) * flash_speed;
			const cursor = this.el.querySelector(`.${this._settings.cursor.className}`);

			if (this._settings.cursor.opacityIncreasing === true) {
				if (this._settings.cursor.currentOpacity >= 1) {
					this._settings.cursor.opacityIncreasing = false;
					this._settings.cursor.currentOpacity = 1;
				}
				this._settings.cursor.currentOpacity += increment_opacity;
			}
			if (this._settings.cursor.opacityIncreasing === false) {
				if (this._settings.cursor.currentOpacity <= 0) {
					this._settings.cursor.opacityIncreasing = true;
					this._settings.cursor.currentOpacity = 0;
				}
				this._settings.cursor.currentOpacity -= increment_opacity;
			}
			cursor.style.opacity = this._settings.cursor.currentOpacity;
			this._cursorAnimation = window.requestAnimationFrame(() => {this._cursorAnimationFrame()})
		}
	}
}
