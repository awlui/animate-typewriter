import Typewriter from './app';
import createMockRaf from 'mock-raf';
let mockRaf = createMockRaf();
describe('Top level typewriter', () => {
	beforeEach(() => {
		let root = document.createElement('div');
		root.id = 'root';
		document.body.appendChild(root);
	})
	it('requires id parameter',() => {
		let obj = new Typewriter(null);
		expect(obj).to.be.empty;
	});
	it('requires options param', () => {
		let obj = new Typewriter('root', null);
		expect(obj).to.be.empty;
	});
	describe('Typewriter obj props', () => {
		it('will have _settings object', () => {
			let obj = new Typewriter('root', {});
			expect(obj._settings).to.not.be.empty;
		});
		it('_settings object will have _cursor object', () => {
			let obj = new Typewriter('root', {});
			expect(obj._settings.cursor).to.not.be.empty;
		});
		it('should have the dom element', () => {
			let obj = new Typewriter('root', {});
			expect(obj.el.id).to.be.equal('root');
		});
	})
	describe('animation frame change', () => {
		it('try it', () => {
			sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);
			let obj = new Typewriter('root', {});
			mockRaf.step({count: 20});
			
		})
	})
})