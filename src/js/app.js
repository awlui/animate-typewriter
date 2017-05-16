import './reqAnimShim';
import uuid from 'node-uuid';
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
		this._htmlWorkingArray = [];
		this._currentCharIdArray = [];
		this._eventQueue = [];
		this._eventRunning = false;
		//default settings;
		this._settings = {
			fontSize: '50px',
			currentPositionId: null,
			cursorMoveSpeed: 100,
			typingSpeed: 'medium',
			deleteSpeed: 'medium',
			cursor: {
				currentOpacity: 1,
				opacityIncreasing: false,
				paused: false,
				text: '&nbsp;',
				className: 'cursor-placeholder',
				flashSpeed: 100

			},
			characters: {
				className: 'text-placeholder',
				text: ""
			}

		}
		this._insertTypewriterPlaceholder();
		this._playCursorAnimation();
	}
	start(cb) {
		this._startEventLoop(cb);
		return this;
	}
	typeCharacters(string) {
		this._addToEventQueue({action: "Type String", data: string});
		return this;
	}
	pause() {

	}
	_addToEventQueue(event) {
		this._eventQueue.push(event);
	}
	_startEventLoop(cb) {
		while (this._eventQueue.length > 0) {
			let workingEvent = this._eventQueue.shift();
			switch (workingEvent.action) {
				case 'Type String':
					this._typeCharacters(workingEvent.data, cb);
					break;
				// case 'Move Cursor':
				// 	this._movePointer(workingEvent.steps, workingEvent.direction);
				// 	break;
				default:
					break;;
			}
		}
	}
	_playCursorAnimation() {
		const cursor = document.createElement('span');
		cursor.innerHTML = this._settings.cursor.text;
		cursor.className = this._settings.cursor.className;
		cursor.style.backgroundColor = `rgba(0,0,0,${1})`
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
			if (this._settings.cursor.opacityIncreasing == true) {
				if (this._settings.cursor.currentOpacity >= 1) {
					this._settings.cursor.opacityIncreasing = false;
					this._settings.cursor.currentOpacity = 1;
				}
				this._settings.cursor.currentOpacity += increment_opacity;
			}
			if (this._settings.cursor.opacityIncreasing == false) {
				if (this._settings.cursor.currentOpacity <= 0) {
					this._settings.cursor.opacityIncreasing = true;
					this._settings.cursor.currentOpacity = 0;
				}
				this._settings.cursor.currentOpacity -= increment_opacity;
			}
			cursor.style.backgroundColor = `rgba(0,0,0,${this._settings.cursor.currentOpacity})`;
			this._cursorAnimation = window.requestAnimationFrame(() => {this._cursorAnimationFrame()})
		}
	}
	_insertTypewriterPlaceholder() {
		const characters = document.createElement('span');
		characters.innerHTML = this._settings.characters.text;
		characters.className = this._settings.characters.className;
		characters.style.fontSize = this._settings.fontSize;
		this.el.appendChild(characters);
	}

	_typewriterAnimationFrame(cb) {
		let typingSpeed = this._settings.typingSpeed;
		let textWrapper = this.el.getElementsByClassName(this._settings.characters.className)[0];
		let rate;
		if (this._htmlWorkingArray.length === 0) {
			window.cancelAnimationFrame(() => {this.unsubscribeTypeAnimation()});
			this._eventRunning = false;
			cb();

			// this._startEventLoop(cb);

			return;
		}
		switch(typingSpeed) {
			case 'slow':
				rate = this._randomWithinRange(150, 250);
				break;
			case 'medium':
				rate = this._randomWithinRange(100, 200);
				break;
			case 'fast':
				rate = this._randomWithinRange(50, 150);
				break;
		}
		if (!this._settings.characters.paused) {
			if (this._settings.currentPositionId) {
				let currentEl = document.getElementById(this._settings.currentPositionId);
				setTimeout(() => {
					let nextLetter = this._htmlWorkingArray.shift();
					this.el.insertBefore(nextLetter, currentEl);
					this.unsubscribeTypeAnimation = window.requestAnimationFrame(() => {this._typewriterAnimationFrame(cb)});

				}, rate);
			} else {
				setTimeout(() => {
					let nextLetter = this._htmlWorkingArray.shift();
					textWrapper.appendChild(nextLetter);
					this.unsubscribeTypeAnimation = window.requestAnimationFrame(() => {this._typewriterAnimationFrame(cb)});
				}, rate);
			}

		}
	}
	_typeCharacters(characters, cb) {
		let stringArr = [];
		let htmlArr =[];
		let idArr = [];
		this._eventRunning = true;
		if (characters && typeof characters === 'string') {
			stringArr = characters.split('');
		}
		stringArr.forEach((char) => {
			let htmlChar = document.createElement('i');
			htmlChar.innerHTML = char;
			htmlChar.id = this._generateUniqueId();
			htmlArr.push(htmlChar);
			idArr.push(htmlChar.id);
		});
		this._htmlWorkingArray = htmlArr;


		if (this.currentPositionId) {
			let currentIndex = this._findIndexById(this.currentPositionId);
			if (currentIndex > 0) {
				this._currentCharIdArray = [...this._currentCharIdArray.slice(0, currentIndex), ...idArr, ...this._currentCharIdArray.slice(currentIndex)];
			} else {
				if (currentIndex === 0) {
					this._currentCharIdArray = [...idArr, ...this._currentCharIdArray.slice()];
				} 
			}
		} else {
			this._currentCharIdArray = [...this._currentCharIdArray.slice(), ...idArr];
		}
		this.unsubscribeTypeAnimation = window.requestAnimationFrame(() => {this._typewriterAnimationFrame(cb)});
	}
	_generateUniqueId() {
		return uuid.v4();
	}
	_findIndexById(id) {
		if (id) {
			return this._currentCharIdArray.indexOf(id);
		}
	}
	// moveLeft(n) {
	// 	this._addToEventQueue({action: "Move Cursor", steps: n, direction: 'left'});
	// 	return this;
	// }
	// moveRight(n) {
	// 	this._addToEventQueue({action: "Move Cursor", steps: n, direction: 'right'});
	// 	return this;
	// }
	// _movePointer(n, direction) {
	// 	this._eventRunning = true;
	// 	this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n, direction)});
	// }
	// _moveCursorAnimationFrame(n, direction) {
	// 	let rate = this._settings.cursorMoveSpeed;
	// 	let currentIndex;
	// 	if (n <= 0) {
	// 		this._eventRunning = false;
	// 		this._startEventLoop();
	// 		return;
	// 	}
	// 	if (direction === 'left') {
	// 		setTimeout(() => {
	// 			if (this._currentCharIdArray <= n) {
	// 				if (!this.currentPositionId) {
	// 					this.el.querySelector(`.${this._settings.cursor.className}`).className = "";
	// 					this.currentPositionId = this._currentCharIdArray[-1];
	// 					this.el.getElementById(`${this.currentPositionId}`).className = this._settings.cursor.className;
						
	// 				} else {
	// 					this.el.querySelector(`.${this._settings.cursor.className}`).className = "";
	// 					currentIndex = this._currentCharIdArray.indexOf(this.currentPositionId);
	// 					currentIndex -= 1;
	// 					this.currentPositionId = this._currentCharIdArray[currentIndex];
	// 					this.el.getElementById(`${this.currentPositionId}`).className = this._settings.cursor.className;

	// 				}
	// 			}
	// 			this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n-1, 'left')});
	// 		}, rate);
	// 	}

	// }
	_randomWithinRange(min, max) {
		return (Math.floor(Math.random() * (max-min)) + min);
	}
	transformSettings(insertedSetting) {
		this._settings = Object.assign({}, ...this._settings, {cursor: this._settings.cursor}, {characters: this._settings.characters}, insertedSetting);
	}

}
