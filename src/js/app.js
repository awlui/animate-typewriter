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
		this.el.outline = 'none';
		this._htmlWorkingArray = [];
		this._currentCharIdArray = [];
		this._eventQueue = [];
		this._eventRunning = false;
		//default settings;
		this._settings = {
			dev: true,
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
				className: 'moving-cursor',
				flashSpeed: 100

			},
			characters: {
				className: 'text-placeholder',
				text: "",
				paused: false
			}

		}
		this._insertTypewriterPlaceholder();
		this._playCursorAnimation();
	}
	start(cb=(() => {})) {
		this._startEventLoop(cb);
		return this;
	}
	typeCharacters(string) {
		this._addToEventQueue({action: "Type String", data: string});
		return this;
	}
	deleteCharacters(n) {
		this._addToEventQueue({action: "Delete String", amount: n});
		return this;
	}
	pauseFor(ms) {
		this._addToEventQueue({action: "Pause", duration: ms});
		return this;
	}
	_pauseFor(ms, cb) {
		this._eventRunning = true;
		setTimeout(() => {
			this._eventRunning = false;
			this._startEventLoop(cb);
		}, ms);
	}
	pause() {
		this._settings.cursor.paused = true;
		this._settings.characters.paused = true;
	}
	_addToEventQueue(event) {
		this._eventQueue.push(event);
	}
	_startEventLoop(cb) {
		if (this._eventQueue.length === 0) {
			cb();
			return;
		}
		while (this._eventQueue.length > 0 && this._eventRunning === false) {
			let workingEvent = this._eventQueue.shift();
			switch (workingEvent.action) {
				case 'Type String':
					this._typeCharacters(workingEvent.data, cb);
					break;
				case 'Delete String':
					this._deleteCharacters(workingEvent.amount, cb);
					break;
				case 'Move Cursor':
					this._movePointer(workingEvent.steps, workingEvent.direction, cb);
					break;
				case 'Pause':
					this._pauseFor(workingEvent.duration, cb);
					break;
			}
		}
	}
	_playCursorAnimation() {
		const cursor = document.createElement('span');
		cursor.innerHTML = this._settings.cursor.text;
		cursor.className = this._settings.cursor.className;
		cursor.id = 'cursor-placeholder';
		cursor.style.width = '10px !important';
		cursor.style.backgroundColor = `rgba(0,0,0,${1})`;
		cursor.style.fontSize = this._settings.fontSize;
		this.el.appendChild(cursor);

		if (!this._settings.cursor.paused) {
			this._unsubscribeCursorAnimation = window.requestAnimationFrame(() => this._cursorAnimationFrame());
		}

	}
	_cursorAnimationFrame() {
		if (!this._settings.cursor.paused) {
			const flash_speed = this._settings.cursor.flashSpeed;
			const increment_opacity = (1/1000) * flash_speed;
			const cursor = document.querySelector(`.${this._settings.cursor.className}`) || document.getElementById('cursor-placeholder');
			cursor.style.fontSize = this._settings.fontSize;
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
			this._unsubscribeCursorAnimation = window.requestAnimationFrame(() => {this._cursorAnimationFrame()})
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
			window.cancelAnimationFrame(this.unsubscribeTypeAnimation);
			this._eventRunning = false;
			this._startEventLoop(cb);
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
					textWrapper.insertBefore(nextLetter, currentEl);
					this.unsubscribeTypeAnimation = window.requestAnimationFrame(() => {this._typewriterAnimationFrame(cb)});

				}, rate);
			} else {
				setTimeout(() => {
					let nextLetter = this._htmlWorkingArray.shift();
					textWrapper.appendChild(nextLetter);
					this.unsubscribeTypeAnimation = window.requestAnimationFrame(() => {this._typewriterAnimationFrame(cb)});
				}, rate);
			}

		} else {
			window.cancelAnimationFrame(this.unsubscribeTypeAnimation);
			this._eventRunning = false;
			this._startEventLoop(cb);
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
			htmlChar.innerHTML = char === " " ? "&nbsp;" : char;
			htmlChar.id = this._generateUniqueId();
			htmlChar.style.fontStyle = 'normal';
			htmlArr.push(htmlChar);
			idArr.push(htmlChar.id);
		});
		this._htmlWorkingArray = htmlArr;


		if (this._settings.currentPositionId) {
			let currentIndex = this._findIndexById(this._settings.currentPositionId);
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
	moveLeft(n) {
		this._addToEventQueue({action: "Move Cursor", steps: n, direction: 'left'});
		return this;
	}
	moveRight(n) {
		this._addToEventQueue({action: "Move Cursor", steps: n, direction: 'right'});
		return this;
	}
	_movePointer(n, direction, cb) {
		this._eventRunning = true;
		this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n, direction, cb)});
	}
	_moveCursorAnimationFrame(n, direction, cb) {
		let rate = this._settings.cursorMoveSpeed;
		let currentIndex;
		if (n <= 0) {
			this._eventRunning = false;
			this._startEventLoop(cb);
			return;
		}
		if (direction === 'left') {
			setTimeout(() => {
				if (!this._settings.currentPositionId) {
					if (this._currentCharIdArray.length >= n) {
							document.querySelector(`.${this._settings.cursor.className}`).style.backgroundColor = `rgba(0,0,0,0)`;
							this.el.querySelector(`.${this._settings.cursor.className}`).className = "";
							this._settings.currentPositionId = this._currentCharIdArray[this._currentCharIdArray.length-1];
							document.getElementById(`${this._settings.currentPositionId}`).className = this._settings.cursor.className;
							document.getElementById(`${this._settings.currentPositionId}`).className = this._settings.cursor.className;
							

						
						this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n-1, 'left', cb)});
					} else {
						let maxedOut = this._currentCharIdArray.length;
						this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(maxedOut, 'left', cb)});
					}
				} else {
					let currentIndex = this._findIndexById(this._settings.currentPositionId);
					if (currentIndex >= n) {
						document.querySelector(`.${this._settings.cursor.className}`).style.backgroundColor = `rgba(0,0,0,0)`;
						document.querySelector(`.${this._settings.cursor.className}`).className = "";
						currentIndex = this._currentCharIdArray.indexOf(this._settings.currentPositionId);
						currentIndex -= 1;
						this._settings.currentPositionId = this._currentCharIdArray[currentIndex];
						document.getElementById(`${this._settings.currentPositionId}`).className = this._settings.cursor.className;
						this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n-1, 'left', cb)});
					} else {
						let maxedOut = currentIndex;
						this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(maxedOut, 'left', cb)});
					}
				}
			}, 200);
		}
		if (direction === 'right') {
			setTimeout(() => {
				if (!this._settings.currentPositionId) {
					document.getElementById('cursor-placeholder').className = this._settings.cursor.className;
					this._eventRunning = false;
					this._startEventLoop(cb);
					return;
				} else {
					let totalCount = this._currentCharIdArray.length;
					let currentIndex = this._findIndexById(this._settings.currentPositionId);
					let diff = totalCount - currentIndex;
					if (n <= diff) {
						document.querySelector(`.${this._settings.cursor.className}`).style.backgroundColor = `rgba(0,0,0,0)`;
						document.querySelector(`.${this._settings.cursor.className}`).className = "";
						currentIndex = this._currentCharIdArray.indexOf(this._settings.currentPositionId);
						currentIndex += 1;
						this._settings.currentPositionId = (typeof this._currentCharIdArray[currentIndex] === 'undefined') ? null : this._currentCharIdArray[currentIndex];
						if (this._currentCharIdArray[currentIndex]) {
							document.getElementById(`${this._settings.currentPositionId}`).className = this._settings.cursor.className;
							this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n-1, 'right', cb)});
						} else {
							this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(n, 'right', cb)});
						}
					} else {
						this.unsubscribeMoveCursorAnimation = window.requestAnimationFrame(() => {this._moveCursorAnimationFrame(diff, 'right', cb)});
					}
				}
			}, 200)
		}

	}
	_deleteCharacters(n, cb) {
		this._eventRunning = true;
		if (typeof n === 'number') {
			this._deleteCharacterAnimationFrame(n, cb);
		} else if (typeof n === 'string') {
			if (n === 'delete all') {
			this._deleteCharacterAnimationFrame(this._currentCharIdArray.length, cb);
			}
		}
	}
	_deleteCharacterAnimationFrame(n, cb) {
		let textWrapper = this.el.getElementsByClassName(this._settings.characters.className)[0];
		let deleteSpeed = this._settings.deleteSpeed;
		let rate;
		switch(deleteSpeed) {
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
			setTimeout(() => {
				if (n <= 0) {
					this._eventRunning = false;
					window.cancelAnimationFrame(this.unsubscribeDeleteCharacterAnimation);
					this._startEventLoop(cb);
					return;
				}
				if (!this._settings.currentPositionId) {
					if (n <= this._currentCharIdArray.length) {
						let charToDelete = document.getElementById(this._currentCharIdArray.pop());
						textWrapper.removeChild(charToDelete);
						this.unsubscribeDeleteCharacterAnimation = window.requestAnimationFrame(() => {this._deleteCharacterAnimationFrame(n-1, cb)});
					} else {
						let max = this._currentCharIdArray.length;
						this.unsubscribeDeleteCharacterAnimation = window.requestAnimationFrame(() => {this._deleteCharacterAnimationFrame(max, cb)});
					}
				} else {
					if (n <= this._findIndexById(this._settings.currentPositionId)) {
						let currentIndex = this._findIndexById(this._settings.currentPositionId);
						let charToDelete = document.getElementById(this._currentCharIdArray[currentIndex-1]);
						textWrapper.removeChild(charToDelete);
						this._currentCharIdArray = [...this._currentCharIdArray.slice(0,currentIndex-1), ...this._currentCharIdArray.slice(currentIndex)]
						this.unsubscribeDeleteCharacterAnimation = window.requestAnimationFrame(() => {this._deleteCharacterAnimationFrame(n-1,cb)});
					} else {
						let max = this._findIndexById(this._settings.currentPositionId);
						this.unsubscribeDeleteCharacterAnimation = window.requestAnimationFrame(() => {this._deleteCharacterAnimationFrame(max,cb)});
					}

				}
			}, rate);
	}
	_randomWithinRange(min, max) {
		return (Math.floor(Math.random() * (max-min)) + min);
	}
	transformSettings(insertedSetting) {
		this._settings = Object.assign({}, this._settings, insertedSetting, {cursor: Object.assign({}, this._settings.cursor, insertedSetting.cursor)}, {characters: Object.assign({}, this._settings.characters, insertedSetting.characters)});
	}

}
module.exports = Typewriter;