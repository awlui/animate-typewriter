import foo from './app';
describe('test', () => {
	it('works', () => {
		var obj = new foo();
	})
	it('works again', () => {
		expect(true).to.be.true
	})
})