import Typewriter from './app';
import createMockRaf from 'mock-raf';
let mockRaf = createMockRaf();
let clock = sinon.useFakeTimers();
sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);

describe('Top level typewriter', () => {
	beforeEach(() => {
		let rootEl = document.createElement('div');
		rootEl.id = 'root';
		document.body.appendChild(rootEl);
	})
	it('requires id parameter',() => {
		let obj = new Typewriter(null);
		expect(obj).to.be.empty;
	});
	it('requires options param', () => {
		let obj = new Typewriter('root', null);
		expect(obj).to.be.empty;
	});
	it('will have _settings object', () => {
		let obj = new Typewriter('root', {});
		expect(obj._settings).to.not.be.empty;
	});
	it('should have the dom element', () => {
		let obj = new Typewriter('root', {});
		expect(obj.el.id).to.be.equal('root');
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
			textWrapper.innerHTML = "";
		})
		it('should have a classname of text-placeholder', () => {
			expect(root.getElementsByClassName('text-placeholder')[0]).to.be.ok;
			expect(root.getElementsByClassName('text-not-here')[0]).to.not.be.ok;
		});
		describe('with varied speed settings', () => {
			it('write text out w/ regular settings', (done) => {
				obj
				  .typeCharacters('Hi')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(2);
				  	done();
				  });
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);

			});
			it('write text out w/ fast settings', (done) => {
				obj.transformSettings({typingSpeed: 'fast'});
				obj
				  .typeCharacters('Hi')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(2);
				  	done();
				  });
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);

			});
			it('write text out w/ slow settings', (done) => {
				obj.transformSettings({typingSpeed: 'slow'});
				obj
				  .typeCharacters('Hi')
				  .start(() => {
				  	expect(textWrapper.childElementCount).to.be.equal(2);
				  	done();
				  });
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);
				  mockRaf.step({count: 1});
				  clock.tick(1000);

			});
		})
	})
});