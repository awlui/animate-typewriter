import Typewriter from './app';
import createMockRaf from 'mock-raf';
let mockRaf = createMockRaf();
let clock = sinon.useFakeTimers();

const defaultSettings = {
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

		};
sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);

function frameAndTick(loops, frames, ticks) {
	for (let i = 0; i < loops; i++) {
	  mockRaf.step({count: frames});
	  clock.tick(ticks);
	}
}

describe('Top level typewriter', () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		let rootEl = document.createElement('div');
		rootEl.id = 'root';
		document.body.appendChild(rootEl);
	})
	it('requires id parameter',() => {
		let obj = new Typewriter(null);
		expect(obj).to.be.empty;
	});
	it('has transform setting function', () => {
		let obj = new Typewriter('root', null);
		expect(obj._transformSettings).to.be.function;
	});	
	it('requires options param', () => {
		let obj = new Typewriter('root', null);
		expect(obj).to.be.empty;
	});
	it('will have _settings object', () => {
		let obj = new Typewriter('root', {});
		expect(obj._settings).to.not.be.empty;
	});
	it('it can loop if set loop set to true in settings', () => {
		let obj = new Typewriter('root', {loop: true});
		obj.typeCharacters('hello').start();
		frameAndTick(12, 1, 1000);
	});
	it('I can pause for a given number of ms', () => {
		let obj = new Typewriter('root');
		expect(obj._eventRunning).to.be.false;
		obj
		.pauseFor(2000)
		.start()
		expect(obj._eventRunning).to.be.true;
		clock.tick(2000);
		expect(obj._eventRunning).to.be.false;
	})
	it('should have the dom element', () => {
		let obj = new Typewriter('root', {});
		expect(obj.el.id).to.be.equal('root');
	});
	it('index to id should return undefined when giving nothing',() => {
		let obj = new Typewriter('root');
		expect(obj._findIndexById()).to.be.falsy;
	});
	it('i can change settings',() => {
		let obj = new Typewriter('root');
		expect(obj._settings.cursor.currentOpacity).to.be.equal(1);
		obj._transformSettings({cursor: {
			"currentOpacity": 0.5
		}})
		expect(obj._settings.cursor.currentOpacity).to.be.equal(0.5);
	});
	describe('Typewriter cursor', () => {
		it('_settings object will have _cursor object', () => {
			let obj = new Typewriter('root', {});
			expect(obj._settings.cursor).to.not.be.empty;
		});
		describe('cursor animation frame change', () => {
			it('Opacity of 0.9 on first frame request', () => {
				let obj = new Typewriter('root', {});
				mockRaf.step({count: 24});
				expect(obj._settings.cursor.currentOpacity).within(-0.1, 1.1);

			});
		});
	});
	describe('Typewriter text', () => {
		let obj, textWrapper, root;
		beforeEach(() => {
			obj = new Typewriter('root', {});
			root = document.getElementById('root');
			textWrapper = root.getElementsByClassName('text-placeholder')[0];
		});
		afterEach(() => {
			root.innerHTML = "";
		})
		it('should have a classname of text-placeholder', () => {
			expect(root.getElementsByClassName('text-placeholder')[0]).to.be.ok;
			expect(root.getElementsByClassName('text-not-here')[0]).to.not.be.ok;
		});
		it('should not run when paused', (done) => {
			obj.pause();
			obj
			  .typeCharacters('an')
			  .start(() => {
			  	expect(textWrapper.childElementCount).to.be.equal(0);
			  	done();
			  });
			  frameAndTick(3, 1, 1000);		
		});
		it('should not print without input', (done) => {
			obj.pause();
			obj
			  .typeCharacters()
			  .start(() => {
			  	expect(textWrapper.childElementCount).to.be.equal(0);
			  	done();
			  });
			  frameAndTick(3, 1, 1000);		
		})
		describe('with varied speed settings', () => {
			beforeEach(() => {
				obj = new Typewriter('root', {});
				root = document.getElementById('root');
				textWrapper = root.getElementsByClassName('text-placeholder')[0];
			});
			afterEach(() => {
				textWrapper.innerHTML = "";
			})
			it('write text out w/ regular settings', (done) => {
				obj
				  .typeCharacters('an')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(2);
				  	done();
				  });
				  frameAndTick(3, 1, 1000);

			});
			it('write text out w/ fast settings', (done) => {
				obj._transformSettings({typingSpeed: 'fast'});
				obj
				  .typeCharacters('and')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(3);
				  	done();
				  });
				  frameAndTick(4, 4, 1000);

			});
			it('write text out w/ slow settings', (done) => {
				obj._transformSettings({typingSpeed: 'slow'});
				obj
				  .typeCharacters('andy')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(4);
				  	done();
				  });
				  frameAndTick(5, 5, 1000);

			});
		})
	});
	describe('typewriter cursor move feature', () => {
		let obj, root, textWrapper;
		beforeEach(() => {
			obj = new Typewriter('root', {});
			root = document.getElementById('root');
			textWrapper = root.getElementsByClassName('text-placeholder')[0];
		});
		afterEach(() => {
			root.innerHTML = "";
		});
		it('can move 1 space to left', (done) => {
			obj
			  .typeCharacters('he')
			  .moveLeft(1)
			  .typeCharacters('z')
			  .start(() => {
			  	expect(textWrapper.childElementCount).to.be.equal(3);
			  	done();
			  });
			  frameAndTick(10, 10, 2000);


		});
		it('can move to beginning space', (done) => {
			obj
			  .typeCharacters('he')
			  .moveLeft(2)
			  .typeCharacters('z')
			  .start(() => {
			  	expect(textWrapper.childElementCount).to.be.equal(3);
			  	done();
			  });
			  frameAndTick(10, 10, 2000);


		});
		it('can\'t move further than the beginning space starting from cursor-placeholder', (done) => {
			obj
			  .typeCharacters('he')
			  .moveLeft(5)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(obj._currentCharIdArray[0]);
			  	done();
			  });
			  frameAndTick(10, 10, 2000);


		});
		it('can\'t move further than the beginning space starting from anywhere else', (done) => {
			obj
			  .typeCharacters('Orange')
			  .moveLeft(1)
			  .moveLeft(10)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(obj._currentCharIdArray[0]);
			  	done();
			  });
			  frameAndTick(20, 10, 2000);


		});
		it('can move left and then right and get to the same place', (done) => {
			obj
			  .typeCharacters('Andy is cool.')
			  .moveLeft(5)
			  .moveRight(5)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(null);
			  	done();
			  });
			  frameAndTick(30, 10, 2000);


		});
		it('can move to the left 6 then right 5', (done) => {
			obj
			  .typeCharacters('Andy is cool.')
			  .moveLeft(6)
			  .moveRight(5)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(obj._currentCharIdArray[obj._currentCharIdArray.length-1]);
			  	done();
			  });
			  frameAndTick(30, 10, 2000);


		});
		it('can move to the left then right but not over the cursor placeholder', (done) => {
			obj
			  .typeCharacters('Andy is cool.')
			  .moveLeft(6)
			  .moveRight(10)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(null);
			  	done();
			  });
			  frameAndTick(30, 10, 2000);


		});
		it('can only move as far as the cursor placeholder', (done) => {
			obj
			  .typeCharacters('Andy is cool.')
			  .moveRight(5)
			  .start(() => {
			  	expect(obj._settings.currentPositionId).to.be.equal(null);
			  	done();
			  });
			  frameAndTick(30, 10, 2000);


		});
	})
	describe('the delete feature', () => {
		let obj, root, textWrapper;
		beforeEach(() => {
			obj = new Typewriter('root', {});
			root = document.getElementById('root');
			textWrapper = root.getElementsByClassName('text-placeholder')[0];
			obj
			  .typeCharacters('hello')
			  .start()
			frameAndTick(10, 10, 1000);
		});
		afterEach(() => {
			root.innerHTML = "";
		});
		it('you can delete characters by specifying a number', () => {
			expect(textWrapper.childElementCount).to.be.equal(5);
			obj
			  .deleteCharacters(2)
			  .start();
			frameAndTick(5, 5, 1000);
			expect(textWrapper.childElementCount).to.be.equal(3);
 		});
 		it('if you try to delete more than the max allowable, it will just delete the max and not error', () => {
			expect(textWrapper.childElementCount).to.be.equal(5);
			obj
			  .deleteCharacters(100)
			  .start();
			frameAndTick(10,10,1000);
			expect(textWrapper.childElementCount).to.be.equal(0);

 		});
 		it('you can delete characters with "delete all"', () => {
			expect(textWrapper.childElementCount).to.be.equal(5);
			obj
			  .deleteCharacters('delete all')
			  .start();
			frameAndTick(5,5,1000);
			expect(textWrapper.childElementCount).to.be.equal(0);
 		});
 		it('can change delete speed', () => {
 			obj._transformSettings({deleteSpeed: 'fast'});

 			obj.deleteCharacters('delete all')
 			.start();

 			frameAndTick(5,5,1000);
 			expect(textWrapper.childElementCount).to.be.equal(0);
 		});
 		it('can change delete speed', () => {
 			obj._transformSettings({deleteSpeed: 'slow'});

 			obj.deleteCharacters('delete all')
 			.start();

 			frameAndTick(5,5,1000);
 			expect(textWrapper.childElementCount).to.be.equal(0);
 		});
 		describe('after moving around', () => {
 			it('can still delete', () => {
 				expect(textWrapper.childElementCount).to.be.equal(5);

 				obj 
 				 .moveLeft(3)
 				 .deleteCharacters('delete all')
 				 .start()

 				 frameAndTick(10,5,1000);

 				 expect(textWrapper.childElementCount).to.be.equal(3);
 			});
 			it('won\'t delete if on index 0', () => {
 				expect(textWrapper.childElementCount).to.be.equal(5);

 				obj
 				  .moveLeft(100)
 				  .deleteCharacters(5)
 				  .start()

 				  frameAndTick(10,5,1000);
 				  expect(textWrapper.childElementCount).to.be.equal(5);
 			})
 		});
	})
});